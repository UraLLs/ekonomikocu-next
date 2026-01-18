-- Fix Chat Relations
-- This script ensures the relationship between room_messages and profiles is valid

-- 1. Check/Re-create Foreign Key with explicit name
ALTER TABLE room_messages DROP CONSTRAINT IF EXISTS room_messages_user_id_fkey;

ALTER TABLE room_messages
ADD CONSTRAINT room_messages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- 2. Grant permissions just in case
GRANT ALL ON room_messages TO authenticated;
GRANT ALL ON room_messages TO service_role;

-- 3. Policy Reset (To be safe)
DROP POLICY IF EXISTS "Public read access" ON room_messages;
DROP POLICY IF EXISTS "User insert access" ON room_messages;

CREATE POLICY "Public read access"
ON room_messages FOR SELECT
USING (true);

CREATE POLICY "User insert access"
ON room_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);
