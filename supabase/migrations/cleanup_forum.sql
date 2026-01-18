-- ⚠️ DANGER: This script deletes ALL Forum Data!
-- Run this only if you want to completely remove the custom forum.

-- 1. Drop Tables (Order matters because of matching Foreign Keys)
DROP TABLE IF EXISTS "forum_topic_likes" CASCADE;
DROP TABLE IF EXISTS "forum_posts" CASCADE;
DROP TABLE IF EXISTS "forum_topics" CASCADE;
DROP TABLE IF EXISTS "forum_categories" CASCADE;

-- 2. Drop Functions & Triggers
DROP FUNCTION IF EXISTS "update_topic_stats" CASCADE;
DROP FUNCTION IF EXISTS "handle_vote" CASCADE;

-- 3. Cleanup Storage (Optional, if we had buckets)
-- DELETE FROM storage.objects WHERE bucket_id = 'forum_images';

SELECT 'Forum clean-up complete' as status;
