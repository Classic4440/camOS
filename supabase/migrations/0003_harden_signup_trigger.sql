-- CamOS: lock down the signup trigger function.
-- block_extra_signups() is a trigger function. It never needs to be callable through the API.
-- Applied to the live Supabase project right after 0002_owner_lock.sql.

revoke execute on function public.block_extra_signups() from public, anon, authenticated;
