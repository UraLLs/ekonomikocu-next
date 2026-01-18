-- Run this in Supabase SQL Editor to fix missing columns
alter table courses add column if not exists is_published boolean default false;
alter table courses add column if not exists category text default 'Borsa';

-- Verify it exists (optional, simply running the above is enough)
comment on column courses.is_published is 'Education visibility status';
