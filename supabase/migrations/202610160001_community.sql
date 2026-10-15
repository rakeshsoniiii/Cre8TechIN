-- Opt-in public ideas. Private student records are never used as public entries.
create table public.c8_ideas (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id),
 display_name text not null check(length(trim(display_name)) between 2 and 80),
 title text not null check(length(trim(title)) between 5 and 120),
 description text not null check(length(trim(description)) between 20 and 3000),
 project_url text not null check(project_url ~ '^https://[^[:space:]]+$' and length(project_url)<2000),
 created_at timestamptz not null default now(), withdrawn boolean not null default false
);
create table public.c8_idea_votes (
 idea_id uuid not null references public.c8_ideas(id) on delete cascade,
 user_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now(), primary key(idea_id,user_id)
);
alter table public.c8_ideas enable row level security;
alter table public.c8_idea_votes enable row level security;
create policy ideas_public on public.c8_ideas for select to anon,authenticated using(not withdrawn or user_id=auth.uid() or public.c8_is_admin());
create policy ideas_create on public.c8_ideas for insert to authenticated with check(user_id=auth.uid() and not withdrawn and created_at=now());
create policy ideas_withdraw on public.c8_ideas for update to authenticated using(user_id=auth.uid() or public.c8_is_admin()) with check(user_id=auth.uid() or public.c8_is_admin());
create policy votes_own on public.c8_idea_votes for select to authenticated using(user_id=auth.uid());
create policy votes_create on public.c8_idea_votes for insert to authenticated with check(user_id=auth.uid() and created_at=now() and exists(select 1 from public.c8_ideas i where i.id=idea_id and not i.withdrawn and i.user_id<>auth.uid()));
create policy votes_remove on public.c8_idea_votes for delete to authenticated using(user_id=auth.uid());
revoke all on public.c8_ideas,public.c8_idea_votes from anon,authenticated;
grant select on public.c8_ideas to anon,authenticated;
grant insert(display_name,title,description,project_url),update(withdrawn) on public.c8_ideas to authenticated;
grant select,delete on public.c8_idea_votes to authenticated;
grant insert(idea_id) on public.c8_idea_votes to authenticated;
-- Aggregate only; voter identities and private student data are never returned.
create function public.c8_idea_scores() returns table(idea_id uuid,votes bigint)
language sql stable security definer set search_path=public as $$
 select i.id,count(v.idea_id) from c8_ideas i left join c8_idea_votes v on v.idea_id=i.id
 where not i.withdrawn group by i.id;
$$;
revoke all on function public.c8_idea_scores() from public;
grant execute on function public.c8_idea_scores() to anon,authenticated;
create index c8_ideas_created on public.c8_ideas(created_at desc);
create index c8_votes_user on public.c8_idea_votes(user_id);
