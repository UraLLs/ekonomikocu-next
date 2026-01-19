-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    thumbnail_url TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (published = true);

CREATE POLICY "Admins can do everything with posts" 
ON public.posts FOR ALL 
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    )
);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
