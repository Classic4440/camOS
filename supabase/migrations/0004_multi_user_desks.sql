-- CamOS multi-user desks + admin invites.
-- Each authenticated user owns exactly one desk row (id = auth.uid()::text).
-- Public sign-up stays closed (Auth settings + no UI). Invites go through the
-- Edge Function with service_role. The old single-user signup trigger is dropped
-- so invite-created users can land.

-- 1) Role on profiles ---------------------------------------------------------
alter table public.profiles
  add column if not exists role text not null default 'member';

update public.profiles set role = 'admin' where role is distinct from 'admin'
  and id = (select id from public.profiles order by created_at asc limit 1);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('admin', 'member'));
  end if;
end$$;

-- 2) Desk rows: one per user (id = uid text) ---------------------------------
-- Migrate the legacy "primary" row onto the first admin if present.
do $$
declare
  admin_id uuid;
begin
  select id into admin_id from public.profiles where role = 'admin' order by created_at asc limit 1;
  if admin_id is not null and exists (select 1 from public.desk where id = 'primary') then
    update public.desk
      set id = admin_id::text,
          owner_id = admin_id
      where id = 'primary';
  end if;
end$$;

-- Any remaining rows without owner_id stay until claimed; new rows always set both.

-- 3) Ensure desk for the current user ----------------------------------------
create or replace function public.ensure_user_desk()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  is_first boolean;
begin
  if uid is null then
    raise exception 'not signed in';
  end if;

  select not exists (select 1 from public.profiles) into is_first;

  insert into public.profiles (id, email, display_name, role)
  values (
    uid,
    (select email from auth.users where id = uid),
    case when is_first then 'DanielMac' else 'Member' end,
    case when is_first then 'admin' else 'member' end
  )
  on conflict (id) do update
    set email = excluded.email;

  insert into public.desk (id, owner_id, payload, updated_at)
  values (uid::text, uid, '{}'::jsonb, now())
  on conflict (id) do nothing;

  -- Keep owner_id aligned if a row already existed without it.
  update public.desk
    set owner_id = uid
    where id = uid::text and (owner_id is null or owner_id = uid);
end;
$$;

revoke all on function public.ensure_user_desk() from public, anon;
grant execute on function public.ensure_user_desk() to authenticated;

-- Backward-compatible alias used by the current client.
create or replace function public.claim_owner()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_user_desk();
end;
$$;

revoke all on function public.claim_owner() from public, anon;
grant execute on function public.claim_owner() to authenticated;

-- 4) RLS: strictly auth.uid() -----------------------------------------------
drop policy if exists "owner reads desk" on public.desk;
drop policy if exists "owner inserts desk" on public.desk;
drop policy if exists "owner updates desk" on public.desk;

create policy "user reads own desk" on public.desk
  for select to authenticated
  using (owner_id = auth.uid() and id = auth.uid()::text);

create policy "user inserts own desk" on public.desk
  for insert to authenticated
  with check (owner_id = auth.uid() and id = auth.uid()::text);

create policy "user updates own desk" on public.desk
  for update to authenticated
  using (owner_id = auth.uid() and id = auth.uid()::text)
  with check (owner_id = auth.uid() and id = auth.uid()::text);

-- Profiles: users read/update self; admin can list members for invite UI later.
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "admin reads profiles" on public.profiles;

create policy "read own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "admin reads profiles" on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Security events stay per-user.
drop policy if exists "read own events" on public.security_events;
drop policy if exists "insert own events" on public.security_events;

create policy "read own events" on public.security_events
  for select to authenticated
  using (owner_id = auth.uid());

create policy "insert own events" on public.security_events
  for insert to authenticated
  with check (owner_id = auth.uid());

-- 5) Allow invite-created users (drop hard single-user block) ----------------
drop trigger if exists camos_block_extra_signups on auth.users;
drop function if exists public.block_extra_signups();

-- 6) Helper: is current user admin (for Edge Function / client checks) -------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
