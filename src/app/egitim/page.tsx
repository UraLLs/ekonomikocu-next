import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import EducationCatalog from "@/components/education/EducationCatalog";
import { createClient } from "@/utils/supabase/server";

export default async function EducationPage() {
    const supabase = await createClient();

    // Fetch Sidebar Data
    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    let feedData: any[] = [];
    if (comments && comments.length > 0) {
        const userIds = Array.from(new Set(comments.map(c => c.user_id)));
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', userIds);

        const profileMap = (profiles || []).reduce<Record<string, any>>((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
        }, {});

        feedData = comments.map(c => ({
            ...c,
            profiles: profileMap[c.user_id]
        }));
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />
            <EducationCatalog sidebar={<Sidebar comments={feedData} />} />
            <Footer />
        </main>
    );
}
