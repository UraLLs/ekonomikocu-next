-- Create comments table for asset discussions
CREATE TABLE IF NOT EXISTS "comments" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    "symbol" TEXT NOT NULL,
    "content" TEXT NOT NULL CHECK (char_length(content) > 0),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read comments
CREATE POLICY "Public can view comments" ON "comments"
    FOR SELECT
    USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments" ON "comments"
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON "comments"
    FOR DELETE
    USING (auth.uid() = user_id);
    
-- Add simple index for faster queries by symbol
CREATE INDEX IF NOT EXISTS comments_symbol_idx ON comments (symbol);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
