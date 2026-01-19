-- =============================================
-- POST SISTEMI - SOSYAL FINANS PLATFORMU
-- =============================================

-- 1. POSTS TABLOSU (Ana paylasimlar)
CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid REFERENCES "auth"."users"("id") ON DELETE CASCADE NOT NULL,
    "content" text NOT NULL,
    "symbol" text, -- Iliskili hisse/kripto (opsiyonel)
    "sentiment" text CHECK (sentiment IN ('BULL', 'BEAR', 'NEUTRAL')), -- Piyasa gorusu
    "image_url" text, -- Gorsel ekleme (opsiyonel)
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "is_pinned" boolean DEFAULT false,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- 2. POST_LIKES TABLOSU (Begeniler)
CREATE TABLE IF NOT EXISTS "public"."post_likes" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "post_id" uuid REFERENCES "public"."posts"("id") ON DELETE CASCADE NOT NULL,
    "user_id" uuid REFERENCES "auth"."users"("id") ON DELETE CASCADE NOT NULL,
    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "post_likes_unique" UNIQUE ("post_id", "user_id") -- Ayni postu iki kez begenemez
);

-- 3. POST_COMMENTS TABLOSU (Post yorumlari)
CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "post_id" uuid REFERENCES "public"."posts"("id") ON DELETE CASCADE NOT NULL,
    "user_id" uuid REFERENCES "auth"."users"("id") ON DELETE CASCADE NOT NULL,
    "content" text NOT NULL,
    "likes_count" integer DEFAULT 0,
    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- 4. INDEXES (Performans)
CREATE INDEX IF NOT EXISTS "posts_user_id_idx" ON "public"."posts" ("user_id");
CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "public"."posts" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "posts_symbol_idx" ON "public"."posts" ("symbol");
CREATE INDEX IF NOT EXISTS "post_likes_post_id_idx" ON "public"."post_likes" ("post_id");
CREATE INDEX IF NOT EXISTS "post_likes_user_id_idx" ON "public"."post_likes" ("user_id");
CREATE INDEX IF NOT EXISTS "post_comments_post_id_idx" ON "public"."post_comments" ("post_id");

-- 5. RLS (Row Level Security)
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;

-- POSTS Policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON "public"."posts";
CREATE POLICY "Posts are viewable by everyone"
ON "public"."posts" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create their own posts" ON "public"."posts";
CREATE POLICY "Users can create their own posts"
ON "public"."posts" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON "public"."posts";
CREATE POLICY "Users can update their own posts"
ON "public"."posts" FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON "public"."posts";
CREATE POLICY "Users can delete their own posts"
ON "public"."posts" FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- POST_LIKES Policies
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON "public"."post_likes";
CREATE POLICY "Likes are viewable by everyone"
ON "public"."post_likes" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON "public"."post_likes";
CREATE POLICY "Users can like posts"
ON "public"."post_likes" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON "public"."post_likes";
CREATE POLICY "Users can unlike posts"
ON "public"."post_likes" FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- POST_COMMENTS Policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON "public"."post_comments";
CREATE POLICY "Comments are viewable by everyone"
ON "public"."post_comments" FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON "public"."post_comments";
CREATE POLICY "Users can create comments"
ON "public"."post_comments" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON "public"."post_comments";
CREATE POLICY "Users can delete their own comments"
ON "public"."post_comments" FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. REALTIME
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE posts;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 7. FUNCTIONS (Begeni sayisi guncelleme)
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_like_change ON post_likes;
CREATE TRIGGER on_post_like_change
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Yorum sayisi guncelleme
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_comment_change ON post_comments;
CREATE TRIGGER on_post_comment_change
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- 8. GRANTS
GRANT SELECT ON TABLE "public"."posts" TO "anon";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."posts" TO "authenticated";
GRANT SELECT ON TABLE "public"."post_likes" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."post_likes" TO "authenticated";
GRANT SELECT ON TABLE "public"."post_comments" TO "anon";
GRANT SELECT, INSERT, DELETE ON TABLE "public"."post_comments" TO "authenticated";

SELECT 'Post System Created Successfully' as status;
