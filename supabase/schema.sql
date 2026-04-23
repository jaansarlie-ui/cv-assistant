-- Run this entire file in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > paste > Run

-- Profiles (extends Supabase built-in auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- CV analyses
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_title text,
  company_name text,
  job_description text not null,
  cv_text text not null,
  match_score integer,
  feedback jsonb,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Cover letters
create table public.cover_letters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete set null,
  job_title text,
  company_name text,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Application tracker
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_title text not null,
  company_name text not null,
  status text default 'applied'
    check (status in ('applied', 'interview', 'offer', 'rejected', 'withdrawn')),
  applied_date date default current_date,
  notes text,
  job_url text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.cover_letters enable row level security;
alter table public.applications enable row level security;

-- RLS Policies (users only see their own data)
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own analyses" on public.analyses for all using (auth.uid() = user_id);
create policy "Users manage own cover letters" on public.cover_letters for all using (auth.uid() = user_id);
create policy "Users manage own applications" on public.applications for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
