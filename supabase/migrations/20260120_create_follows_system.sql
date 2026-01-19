-- =============================================
-- TAKIP SISTEMI - SOSYAL FINANS PLATFORMU
-- =============================================

-- 1. FOLLOWS TABLOSU
CREATE TABLE IF NOT EXISTS "public"."follows" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "follower_id" uuid REFERENCES "auth"."users"("id") ON DELETE CASCADE NOT NULL,
    "following_id" uuid REFERENCES "auth"."users"("id") ON DELETE CASCADE NOT NULL,
    CONSTRAINT "follows_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "follows_unique" UNIQUE ("follower_id", "following_id"),
    CONSTRAINT "follows_no_self" CHECK (follower_id != following_id)
);

-- 2. PROFILES TABLOSUNA SAYAC ALANLARI EKLE
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "followers_count" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "following_count" integer DEFAULT 0;

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS "follows_follower_id_idx" ON "public"."follows" ("follower_id");
CREATE INDEX IF NOT EXISTS "follows_following_id_idx" ON "public"."follows" ("following_id");

-- 4. RLS
ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON "public"."follows";
CREATE POLICY "Follows are viewable by everyone"
ON "public"."follows" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON "public"."follows";
CREATE POLICY "Users can follow others"
ON "public"."follows" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON "public"."follows";
CREATE POLICY "Users can unfollow"
ON "public"."follows" FOR DELETE
TO authenticated
USING (auth.uid() = follower_id);

-- 5. TRIGGER FUNCTIONS (Takipci sayisini otomatik guncelle)
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Takip eden kisinin following_count arttir
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    -- Takip edilen kisinin followers_count arttir
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Takip eden kisinin following_count azalt
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    -- Takip edilen kisinin followers_count azalt
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_follow_change ON follows;
CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- 6. REALTIME
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE follows;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 7. GRANTS
GRANT SELECT ON TABLE "public"."follows" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."follows" TO "authenticated";

SELECT 'Follow System Created Successfully' as status;
