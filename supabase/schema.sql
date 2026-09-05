-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Site Settings Table (single row)
create table public.site_settings (
  id integer primary key default 1,
  phone text,
  email text,
  address text,
  social_links jsonb default '{"facebook": "", "twitter": "", "instagram": "", "linkedin": ""}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Ensure only one row can exist
alter table public.site_settings add constraint single_row check (id = 1);
-- Insert default row
insert into public.site_settings (id, phone, email, address) values (1, '+91-9324689553 / +91-7006323003', 'Waseemgll@gmail.com', 'J&K and Ladakh High Court, Srinagar');

-- 3. Hero Content Table
create table public.hero_content (
  id integer primary key default 1,
  title text not null default 'Your legal partner in every situation',
  subtitle text not null default 'From complex disputes to everyday legal matters, we deliver strategic solutions with a client-first approach. We stand by you to protect what matters most.',
  cta_text text not null default 'Book a Free Consultation',
  cta_link text not null default '#contact',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.hero_content add constraint single_row check (id = 1);
insert into public.hero_content (id) values (1);

-- 4. Services Table
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon text not null,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial services
insert into public.services (title, description, icon, is_featured, sort_order) values
('Criminal Defense', 'We''re here to guide you through every step of your criminal case, aiming for the best possible result.', '⚖', true, 1),
('Corporate Law', 'Access straightforward, professional support for contracts, compliance and governance.', '◈', false, 2),
('Family Law', 'Our team works hard to provide expert legal help in sensitive cases and achieve the best results for you.', '◇', false, 3),
('Legal Consultation', 'Need legal help? Our experts guide you clearly, keeping you confident and informed.', '✦', false, 4);

-- 5. Team Members Table
create table public.team_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial team
insert into public.team_members (name, role, image_url, sort_order) values
('Alexander Reed', 'Senior Advocate', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=70', 1),
('Olivia Bennett', 'Legal Advisor', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=70', 2),
('Daniel Carter', 'Associate Lawyer', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=70', 3);

-- 6. Testimonials Table
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  quote text not null,
  detail text not null,
  client_name text not null,
  client_role text,
  image_url text not null,
  rating integer default 5,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial testimonials
insert into public.testimonials (quote, detail, client_name, client_role, image_url, sort_order) values
('“They turned a case I thought was lost into a settlement I could actually live with.”', 'I came in late, with paperwork in poor shape and very little time. The team rebuilt the file, found the arguments that mattered and negotiated firmly on my behalf. I never once felt like I was chasing them for an update.', 'Priya Raman', 'Founder, Meridian Textiles · Bengaluru, India', 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?auto=format&fit=crop&w=300&q=70', 1),
('“Highly professional and reliable. The team handled my case with clarity and delivered exactly what I needed.”', 'From the initial consultation to the final outcome, the process was smooth and transparent. Their attention to detail, clear communication and strategic approach made a real difference in achieving the result I was looking for.', 'Michael Anderson', 'Real Estate Investor · Dubai, UAE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=70', 2),
('“Plain English, honest cost estimates, and no surprises at any stage of the matter.”', 'What stood out was the honesty. They told me early which parts of my claim were weak instead of billing me to find out later. That saved months and a good deal of money, and we still reached a strong outcome.', 'Tom Whitaker', 'Operations Director · Manchester, UK', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=70', 3);

-- 7. Contact Submissions Table
create table public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  service text,
  preferred_date date,
  message text,
  status text default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.hero_content enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_submissions enable row level security;

-- Policies for public tables (read-only for everyone)
create policy "Public can read site settings" on public.site_settings for select using (true);
create policy "Public can read hero content" on public.hero_content for select using (true);
create policy "Public can read services" on public.services for select using (true);
create policy "Public can read team members" on public.team_members for select using (true);
create policy "Public can read testimonials" on public.testimonials for select using (true);

-- Policy for submissions (public can insert, but not read)
create policy "Public can insert submissions" on public.contact_submissions for insert with check (true);

-- Admin functions (for RLS)
create or replace function public.is_admin()
returns boolean as $$
begin
  return (select is_admin from public.profiles where id = auth.uid());
end;
$$ language plpgsql security definer;

-- Admin policies (full access)
create policy "Admins can manage site settings" on public.site_settings using (public.is_admin());
create policy "Admins can manage hero content" on public.hero_content using (public.is_admin());
create policy "Admins can manage services" on public.services using (public.is_admin());
create policy "Admins can manage team members" on public.team_members using (public.is_admin());
create policy "Admins can manage testimonials" on public.testimonials using (public.is_admin());
create policy "Admins can manage submissions" on public.contact_submissions using (public.is_admin());
create policy "Admins can manage profiles" on public.profiles using (public.is_admin());

-- Allow users to read their own profile
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, is_admin)
  values (new.id, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
