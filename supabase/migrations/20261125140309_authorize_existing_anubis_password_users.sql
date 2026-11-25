-- Authorize the two current confirmed Auth users that already have a password.
-- This was applied to project cjjeohqshlttsvjcwgmx; it intentionally does not
-- auto-authorize users created in the future.
insert into public.admin_users (user_id)
select u.id
from auth.users as u
where u.email_confirmed_at is not null
  and u.encrypted_password is not null
  and u.encrypted_password <> ''
on conflict (user_id) do nothing;
