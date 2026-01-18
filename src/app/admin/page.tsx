import { createClient } from '@/utils/supabase/server';
import { Users, Diamond, BookOpen, MessageSquare } from 'lucide-react';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats in parallel
    const [
        { count: userCount },
        { count: ipoCount },
        { count: courseCount },
        { count: postCount }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ipos').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white">Yönetim Paneli</h1>
                <p className="text-text-secondary">Platform durumuna genel bakış.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Toplam Kullanıcı" value={userCount || 0} icon={Users} color="text-brand-primary" bg="bg-brand-primary/10" />
                <StatCard title="Aktif Halka Arz" value={ipoCount || 0} icon={Diamond} color="text-accent-blue" bg="bg-accent-blue/10" />
                <StatCard title="Eğitim Sayısı" value={courseCount || 0} icon={BookOpen} color="text-accent-orange" bg="bg-accent-orange/10" />
                <StatCard title="İçerik/Yazı" value={postCount || 0} icon={MessageSquare} color="text-accent-green" bg="bg-accent-green/10" />
            </div>

            <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Son Aktiviteler</h3>
                <div className="text-sm text-text-muted text-center py-8">
                    Henüz aktivite kaydı bulunmuyor.
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-bg-surface border border-white/5 p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-sm text-text-secondary">{title}</div>
            </div>
        </div>
    )
}
