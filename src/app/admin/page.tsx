import { createClient } from '@/utils/supabase/server';
import {
    Users, Diamond, BookOpen, TrendingUp,
    Plus, Eye, Settings, ArrowUpRight, Clock
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch stats in parallel
    const [
        { count: userCount },
        { count: ipoCount },
        { count: courseCount },
        { data: recentCourses },
        { data: recentUsers }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ipos').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('id, title, created_at, is_published').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('id, full_name, email, created_at, avatar_url').order('created_at', { ascending: false }).limit(5),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Yönetim Paneli</h1>
                    <p className="text-text-secondary">Platform durumuna genel bakış</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/education/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Eğitim
                    </Link>
                    <Link
                        href="/admin/ipos/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Halka Arz
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Toplam Kullanıcı"
                    value={userCount || 0}
                    icon={Users}
                    color="from-brand-primary to-accent-blue"
                    trend="+12%"
                    trendUp={true}
                />
                <StatCard
                    title="Aktif Halka Arz"
                    value={ipoCount || 0}
                    icon={Diamond}
                    color="from-accent-blue to-cyan-500"
                    trend="+3"
                    trendUp={true}
                />
                <StatCard
                    title="Eğitim Sayısı"
                    value={courseCount || 0}
                    icon={BookOpen}
                    color="from-accent-orange to-yellow-500"
                    trend="+2"
                    trendUp={true}
                />
                <StatCard
                    title="Günlük Ziyaret"
                    value={0}
                    icon={TrendingUp}
                    color="from-accent-green to-emerald-400"
                    trend="—"
                    trendUp={true}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction href="/admin/education" icon={BookOpen} label="Eğitimleri Yönet" color="text-accent-orange" />
                <QuickAction href="/admin/ipos" icon={Diamond} label="Halka Arzları Yönet" color="text-accent-blue" />
                <QuickAction href="/admin/users" icon={Users} label="Kullanıcıları Gör" color="text-brand-primary" />
                <QuickAction href="/admin/settings" icon={Settings} label="Ayarlar" color="text-text-secondary" />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-orange/20 text-accent-orange">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-white">Son Eklenen Eğitimler</h3>
                        </div>
                        <Link href="/admin/education" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                            Tümü <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentCourses && recentCourses.length > 0 ? (
                            recentCourses.map((course: any) => (
                                <div key={course.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white truncate">{course.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                                            <Clock className="w-3 h-3" />
                                            {new Date(course.created_at).toLocaleDateString('tr-TR')}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${course.is_published
                                        ? 'bg-accent-green/20 text-accent-green'
                                        : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {course.is_published ? 'Yayında' : 'Taslak'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="Henüz eğitim eklenmemiş" actionLabel="Eğitim Ekle" actionHref="/admin/education/new" />
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                                <Users className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-white">Son Kayıt Olan Kullanıcılar</h3>
                        </div>
                        <Link href="/admin/users" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                            Tümü <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentUsers && recentUsers.length > 0 ? (
                            recentUsers.map((user: any) => (
                                <div key={user.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-accent-blue flex items-center justify-center text-white font-bold text-sm">
                                        {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white truncate">{user.full_name || 'İsimsiz Kullanıcı'}</h4>
                                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="Henüz kullanıcı yok" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend, trendUp }: any) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 blur-2xl -z-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-3xl font-black text-white mb-1">{value}</div>
                    <div className="text-sm text-text-secondary">{title}</div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
            {trend && (
                <div className={`mt-3 text-xs font-medium ${trendUp ? 'text-accent-green' : 'text-accent-red'}`}>
                    {trend} bu hafta
                </div>
            )}
        </div>
    );
}

function QuickAction({ href, icon: Icon, label, color }: any) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-3 p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-2xl transition-all group"
        >
            <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">{label}</span>
        </Link>
    );
}

function EmptyState({ message, actionLabel, actionHref }: { message: string, actionLabel?: string, actionHref?: string }) {
    return (
        <div className="p-8 text-center">
            <p className="text-text-muted text-sm mb-3">{message}</p>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
