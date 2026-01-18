
-- Create a table to cache news results per query
create table if not exists public.news_cache (
  id uuid default gen_random_uuid() primary key,
  query_key text not null unique, -- e.g. 'general', 'THYAO', 'BTC'
  news_data jsonb not null, -- Stores the array of translated NewsItems
  updated_at timestamptz default now() not null
);

-- Enable RLS (though server role will bypass)
alter table public.news_cache enable row level security;

-- Policy: Allow read access to everyone (public)
create policy "Allow public read access"
  on public.news_cache for select
  using (true);

-- Policy: Allow service role (backend) to write
create policy "Allow service role write"
  on public.news_cache for all
  using (true)
  with check (true);
