-- ============================================================
-- Case Management Portal: roles, cases, files, daily orders & notes
-- ============================================================

-- 1. Replace is_admin boolean with a role enum on profiles
alter table public.profiles
  add column if not exists role text not null default 'junior' check (role in ('admin', 'junior'));

update public.profiles set role = 'admin' where is_admin = true;

alter table public.profiles drop column if exists is_admin;

-- Keep the function NAME `is_admin()` so the existing CMS policies in schema.sql
-- (site_settings, hero_content, services, team_members, testimonials, submissions,
-- profiles) keep working unmodified — only the body changes to check `role`.
create or replace function public.is_admin()
returns boolean as $$
begin
  return coalesce((select role from public.profiles where id = auth.uid()) = 'admin', false);
end;
$$ language plpgsql security definer;

-- New users get the role passed at signup (defaults to 'junior')
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'junior')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Admins need to read every profile (Manage Users screen); users can already read their own.
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles" on public.profiles for select using (public.is_admin());

-- ============================================================
-- 2. Cases
-- ============================================================
create table if not exists public.cases (
  id uuid default uuid_generate_v4() primary key,
  case_number text not null unique,
  client_name text not null,
  status text not null default 'active' check (status in ('active', 'pending', 'closed')),
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cases enable row level security;

drop policy if exists "Authenticated users can read cases" on public.cases;
create policy "Authenticated users can read cases" on public.cases
  for select using (auth.role() = 'authenticated');
drop policy if exists "Admins can insert cases" on public.cases;
create policy "Admins can insert cases" on public.cases
  for insert with check (public.is_admin());
drop policy if exists "Admins can update cases" on public.cases;
create policy "Admins can update cases" on public.cases
  for update using (public.is_admin());
drop policy if exists "Admins can delete cases" on public.cases;
create policy "Admins can delete cases" on public.cases
  for delete using (public.is_admin());

-- ============================================================
-- 3. Case files (PDF scans, private storage)
-- ============================================================
create table if not exists public.case_files (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases(id) on delete cascade not null,
  file_name text not null,
  storage_path text not null,
  file_size bigint,
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.case_files enable row level security;

drop policy if exists "Authenticated users can read case files" on public.case_files;
create policy "Authenticated users can read case files" on public.case_files
  for select using (auth.role() = 'authenticated');
drop policy if exists "Admins can insert case files" on public.case_files;
create policy "Admins can insert case files" on public.case_files
  for insert with check (public.is_admin());
drop policy if exists "Admins can delete case files" on public.case_files;
create policy "Admins can delete case files" on public.case_files
  for delete using (public.is_admin());

-- ============================================================
-- 4. Case updates (Daily Orders & Notes — one unified timeline)
-- ============================================================
create table if not exists public.case_updates (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases(id) on delete cascade not null,
  type text not null check (type in ('order', 'note')),
  content text not null,
  entry_date date not null default current_date,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.case_updates enable row level security;

drop policy if exists "Authenticated users can read case updates" on public.case_updates;
create policy "Authenticated users can read case updates" on public.case_updates
  for select using (auth.role() = 'authenticated');
drop policy if exists "Authenticated users can add case updates" on public.case_updates;
create policy "Authenticated users can add case updates" on public.case_updates
  for insert with check (auth.role() = 'authenticated');
drop policy if exists "Admins can update case updates" on public.case_updates;
create policy "Admins can update case updates" on public.case_updates
  for update using (public.is_admin());
drop policy if exists "Admins can delete case updates" on public.case_updates;
create policy "Admins can delete case updates" on public.case_updates
  for delete using (public.is_admin());

-- ============================================================
-- 5. Private storage bucket for case file PDFs
-- ============================================================
insert into storage.buckets (id, name, public)
values ('case-files', 'case-files', false)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can view case files in storage" on storage.objects;
create policy "Authenticated users can view case files in storage"
  on storage.objects for select
  using (bucket_id = 'case-files' and auth.role() = 'authenticated');

drop policy if exists "Admins can upload case files to storage" on storage.objects;
create policy "Admins can upload case files to storage"
  on storage.objects for insert
  with check (bucket_id = 'case-files' and public.is_admin());

drop policy if exists "Admins can delete case files from storage" on storage.objects;
create policy "Admins can delete case files from storage"
  on storage.objects for delete
  using (bucket_id = 'case-files' and public.is_admin());
