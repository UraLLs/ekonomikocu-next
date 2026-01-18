-- ⚠️ DANGER: This script deletes ALL Social & Chat Data!
-- Run this only if you want to completely remove the Social features.

-- Note: Dropping tables with CASCADE automatically removes them from Realtime publications.

DROP TABLE IF EXISTS "community_members" CASCADE;
DROP TABLE IF EXISTS "communities" CASCADE;
DROP TABLE IF EXISTS "room_messages" CASCADE;
DROP TABLE IF EXISTS "chat_rooms" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE; -- Just in case comments were used

SELECT 'Social features clean-up complete' as status;
