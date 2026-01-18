const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Manually parse .env.local
let supabaseUrl = "";
let supabaseKey = "";

try {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value;
                if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value;
            }
        });
    }
} catch (e) {
    console.error("Env read error:", e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("🔍 Searching for slug: sasaasassaasas-1962");

    const { data, error } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('slug', 'sasaasassaasas-1962');

    if (error) {
        console.error("❌ Database Error:", error);
    } else if (data && data.length > 0) {
        console.log("✅ FOUND IT! The topic exists in DB.");
        console.log(data[0]);
    } else {
        console.log("❌ NOT FOUND in DB. The insert failed or RLS is hiding it.");

        // Check if ANY topics exist
        const { count } = await supabase.from('forum_topics').select('*', { count: 'exact', head: true });
        console.log(`ℹ️ Total topics in DB: ${count}`);
    }
}

check();
