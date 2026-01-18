import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    HomeIcon,
    VideoCameraIcon,
    ChatBubbleLeftRightIcon,
    UsersIcon,
    ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/giris");

    // Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
                <div className="text-center p-8 bg-bg-surface border border-accent-red/20 rounded-2xl">
                    <h1 className="text-3xl font-black text-accent-red mb-4">Yetkisiz Giriş 🚫</h1>
                    <p className="text-text-secondary mb-6">Bu alana erişim yetkiniz bulunmamaktadır.</p>
                    <Link href="/" className="bg-bg-elevated px-6 py-2 rounded-lg font-bold hover:bg-bg-secondary transition-colors">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    const menuItems = [
        { name: "Genel Bakış", href: "/admin", icon: HomeIcon },
        { name: "Canlı Yayın", href: "/admin/yayin", icon: VideoCameraIcon },
        { name: "Sohbet Odaları", href: "/admin/odalar", icon: ChatBubbleLeftRightIcon },
        { name: "Kullanıcılar", href: "/admin/kullanicilar", icon: UsersIcon },
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex">
            {/* Sidebar */}
            <div className="w-64 bg-bg-surface border-r border-border-subtle p-6 flex flex-col fixed h-full">
                <div className="mb-10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-blue rounded-lg"></div>
                    <span className="font-black text-xl tracking-tight">Admin<span className="text-accent-blue">Panel</span></span>
                </div>

                <nav className="space-y-2 flex-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-all font-medium"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-border-subtle">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent-red/10 text-text-muted hover:text-accent-red transition-all font-medium">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        Çıkış / Siteye Dön
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 ml-64 p-8">
                {children}
            </div>
        </div>
    );
}
