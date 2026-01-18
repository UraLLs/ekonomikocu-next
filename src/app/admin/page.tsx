import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch Stats (Parallel)
    const [
        { count: userCount },
        { count: topicCount },
        { count: postCount }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('forum_topics').select('*', { count: 'exact', head: true }),
        supabase.from('forum_posts').select('*', { count: 'exact', head: true })
    ]);

    const stats = [
        { label: "Toplam Kullanıcı", value: userCount || 0, color: "bg-accent-blue" },
        { label: "Forum Konuları", value: topicCount || 0, color: "bg-accent-green" },
        { label: "Forum Yanıtları", value: postCount || 0, color: "bg-accent-orange" },
        { label: "Aktif Odalar", value: 1, color: "bg-purple-500" }, // Mock for now or real query
    ];

    return (
        <div>
            <h1 className="text-3xl font-black mb-8">Genel Bakış</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-bg-surface border border-border-subtle rounded-2xl p-6 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-10 rounded-full -mr-8 -mt-8 blur-2xl`}></div>
                        <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-4xl font-black text-text-primary">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-bg-surface border border-border-subtle rounded-2xl">
                <h2 className="font-bold text-xl mb-4">Sistem Durumu</h2>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-accent-green rounded-full animate-pulse"></span>
                    <span className="text-text-secondary">Tüm sistemler çalışıyor.</span>
                </div>
            </div>
        </div>
    );
}
