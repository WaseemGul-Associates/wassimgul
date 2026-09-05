-- ============================================================
-- Dashboard v2: case title/court fields + activity log
-- ============================================================

alter table public.cases add column if not exists title text;
alter table public.cases add column if not exists court text;

create table if not exists public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  case_id uuid references public.cases(id) on delete set null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

alter table public.activity_log enable row level security;

drop policy if exists "Admins can read activity log" on public.activity_log;
create policy "Admins can read activity log" on public.activity_log
  for select using (public.is_admin());

drop policy if exists "Authenticated users can write activity log" on public.activity_log;
create policy "Authenticated users can write activity log" on public.activity_log
  for insert with check (auth.role() = 'authenticated');
