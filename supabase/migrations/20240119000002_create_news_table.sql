-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT, -- Short description or AI summary
    content TEXT, -- Full content (if available)
    url TEXT, -- Source URL
    source TEXT, -- Source name (e.g. Bloomberg HT)
    category TEXT, -- e.g. Finance, Crypto
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public news are viewable by everyone" 
ON public.news FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can do everything with news" 
ON public.news FOR ALL 
USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    )
);
