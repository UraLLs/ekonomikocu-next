-- Add missing columns to posts table if they don't exist
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT; -- Can't enforce NOT NULL unique easily on existing data
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Drop constraints if they exist to avoid duplication errors (optional, usually safe to skip if we don't know names)
-- But we can try to add the UNIQUE constraint to slug if it doesn't exist.
-- DO $$ BEGIN ALTER TABLE public.posts ADD CONSTRAINT posts_slug_key UNIQUE (slug); EXCEPTION WHEN duplicate_table THEN END; $$;

-- Enable RLS just in case
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Re-create policies (Drop first to avoid "policy already exists" error)
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (published = true);

DROP POLICY IF EXISTS "Admins can do everything with posts" ON public.posts;
CREATE POLICY "Admins can do everything with posts" 
ON public.posts FOR ALL 
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);
