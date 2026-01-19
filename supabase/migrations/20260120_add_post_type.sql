-- Add post_type and category columns to social_posts table
-- This separates chat messages from forum discussions

ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'chat' CHECK (post_type IN ('chat', 'forum'));

ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('borsa', 'kripto', 'doviz', 'yatirim', 'genel', NULL));

-- Set existing posts to 'chat' type
UPDATE public.social_posts SET post_type = 'chat' WHERE post_type IS NULL;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_social_posts_type ON public.social_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_social_posts_category ON public.social_posts(category);
