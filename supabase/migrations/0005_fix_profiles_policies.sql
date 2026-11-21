-- CamOS: fixes applied to the live database after 0004_multi_user_desks.sql.
--
-- 1) The "admin reads profiles" policy in 0004 queried public.profiles from inside a
--    policy on public.profiles, which makes Postgres raise "infinite recursion detected in
--    policy". It now calls the security definer helper public.is_admin() instead.
-- 2) 0004 let any signed-in user update their own profile row, including the role column,
--    so a member could promote themselves to admin. Updates are now limited to
--    display_name and email at the column level.
-- 3) A fresh public.desk_backup snapshot is taken before desks are moved (the live run did this).

drop policy if exists "admin reads profiles" on public.profiles;
create policy "admin reads profiles" on public.profiles
  for select to authenticated
  using (public.is_admin());

revoke update on table public.profiles from authenticated;
grant update (display_name, email) on table public.profiles to authenticated;

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
