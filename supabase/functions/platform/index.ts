import { createClient } from 'npm:@supabase/supabase-js@2.110.0';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';
import QRCode from 'npm:qrcode@1.5.4';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try {
  const token=req.headers.get('Authorization')?.replace(/^Bearer /,'');
  if(!token)return json({error:'Sign in required'},401);
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
  const {data:{user},error:authError}=await db.auth.getUser(token);
  if(authError||!user)return json({error:'Invalid session'},401);
  const {data:admin,error:adminError}=await db.from('c8_admins').select('user_id').eq('user_id',user.id).maybeSingle();
  if(adminError||!admin)return json({error:'Administrator access required'},403);
  const body=await req.json();
  if(body.action!=='issue')return json({error:'Unknown action'},400);
  const signatory=Deno.env.get('C8_SIGNATORY_NAME'),role=Deno.env.get('C8_SIGNATORY_ROLE'),site=Deno.env.get('C8_SITE_URL');
  if(!signatory||!role||!site)return json({error:'Configure the authorized signatory and site URL before issuing documents.'},409);
  const {data:c,error:ce}=await db.from('c8_credentials').select('*').eq('id',body.credential).single();
  if(ce||!c)return json({error:'Credential not found'},404);
  if(c.status!=='pending')return json({error:'Only pending documents can be issued.'},409);
  const {data:s,error:se}=await db.from('c8_students').select('*').eq('id',c.student_id).single();
  if(se||!s)return json({error:'Student not found'},404);
  if(s.status==='withdrawn'||(['certificate','lor'].includes(c.kind)&&s.status!=='completed')||(c.kind==='lor'&&!s.lor_eligible))return json({error:'Student is not eligible for this document'},409);
  const {data:p,error:pe}=await db.from('c8_programs').select('title').eq('id',s.program_id).single();
  const {data:a,error:ae}=await db.from('c8_applications').select('reference').eq('id',s.application_id).single();
  if(pe||ae)throw Error('Program or application record unavailable');
  const pdf=await PDFDocument.create(),page=pdf.addPage([595,842]),font=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
  // Reject unsupported glyphs rather than silently changing a person's name.
  for(const value of [s.full_name,p.title,signatory,role])font.encodeText(value);
  const gold=rgb(.65,.51,.27),ink=rgb(.12,.14,.11);
  page.drawRectangle({x:24,y:24,width:547,height:794,borderColor:gold,borderWidth:1.5});
  const text=(value:string,y:number,size=12,strong=false)=>page.drawText(value,{x:48,y,size,font:strong?bold:font,color:ink,maxWidth:495,lineHeight:size*1.5});
  text('Cre8TechIN',775,27,true);text('CREATE TECH FOR INDIA FIRST',751,10);
  const names={student_id:'Student identification',offer_letter:'Program offer letter',certificate:'Certificate of completion',lor:'Letter of recommendation'};
  text(names[c.kind],687,26,true);text(`Reference: ${c.reference}  |  Version ${c.version}`,657,10);
  text(s.full_name,605,23,true);text(p.title,565,17,true);
  text(`Student ID: ${s.student_number}`,522);text(`Application: ${a.reference}`,497);
  text(`Duration: ${s.duration} month${s.duration===1?'':'s'}`,472);
  text(`Program dates: ${s.start_date} to ${s.end_date}`,447);
  const copy=c.kind==='offer_letter'?'Your application has been approved for the program and dates above. Your workspace contains the learning milestones, submission requirements and mentor feedback.':c.kind==='certificate'?'This confirms that the student named above completed the program and its required project milestones, following review and acceptance of their submitted work.':c.kind==='lor'?'Following completion and an eligibility review, Cre8TechIN recommends the student named above for their demonstrated participation and accepted project work in this program.':'This document identifies an approved participant in the program above. It is not a government-issued identity document.';
  text(copy,398,12);text(signatory,250,15,true);text(role,228,11);text(`Issued: ${new Date().toISOString().slice(0,10)}`,204,10);
  const verify=`${site.replace(/\/$/,'')}/verify.html?code=${encodeURIComponent(c.reference)}`;
  if(c.kind!=='offer_letter'){
   const qr=await QRCode.toDataURL(verify,{width:180,margin:1});const image=await pdf.embedPng(Uint8Array.from(atob(qr.split(',')[1]),c=>c.charCodeAt(0)));
   page.drawImage(image,{x:430,y:105,width:105,height:105});text('Scan to verify current credential status.',155,10);
  }else text('Private document. Access through your student workspace.',155,10);
  text('Validity is subject to the current status in Cre8TechIN records.',75,9);
  pdf.setTitle(`${names[c.kind]} - ${c.reference}`);pdf.setAuthor('Cre8TechIN');
  const path=`${s.id}/${c.id}-v${c.version}-${crypto.randomUUID()}.pdf`;
  const {error:uploadError}=await db.storage.from('c8-documents').upload(path,await pdf.save(),{contentType:'application/pdf',upsert:false});
  if(uploadError)throw Error('Could not store document');
  const {error:finalError}=await db.rpc('c8_finalize_document',{credential:c.id,expected_version:c.version,path,actor:user.id});
  if(finalError){await db.storage.from('c8-documents').remove([path]);return json({error:'The credential changed while generating. Refresh and try again.'},409);}
  return json({reference:c.reference,status:'issued',email:'pending_configuration'});
 }catch(e){console.error('Document operation failed',e instanceof Error?e.message:'Unknown error');return json({error:e instanceof Error&&e.message.includes('WinAnsi')?'The name contains characters unsupported by the current PDF font. Configure a Unicode font before issuing this document.':'Document generation failed. No successful issue was reported.'},500);}
});
