-- Create Communities Table
CREATE TABLE IF NOT EXISTS communities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Communities are viewable by everyone" 
ON communities FOR SELECT USING (true);

CREATE POLICY "Users can create communities" 
ON communities FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create User-Community Membership (Optional for later, but good practice)
CREATE TABLE IF NOT EXISTS community_members (
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read members" 
ON community_members FOR SELECT USING (true);

CREATE POLICY "Users can join" 
ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
