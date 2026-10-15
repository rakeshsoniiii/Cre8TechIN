-- Cre8TechIN Round 2. Run in the SQL editor of svnimrdtxcoxttcxifyr only.
create extension if not exists pgcrypto;
create table public.c8_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function public.c8_is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from c8_admins where user_id=auth.uid()) $$;
create table public.c8_programs (
 id uuid primary key default gen_random_uuid(), slug text unique not null check(slug ~ '^[a-z0-9-]+$'), title text not null,
 description text not null, skills text not null default '', projects text not null default '', mentorship text not null default 'Milestone feedback from an assigned mentor',
 eligibility text not null default '', mode text not null default 'Online', start_info text not null default 'Confirmed in your offer letter',
 durations integer[] not null default '{1,2,3,6}' check(durations <@ array[1,2,3,6] and cardinality(durations)>0),
 curriculum jsonb not null default '[]', published boolean not null default false, created_at timestamptz not null default now()
);
create table public.c8_applications (
 id uuid primary key default gen_random_uuid(), reference text unique not null default ('C8-APP-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),
 user_id uuid not null references auth.users(id), program_id uuid not null references c8_programs(id), duration integer not null check(duration in (1,2,3,6)),
 full_name text not null check(length(full_name) between 2 and 100), email text not null, phone text not null,
 college text not null, course text not null, branch text not null, passing_year integer not null check(passing_year between 1950 and 2100),
 linkedin text not null default '', portfolio text not null default '', motivation text not null, source text not null default '', resume_path text,
 consent_at timestamptz not null default now(), status text not null default 'submitted' check(status in ('submitted','correction_requested','approved','rejected')),
 review_note text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(user_id,program_id)
);
create table public.c8_students (
 id uuid primary key default gen_random_uuid(), application_id uuid unique not null references c8_applications(id), user_id uuid not null references auth.users(id),
 student_number text unique not null default ('C8-STU-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),
 full_name text not null, program_id uuid not null references c8_programs(id), duration integer not null check(duration in(1,2,3,6)),
 start_date date not null, end_date date not null check(end_date>start_date), status text not null default 'active' check(status in('active','completed','withdrawn')),
 lor_eligible boolean not null default false, created_at timestamptz not null default now()
);
create table public.c8_submissions (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references c8_students(id), milestone integer not null check(milestone>0),
 project_url text not null check(project_url ~ '^https://'), notes text not null default '',
 status text not null default 'submitted' check(status in('submitted','changes_requested','accepted')), feedback text not null default '',
 submitted_at timestamptz not null default now(), reviewed_at timestamptz, unique(student_id,milestone)
);
create table public.c8_credentials (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references c8_students(id),
 kind text not null check(kind in('student_id','certificate','lor','offer_letter')),
 reference text unique not null default ('C8-DOC-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),
 status text not null default 'pending' check(status in('pending','issued','revoked')), document_path text,
 version integer not null default 1, issued_at timestamptz, revoked_reason text, unique(student_id,kind)
);
create table public.c8_history (
 id bigint generated always as identity primary key, application_id uuid references c8_applications(id), actor uuid, event text not null,
 detail text not null default '', created_at timestamptz not null default now()
);
create table public.c8_email_outbox (
 id uuid primary key default gen_random_uuid(), application_id uuid references c8_applications(id), credential_id uuid references c8_credentials(id),
 event text not null, status text not null default 'pending' check(status in('pending','sending','sent','failed')), attempts integer not null default 0,
 last_error text, created_at timestamptz not null default now(), sent_at timestamptz
);
create table public.c8_events (id bigint generated always as identity primary key, event text not null check(event in('program_view','application_submitted','verification_view')), program_id uuid references c8_programs(id), created_at timestamptz not null default now());
-- All client-visible tables are protected. No user-editable role fields.
alter table c8_admins enable row level security;
alter table c8_programs enable row level security;
alter table c8_applications enable row level security;
alter table c8_students enable row level security;
alter table c8_submissions enable row level security;
alter table c8_credentials enable row level security;
alter table c8_history enable row level security;
alter table c8_email_outbox enable row level security;
alter table c8_events enable row level security;
create policy admin_self on c8_admins for select to authenticated using(user_id=auth.uid());
create function public.c8_has_application(program uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from c8_applications where program_id=program and user_id=auth.uid()) $$;
create policy program_read on c8_programs for select using(published or c8_is_admin() or c8_has_application(id));
create policy program_admin on c8_programs for all to authenticated using(c8_is_admin()) with check(c8_is_admin());
create policy application_read on c8_applications for select to authenticated using(user_id=auth.uid() or c8_is_admin());
create policy student_read on c8_students for select to authenticated using(user_id=auth.uid() or c8_is_admin());
create policy submission_read on c8_submissions for select to authenticated using(c8_is_admin() or exists(select 1 from c8_students s where s.id=student_id and s.user_id=auth.uid()));
create policy credential_read on c8_credentials for select to authenticated using(c8_is_admin() or exists(select 1 from c8_students s where s.id=student_id and s.user_id=auth.uid()));
create policy history_read on c8_history for select to authenticated using(c8_is_admin() or exists(select 1 from c8_applications a where a.id=application_id and a.user_id=auth.uid()));
create policy email_admin_read on c8_email_outbox for select to authenticated using(c8_is_admin());
create policy event_admin_read on c8_events for select to authenticated using(c8_is_admin());
grant select on c8_programs to anon,authenticated;
grant select on c8_admins,c8_applications,c8_students,c8_submissions,c8_credentials,c8_history,c8_email_outbox,c8_events to authenticated;
grant insert,update,delete on c8_programs to authenticated;
-- Mutations go through constrained functions, never arbitrary student table updates.
create function public.c8_apply(payload jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare a c8_applications; p c8_programs; uid uuid:=auth.uid(); mail text;
begin
 if uid is null then raise exception 'Sign in before applying'; end if;
 select email into mail from auth.users where id=uid and email_confirmed_at is not null;
 if mail is null then raise exception 'Confirm your email before applying'; end if;
 select * into p from c8_programs where id=(payload->>'program_id')::uuid and published;
 if p.id is null or not ((payload->>'duration')::integer=any(p.durations)) then raise exception 'Choose an available program and duration'; end if;
 if (payload->>'consent') is distinct from 'true' then raise exception 'Consent is required'; end if;
 if length(coalesce(payload->>'motivation',''))<20 then raise exception 'Tell us a little more about your background'; end if;
 if length(coalesce(payload->>'phone',''))<7 or length(coalesce(payload->>'college',''))<2 then raise exception 'Phone and college are required'; end if;
 if coalesce(payload->>'resume_path','')<>'' and payload->>'resume_path' not like uid::text||'/%' then raise exception 'Invalid resume'; end if;
 select * into a from c8_applications where user_id=uid and program_id=p.id for update;
 if a.id is not null and a.status<>'correction_requested' then return to_jsonb(a); end if;
 if a.id is null then
  if (select count(*) from c8_applications where user_id=uid and created_at>now()-interval '1 day')>=5 then raise exception 'Daily application limit reached'; end if;
  insert into c8_applications(user_id,program_id,duration,full_name,email,phone,college,course,branch,passing_year,linkedin,portfolio,motivation,source,resume_path)
  values(uid,p.id,(payload->>'duration')::integer,trim(payload->>'full_name'),mail,payload->>'phone',payload->>'college',payload->>'course',payload->>'branch',(payload->>'passing_year')::integer,coalesce(payload->>'linkedin',''),coalesce(payload->>'portfolio',''),payload->>'motivation',coalesce(payload->>'source',''),nullif(payload->>'resume_path','')) returning * into a;
 else
  update c8_applications set duration=(payload->>'duration')::integer,full_name=trim(payload->>'full_name'),phone=payload->>'phone',college=payload->>'college',course=payload->>'course',branch=payload->>'branch',passing_year=(payload->>'passing_year')::integer,linkedin=coalesce(payload->>'linkedin',''),portfolio=coalesce(payload->>'portfolio',''),motivation=payload->>'motivation',resume_path=coalesce(nullif(payload->>'resume_path',''),resume_path),status='submitted',updated_at=now() where id=a.id returning * into a;
 end if;
 insert into c8_history(application_id,actor,event) values(a.id,uid,'Application submitted');
 insert into c8_email_outbox(application_id,event) values(a.id,'application_submitted');
 insert into c8_events(event,program_id) values('application_submitted',p.id);
 return to_jsonb(a);
end $$;
create function public.c8_review_application(application uuid, decision text, note text default '', starts date default null) returns uuid language plpgsql security definer set search_path=public as $$
declare a c8_applications; s c8_students;
begin
 if not c8_is_admin() then raise exception 'Admin access required'; end if;
 if decision not in('approved','rejected','correction_requested') then raise exception 'Invalid decision'; end if;
 select * into a from c8_applications where id=application for update;
 if a.id is null then raise exception 'Application not found'; end if;
 if a.status='approved' then raise exception 'Application already approved'; end if;
 if decision='approved' then
  if starts is null then raise exception 'A start date is required'; end if;
  insert into c8_students(application_id,user_id,full_name,program_id,duration,start_date,end_date) values(a.id,a.user_id,a.full_name,a.program_id,a.duration,starts,(starts+make_interval(months=>a.duration))::date) returning * into s;
  insert into c8_credentials(student_id,kind) values(s.id,'student_id'),(s.id,'offer_letter');
 end if;
 update c8_applications set status=decision,review_note=note,updated_at=now() where id=a.id;
 insert into c8_history(application_id,actor,event,detail) values(a.id,auth.uid(),decision,note);
 insert into c8_email_outbox(application_id,event) values(a.id,decision);
 return s.id;
end $$;
create function public.c8_submit(student uuid, step integer, link text, comment text default '') returns void language plpgsql security definer set search_path=public as $$
declare s c8_students;
begin
 select * into s from c8_students where id=student and user_id=auth.uid() and status='active';
 if s.id is null then raise exception 'Active student record required'; end if;
 if step<1 or step>s.duration*4 or link !~ '^https://' or length(link)>2000 then raise exception 'Invalid milestone or HTTPS project URL'; end if;
 if step>1 and not exists(select 1 from c8_submissions where student_id=s.id and milestone=step-1 and status='accepted') then raise exception 'Previous milestone needs mentor approval'; end if;
 if exists(select 1 from c8_submissions where student_id=s.id and milestone=step and status='accepted') then raise exception 'Accepted work cannot be replaced'; end if;
 insert into c8_submissions(student_id,milestone,project_url,notes) values(s.id,step,link,comment) on conflict(student_id,milestone) do update set project_url=excluded.project_url,notes=excluded.notes,status='submitted',submitted_at=now();
 insert into c8_history(application_id,actor,event,detail) values(s.application_id,auth.uid(),'Milestone submitted',step::text);
end $$;
create function public.c8_review_submission(submission uuid, decision text, note text) returns void language plpgsql security definer set search_path=public as $$
declare sid uuid; aid uuid;
begin
 if not c8_is_admin() or decision not in('accepted','changes_requested') then raise exception 'Authorized review required'; end if;
 update c8_submissions set status=decision,feedback=note,reviewed_at=now() where id=submission returning student_id into sid;
 select application_id into aid from c8_students where id=sid;
 insert into c8_history(application_id,actor,event,detail) values(aid,auth.uid(),'Milestone '||decision,note);
end $$;
create function public.c8_complete(student uuid, eligible boolean) returns void language plpgsql security definer set search_path=public as $$
declare s c8_students;
begin
 if not c8_is_admin() then raise exception 'Admin access required'; end if;
 select * into s from c8_students where id=student for update;
 if s.id is null or (select count(*) from c8_submissions where student_id=s.id and status='accepted')<s.duration*4 then raise exception 'Every milestone must be accepted'; end if;
 update c8_students set status='completed',lor_eligible=eligible where id=s.id;
 insert into c8_credentials(student_id,kind) values(s.id,'certificate') on conflict do nothing;
 if eligible then insert into c8_credentials(student_id,kind) values(s.id,'lor') on conflict do nothing; end if;
 insert into c8_history(application_id,actor,event) values(s.application_id,auth.uid(),'Completion reviewed');
end $$;
create function public.c8_revoke(credential uuid, reason text) returns void language plpgsql security definer set search_path=public as $$
declare aid uuid;
begin
 if not c8_is_admin() or length(trim(reason))<3 then raise exception 'Admin and revocation reason required'; end if;
 update c8_credentials set status='revoked',revoked_reason=reason where id=credential;
 select s.application_id into aid from c8_students s join c8_credentials c on c.student_id=s.id where c.id=credential;
 insert into c8_history(application_id,actor,event,detail) values(aid,auth.uid(),'Credential revoked',reason);
end $$;
create function public.c8_correct_student(student uuid, corrected_name text, starts date, reason text) returns void language plpgsql security definer set search_path=public as $$
declare s c8_students;
begin
 if not c8_is_admin() or length(trim(corrected_name))<2 or length(trim(reason))<3 or starts is null then raise exception 'Authorized correction and reason required'; end if;
 update c8_students set full_name=trim(corrected_name),start_date=starts,end_date=(starts+make_interval(months=>duration))::date where id=student returning * into s;
 update c8_applications set full_name=s.full_name,updated_at=now() where id=s.application_id;
 update c8_credentials set status='pending',document_path=null,version=version+1 where student_id=student and status<>'revoked';
 insert into c8_history(application_id,actor,event,detail) values(s.application_id,auth.uid(),'Student corrected; documents require regeneration',reason);
end $$;
-- Exact reference lookup only; never expose email, phone, resume, or private records.
create function public.c8_verify(code text) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare result jsonb;
begin
 select jsonb_build_object('status',case when c.status='revoked' then 'Revoked' else 'Verified' end,'reference',c.reference,'kind',c.kind,'name',s.full_name,'student_id',s.student_number,'program',p.title,'duration',s.duration,'issued_at',c.issued_at,'start_date',s.start_date,'end_date',s.end_date,'version',c.version)
 into result from c8_credentials c join c8_students s on s.id=c.student_id join c8_programs p on p.id=s.program_id
 where c.reference=upper(trim(code)) and c.status in('issued','revoked') and c.kind in('student_id','certificate','lor');
 return coalesce(result,jsonb_build_object('status','Invalid'));
end $$;
create function public.c8_track(kind text, program uuid default null) returns void language plpgsql security definer set search_path=public as $$
begin
 if kind not in('program_view','verification_view') then raise exception 'Invalid event'; end if;
 insert into c8_events(event,program_id) values(kind,program);
end $$;
-- Do not grant anonymous mutation endpoints.
revoke all on function c8_apply(jsonb),c8_review_application(uuid,text,text,date),c8_submit(uuid,integer,text,text),c8_review_submission(uuid,text,text),c8_complete(uuid,boolean),c8_revoke(uuid,text),c8_correct_student(uuid,text,date,text) from public,anon;
grant execute on function c8_apply(jsonb),c8_review_application(uuid,text,text,date),c8_submit(uuid,integer,text,text),c8_review_submission(uuid,text,text),c8_complete(uuid,boolean),c8_revoke(uuid,text),c8_correct_student(uuid,text,date,text) to authenticated;
grant execute on function c8_verify(text),c8_track(text,uuid),c8_is_admin() to anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('c8-resumes','c8-resumes',false,5242880,array['application/pdf']),('c8-documents','c8-documents',false,10485760,array['application/pdf']) on conflict(id) do nothing;
create policy c8_resume_insert on storage.objects for insert to authenticated with check(bucket_id='c8-resumes' and (storage.foldername(name))[1]=auth.uid()::text);
create policy c8_resume_read on storage.objects for select to authenticated using(bucket_id='c8-resumes' and ((storage.foldername(name))[1]=auth.uid()::text or public.c8_is_admin()));
create policy c8_document_read on storage.objects for select to authenticated using(bucket_id='c8-documents' and exists(select 1 from public.c8_credentials c join public.c8_students s on s.id=c.student_id where c.document_path=name and c.status='issued' and (s.user_id=auth.uid() or public.c8_is_admin())));
-- Bootstrap first admin only via trusted SQL: insert into public.c8_admins(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL';
create function public.c8_finalize_document(credential uuid, expected_version integer, path text, actor uuid) returns void language plpgsql security definer set search_path=public as $$
declare c c8_credentials; s c8_students;
begin
 if not exists(select 1 from c8_admins where user_id=actor) then raise exception 'Admin required'; end if;
 select * into c from c8_credentials where id=credential for update;
 select * into s from c8_students where id=c.student_id for update;
 if c.id is null or c.status<>'pending' or c.version<>expected_version or s.status='withdrawn' then raise exception 'Credential changed'; end if;
 if (c.kind in('certificate','lor') and s.status<>'completed') or (c.kind='lor' and not s.lor_eligible) then raise exception 'Not eligible'; end if;
 if path not like s.id::text||'/%' then raise exception 'Invalid document path'; end if;
 update c8_credentials set status='issued',document_path=path,issued_at=now() where id=c.id;
 insert into c8_history(application_id,actor,event,detail) values(s.application_id,actor,'Document issued',c.reference);
 insert into c8_email_outbox(application_id,credential_id,event) values(s.application_id,c.id,'document_issued');
end $$;
revoke all on function c8_finalize_document(uuid,integer,text,uuid) from public,anon,authenticated;
grant execute on function c8_finalize_document(uuid,integer,text,uuid) to service_role;
