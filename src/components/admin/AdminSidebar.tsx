'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Diamond,
    GraduationCap,
    Radio,
    Users,
    Settings,
    LogOut,
    Home,
    ChevronRight,
    FileText,
    Globe
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
    { name: 'Panel', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Halka Arzlar', href: '/admin/ipos', icon: Diamond },
    { name: 'Eğitimler', href: '/admin/education', icon: GraduationCap },
    { name: 'Canlı Yayın', href: '/admin/yayin', icon: Radio },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Haberler', href: '/admin/news', icon: Globe },
    { name: 'Kullanıcılar', href: '/admin/users', icon: Users },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const isActive = (item: typeof menuItems[0]) => {
        if (item.exact) {
            return pathname === item.href;
        }
        return pathname.startsWith(item.href);
    };

    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18] border-r border-white/5 flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
            {/* Logo area */}
            <div className="p-5 border-b border-white/5">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-primary via-accent-blue to-brand-primary rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-primary/30 group-hover:shadow-brand-primary/50 transition-all group-hover:scale-105">
                        E
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white tracking-tight text-lg">Admin<span className="text-brand-primary">Panel</span></span>
                        <span className="text-[10px] text-text-muted uppercase tracking-widest">Yönetim Merkezi</span>
                    </div>
                </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-3 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Ana Menü
                </div>
                {menuItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${active
                                ? 'bg-gradient-to-r from-brand-primary/20 to-brand-primary/5 text-white border border-brand-primary/30'
                                : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-all ${active
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                    : 'bg-white/5 text-text-muted group-hover:bg-white/10 group-hover:text-white'
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            {active && <ChevronRight className="w-4 h-4 text-brand-primary" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-white/5 space-y-1">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-white transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-white/5 text-text-muted group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-all">
                        <Home className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Siteyi Görüntüle</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-accent-red/10 hover:text-accent-red transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-white/5 text-text-muted group-hover:bg-accent-red/20 group-hover:text-accent-red transition-all">
                        <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}
