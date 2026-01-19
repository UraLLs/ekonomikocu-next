import { createClient } from '@/utils/supabase/server';
import { Users, Search, Shield, User, Mail, Calendar, MoreVertical } from 'lucide-react';

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Kullanıcı Yönetimi</h1>
                    <p className="text-text-secondary">Platform kullanıcılarını görüntüle ve yönet</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Kullanıcı ara..."
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50 w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-brand-primary/20 text-brand-primary">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{users?.length || 0}</div>
                            <div className="text-sm text-text-secondary">Toplam Kullanıcı</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-accent-green/10 to-transparent border border-accent-green/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-accent-green/20 text-accent-green">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{users?.filter(u => u.role === 'user').length || 0}</div>
                            <div className="text-sm text-text-secondary">Normal Kullanıcı</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-accent-orange/10 to-transparent border border-accent-orange/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-accent-orange/20 text-accent-orange">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{users?.filter(u => u.role === 'admin').length || 0}</div>
                            <div className="text-sm text-text-secondary">Admin</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Kullanıcı</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">E-posta</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Rol</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Kayıt Tarihi</th>
                                <th className="text-right p-4 text-xs font-bold text-text-muted uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users && users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-accent-blue flex items-center justify-center text-white font-bold">
                                                    {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.full_name || 'İsimsiz'}</div>
                                                    <div className="text-xs text-text-muted">@{user.username || 'username'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <Mail className="w-4 h-4 text-text-muted" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'admin'
                                                ? 'bg-accent-orange/20 text-accent-orange'
                                                : 'bg-accent-green/20 text-accent-green'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                                                <Calendar className="w-4 h-4 text-text-muted" />
                                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">
                                        Henüz kullanıcı bulunmuyor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
