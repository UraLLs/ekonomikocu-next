-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Safe Update)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  username text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add columns if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'role') then
        alter table profiles add column role text default 'user' check (role in ('user', 'admin', 'editor'));
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_banned') then
        alter table profiles add column is_banned boolean default false;
    end if;
end $$;

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Policies for Profiles (Drop and Recreate to avoid errors)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- 2. IPOS (Halka Arzlar)
create table if not exists ipos (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  code text not null,
  price text,
  date_range text,
  status text check (status in ('active', 'upcoming', 'completed')),
  lot_count text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table ipos enable row level security;

-- Policies for IPOs
drop policy if exists "IPOs are viewable by everyone." on ipos;
create policy "IPOs are viewable by everyone." on ipos for select using ( true );

drop policy if exists "Only Admins can insert IPOs." on ipos;
create policy "Only Admins can insert IPOs." on ipos for insert with check ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

drop policy if exists "Only Admins can update IPOs." on ipos;
create policy "Only Admins can update IPOs." on ipos for update using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

drop policy if exists "Only Admins can delete IPOs." on ipos;
create policy "Only Admins can delete IPOs." on ipos for delete using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );


-- 3. COURSES (Eğitimler)
create table if not exists courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  instructor text,
  thumbnail_url text,
  category text default 'Genel',
  is_published boolean default false,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  price text default 'Ücretsiz',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table courses enable row level security;

-- Policies for Courses
drop policy if exists "Courses are viewable by everyone." on courses;
create policy "Courses are viewable by everyone." on courses for select using ( true );

drop policy if exists "Admins insert courses" on courses;
create policy "Admins insert courses" on courses for insert with check ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

drop policy if exists "Admins update courses" on courses;
create policy "Admins update courses" on courses for update using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

drop policy if exists "Admins delete courses" on courses;
create policy "Admins delete courses" on courses for delete using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- 4. LESSONS (Dersler)
create table if not exists lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  video_url text,
  duration text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table lessons enable row level security;

-- Policies for Lessons
drop policy if exists "Lessons are viewable by everyone." on lessons;
create policy "Lessons are viewable by everyone." on lessons for select using ( true );

drop policy if exists "Admins manage lessons" on lessons;
create policy "Admins manage lessons" on lessons for all using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- 5. LIVE SETTINGS (Canlı Yayın Ayarları)
create table if not exists live_settings (
  id integer primary key default 1,
  is_live boolean default false,
  youtube_video_id text,
  title text,
  viewer_count_override integer,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  constraint single_row check (id = 1)
);

alter table live_settings enable row level security;

-- Policies for Live Settings
drop policy if exists "Live settings viewable by everyone." on live_settings;
create policy "Live settings viewable by everyone." on live_settings for select using ( true );

drop policy if exists "Admins manage live settings" on live_settings;
create policy "Admins manage live settings" on live_settings for all using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- Initialize default live setting row
insert into live_settings (id, is_live, youtube_video_id, title)
values (1, false, '', 'Canlı Yayın')
on conflict (id) do nothing;

-- 6. BLOG POSTS
create table if not exists posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text,
  published_at timestamp with time zone,
  category text default 'blog',
  image_url text,
  author_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table posts enable row level security;

-- Policies for Posts
drop policy if exists "Published posts are viewable by everyone." on posts;
create policy "Published posts are viewable by everyone." on posts for select using ( true );

drop policy if exists "Admins manage posts" on posts;
create policy "Admins manage posts" on posts for all using ( exists ( select 1 from profiles where id = auth.uid() and role = 'admin' ) );

-- TRIGGER: Handle new user signup -> Create Profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'username', 'user')
  on conflict (id) do nothing; -- Safe on conflict
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
-- Dropping/Creating triggers safely is tricky in pure SQL block without DO, 
-- but 'create or replace' on function works. 
-- For trigger itself:
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
