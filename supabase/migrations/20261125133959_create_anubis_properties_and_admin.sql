-- ANUBIS Imóveis: catálogo, administração e Storage.
-- Esta migração já foi aplicada diretamente ao projeto Supabase cjjeohqshlttsvjcwgmx.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id text primary key,
  slug text not null unique,
  title text not null,
  price numeric(12,2),
  status text not null default 'draft'
    check (status in ('available','unavailable','soon','rented','draft','demo')),
  neighborhood text,
  address text,
  bedrooms numeric,
  bathrooms numeric,
  area text,
  features text,
  description text,
  badge text,
  is_demo boolean not null default false,
  image text,
  gallery jsonb not null default '[]'::jsonb
    check (jsonb_typeof(gallery) = 'array'),
  date_listed date,
  available_from date,
  whatsapp_message text,
  photo_credit text,
  photo_source text,
  page_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;

grant select on public.admin_users to anon, authenticated;
grant select on public.properties to anon, authenticated;
grant insert, update, delete on public.properties to authenticated;

create or replace function public.is_anubis_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_anubis_admin() from public;
grant execute on function public.is_anubis_admin() to anon, authenticated;

drop policy if exists "Anubis admins can view their own admin record" on public.admin_users;
create policy "Anubis admins can view their own admin record"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Public can read published Anubis properties" on public.properties;
create policy "Public can read published Anubis properties"
on public.properties for select to anon, authenticated
using (
  (is_demo = false and status not in ('draft','demo'))
  or public.is_anubis_admin()
);

drop policy if exists "Anubis admins can insert properties" on public.properties;
create policy "Anubis admins can insert properties"
on public.properties for insert to authenticated
with check (public.is_anubis_admin());

drop policy if exists "Anubis admins can update properties" on public.properties;
create policy "Anubis admins can update properties"
on public.properties for update to authenticated
using (public.is_anubis_admin())
with check (public.is_anubis_admin());

drop policy if exists "Anubis admins can delete properties" on public.properties;
create policy "Anubis admins can delete properties"
on public.properties for delete to authenticated
using (public.is_anubis_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-photos', 'property-photos', true, 5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anubis admins can upload property photos" on storage.objects;
create policy "Anubis admins can upload property photos"
on storage.objects for insert to authenticated
with check (bucket_id = 'property-photos' and public.is_anubis_admin());

drop policy if exists "Anubis admins can update property photos" on storage.objects;
create policy "Anubis admins can update property photos"
on storage.objects for update to authenticated
using (bucket_id = 'property-photos' and public.is_anubis_admin())
with check (bucket_id = 'property-photos' and public.is_anubis_admin());

drop policy if exists "Anubis admins can delete property photos" on storage.objects;
create policy "Anubis admins can delete property photos"
on storage.objects for delete to authenticated
using (bucket_id = 'property-photos' and public.is_anubis_admin());
