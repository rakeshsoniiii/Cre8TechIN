import {readFile,writeFile} from 'node:fs/promises';
// Only this public course data file is read. No reference project code or .env is executed.
const source=process.argv[2];
if(!source||!source.endsWith('courses.js'))throw Error('Pass the Skill Nexis src/data/courses.js path.');
const text=await readFile(source,'utf8');
const selected=['python','web-dev','ml-ai'];
const sql=value=>`'${String(value).replaceAll("'","''")}'`;
const data=selected.map(id=>{
 const section=text.split(`id: '${id}'`)[1]?.split(/\n\s*id: '/)[0];
 if(!section)throw Error(`Missing course ${id}`);
 const title=section.match(/title: '([^']+)'/)[1],description=section.match(/description: '([^']+)'/)[1];
 const videos=[...section.matchAll(/https:\/\/www\.youtube\.com\/embed\/[\w-]+/g)].map(m=>m[0]).slice(0,4);
 const tasks=['Learn the foundations and document a small working experiment.','Build a working prototype and explain your implementation decisions.','Add a useful feature, test it, and document improvements.','Present your completed project with a README, demo and reflection.'];
 return {slug:id,title,description,skills:id==='python'?'Python, problem solving, automation':id==='web-dev'?'HTML, CSS, JavaScript, responsive interfaces':'Python, data preparation, model evaluation',projects:id==='python'?'A documented Python automation tool':id==='web-dev'?'A responsive web application':'A small machine learning project with evaluation',curriculum:tasks.map((task,i)=>({title:['Foundations','Prototype','Iteration','Project showcase'][i],task,video:videos[i]}))};
});
await writeFile('src/learning-catalog.json',JSON.stringify(data,null,2)+'\n');
await writeFile('supabase/migrations/202610150002_program_drafts.sql','-- Adapted from the user-provided Skill Nexis course metadata and lecture links.\n-- Drafts require admin review and publication; they do not claim current availability.\n'+data.map(p=>`insert into public.c8_programs(slug,title,description,skills,projects,eligibility,curriculum,published) values(${[p.slug,p.title,p.description,p.skills,p.projects,'Students and early-career learners with access to a computer and internet',JSON.stringify(p.curriculum)].map(sql).join(',')},false) on conflict(slug) do nothing;`).join('\n')+'\n');
console.log('Imported 3 course drafts and 12 lecture references. No environment files accessed.');
