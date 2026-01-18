-- 🚨 SOCIAL & CHAT FIX (ALL IN ONE) 🚨

-- 1. FOREIGN KEY FIX (Düzeltme: İlişkiler)
-- Ensure messages correspond to valid users
ALTER TABLE room_messages DROP CONSTRAINT IF EXISTS room_messages_user_id_fkey;

ALTER TABLE room_messages
ADD CONSTRAINT room_messages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- 2. ENABLE REALTIME (Düzeltme: Canlı Akış)
-- This is critical for seeing messages without refreshing!
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS room_messages; -- Reset to be safe
ALTER PUBLICATION supabase_realtime ADD TABLE room_messages;

-- 3. PERMISSIONS (Düzeltme: İzinler)
GRANT ALL ON room_messages TO authenticated;
GRANT ALL ON room_messages TO service_role;

-- 4. RLS POLICIES (Düzeltme: Güvenlik Kuralları)
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON room_messages;
DROP POLICY IF EXISTS "Authenticated insert access" ON room_messages;

CREATE POLICY "Public read access"
ON room_messages FOR SELECT
USING (true);

CREATE POLICY "Authenticated insert access"
ON room_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. COMMUNITIES REALTIME (Optional but good)
ALTER PUBLICATION supabase_realtime ADD TABLE communities;

SELECT 'Social System Fixed & Realtime Enabled' as status;
