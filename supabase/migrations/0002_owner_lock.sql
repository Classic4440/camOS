-- CamOS owner lock.
-- Backs up every current desk row, then removes anonymous access.
-- Does not delete the primary desk payload.
-- Run once in the Supabase SQL editor. This file has not been executed by the app.

create table if not exists public.desk_backup (
  id bigint generated always as identity primary key,
  source_id text not null,
  payload jsonb not null,
  updated_at timestamptz,
  backed_up_at timestamptz not null default now()
);

insert into public.desk_backup (source_id, payload, updated_at)
select id, payload, updated_at from public.desk;

-- Audit probe left by the security check. Not a user record.
delete from public.desk where id = 'security-audit-probe';

alter table public.desk add column if not exists owner_id uuid references auth.users (id);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default 'DanielMac',
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  detail text not null default '',
  at timestamptz not null default now()
);

alter table public.desk enable row level security;
alter table public.desk_backup enable row level security;
alter table public.profiles enable row level security;
alter table public.security_events enable row level security;

drop policy if exists "desk read" on public.desk;
drop policy if exists "desk insert" on public.desk;
drop policy if exists "desk update" on public.desk;
drop policy if exists "owner reads desk" on public.desk;
drop policy if exists "owner inserts desk" on public.desk;
drop policy if exists "owner updates desk" on public.desk;

revoke all on table public.desk from anon;
revoke all on table public.desk_backup from anon, authenticated;
grant select, insert, update on table public.desk to authenticated;

create policy "owner reads desk" on public.desk
  for select to authenticated
  using (owner_id = auth.uid());

create policy "owner inserts desk" on public.desk
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy "owner updates desk" on public.desk
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
revoke all on table public.profiles from anon;
grant select, update on table public.profiles to authenticated;

create policy "read own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "read own events" on public.security_events;
drop policy if exists "insert own events" on public.security_events;
revoke all on table public.security_events from anon;
grant select, insert on table public.security_events to authenticated;

create policy "read own events" on public.security_events
  for select to authenticated
  using (owner_id = auth.uid());

create policy "insert own events" on public.security_events
  for insert to authenticated
  with check (owner_id = auth.uid());

create or replace function public.claim_owner()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  if exists (select 1 from public.profiles where id <> uid) then
    raise exception 'desk already has an owner';
  end if;
  insert into public.profiles (id, email, display_name)
  values (uid, (select email from auth.users where id = uid), 'DanielMac')
  on conflict (id) do update set email = excluded.email;
  update public.desk
  set owner_id = uid
  where owner_id is null;
end;
$$;

revoke all on function public.claim_owner() from public, anon;
grant execute on function public.claim_owner() to authenticated;

create or replace function public.block_extra_signups()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from auth.users) > 1 then
    raise exception 'CamOS registration is closed';
  end if;
  return new;
end;
$$;

drop trigger if exists camos_block_extra_signups on auth.users;
create trigger camos_block_extra_signups
  after insert on auth.users
  for each row execute function public.block_extra_signups();

insert into storage.buckets (id, name, public)
values ('owner-files', 'owner-files', false)
on conflict (id) do update set public = false;

drop policy if exists "owner reads files" on storage.objects;
drop policy if exists "owner inserts files" on storage.objects;
drop policy if exists "owner updates files" on storage.objects;
drop policy if exists "owner deletes files" on storage.objects;

create policy "owner reads files" on storage.objects
  for select to authenticated
  using (bucket_id = 'owner-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner inserts files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'owner-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner updates files" on storage.objects
  for update to authenticated
  using (bucket_id = 'owner-files' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'owner-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner deletes files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'owner-files' and (storage.foldername(name))[1] = auth.uid()::text);
