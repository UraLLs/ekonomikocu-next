'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Diamond,
    GraduationCap,
    Radio,
    Newspaper,
    Users,
    Settings,
    LogOut,
    Home
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const menuItems = [
    { name: 'Panel', href: '/admin', icon: LayoutDashboard },
    { name: 'Halka Arzlar', href: '/admin/ipos', icon: Diamond },
    { name: 'Eğitimler', href: '/admin/education', icon: GraduationCap },
    { name: 'Canlı Yayın', href: '/admin/live', icon: Radio },
    { name: 'İçerik/Blog', href: '/admin/blog', icon: Newspaper },
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

    return (
        <aside className="w-64 h-screen bg-bg-surface border-r border-white/5 flex flex-col fixed left-0 top-0 overflow-y-auto">
            {/* Logo area */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-gradient-to-tr from-brand-primary to-accent-blue rounded-lg flex items-center justify-center font-black text-white text-lg group-hover:scale-105 transition-transform">
                        E
                    </div>
                    <span className="font-bold text-white tracking-tight">Admin<span className="text-brand-primary">Panel</span></span>
                </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span className="font-medium text-sm">Siteyi Görüntüle</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-accent-red hover:bg-accent-red/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Çıkış Yap</span>
                </button>
            </div>
        </aside>
    );
}
