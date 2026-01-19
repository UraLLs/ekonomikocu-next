-- =============================================
-- SOSYAL SISTEM - DUZELTILMIS MIGRATION
-- Posts + Follows (Tek dosyada)
-- =============================================

-- =============================================
-- BOLUM 1: POSTS SISTEMI
-- =============================================

-- 1.1 POSTS TABLOSU
DROP TABLE IF EXISTS "public"."post_comments" CASCADE;
DROP TABLE IF EXISTS "public"."post_likes" CASCADE;
DROP TABLE IF EXISTS "public"."posts" CASCADE;

CREATE TABLE "public"."posts" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    "content" text NOT NULL,
    "symbol" text,
    "sentiment" text CHECK (sentiment IN ('BULL', 'BEAR', 'NEUTRAL')),
    "image_url" text,
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "is_pinned" boolean DEFAULT false,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- 1.2 POST_LIKES TABLOSU
CREATE TABLE "public"."post_likes" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "post_id" uuid NOT NULL REFERENCES "public"."posts"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "post_likes_unique" UNIQUE ("post_id", "user_id")
);

-- 1.3 POST_COMMENTS TABLOSU
CREATE TABLE "public"."post_comments" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "post_id" uuid NOT NULL REFERENCES "public"."posts"("id") ON DELETE CASCADE,
    "user_id" uuid NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    "content" text NOT NULL,
    "likes_count" integer DEFAULT 0,
    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- 1.4 INDEXES
CREATE INDEX "posts_user_id_idx" ON "public"."posts" ("user_id");
CREATE INDEX "posts_created_at_idx" ON "public"."posts" ("created_at" DESC);
CREATE INDEX "posts_symbol_idx" ON "public"."posts" ("symbol");
CREATE INDEX "post_likes_post_id_idx" ON "public"."post_likes" ("post_id");
CREATE INDEX "post_likes_user_id_idx" ON "public"."post_likes" ("user_id");
CREATE INDEX "post_comments_post_id_idx" ON "public"."post_comments" ("post_id");

-- 1.5 RLS
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;

-- Posts Policies
CREATE POLICY "posts_select" ON "public"."posts" FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON "public"."posts" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update" ON "public"."posts" FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "posts_delete" ON "public"."posts" FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Post Likes Policies
CREATE POLICY "post_likes_select" ON "public"."post_likes" FOR SELECT USING (true);
CREATE POLICY "post_likes_insert" ON "public"."post_likes" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON "public"."post_likes" FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Post Comments Policies
CREATE POLICY "post_comments_select" ON "public"."post_comments" FOR SELECT USING (true);
CREATE POLICY "post_comments_insert" ON "public"."post_comments" FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_comments_delete" ON "public"."post_comments" FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 1.6 Likes Count Trigger
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_like_change ON post_likes;
CREATE TRIGGER on_post_like_change
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 1.7 Comments Count Trigger
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_comment_change ON post_comments;
CREATE TRIGGER on_post_comment_change
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- =============================================
-- BOLUM 2: FOLLOWS SISTEMI
-- =============================================

-- 2.1 FOLLOWS TABLOSU
DROP TABLE IF EXISTS "public"."follows" CASCADE;

CREATE TABLE "public"."follows" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "follower_id" uuid NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    "following_id" uuid NOT NULL REFERENCES "auth"."users"("id") ON DELETE CASCADE,
    CONSTRAINT "follows_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "follows_unique" UNIQUE ("follower_id", "following_id"),
    CONSTRAINT "follows_no_self" CHECK (follower_id != following_id)
);

-- 2.2 INDEXES
CREATE INDEX "follows_follower_id_idx" ON "public"."follows" ("follower_id");
CREATE INDEX "follows_following_id_idx" ON "public"."follows" ("following_id");

-- 2.3 RLS
ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_select" ON "public"."follows" FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON "public"."follows" FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON "public"."follows" FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- 2.4 Follow Counts Trigger
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = COALESCE(following_count, 0) + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = COALESCE(followers_count, 0) + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(0, COALESCE(following_count, 0) - 1) WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = GREATEST(0, COALESCE(followers_count, 0) - 1) WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_change ON follows;
CREATE TRIGGER on_follow_change
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- =============================================
-- BOLUM 3: GRANTS & REALTIME
-- =============================================

-- Grants
GRANT SELECT ON TABLE "public"."posts" TO "anon";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."posts" TO "authenticated";
GRANT SELECT ON TABLE "public"."post_likes" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."post_likes" TO "authenticated";
GRANT SELECT ON TABLE "public"."post_comments" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."post_comments" TO "authenticated";
GRANT SELECT ON TABLE "public"."follows" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."follows" TO "authenticated";

-- Realtime (with error handling)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE posts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE follows;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- TAMAMLANDI
-- =============================================
SELECT 'Social System Created Successfully!' as status;
