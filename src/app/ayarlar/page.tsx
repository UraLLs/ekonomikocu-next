import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Bell, Moon, HelpCircle, ChevronRight, Settings, LogOut } from "lucide-react";

export const metadata = {
    title: 'Ayarlar | Ekonomikoçu',
    description: 'Hesap ayarlarınızı yönetin.',
};

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/giris');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

    const settingSections = [
        {
            title: 'Profil Bilgileri',
            description: 'İsim, avatar ve hesap bilgileri',
            icon: User,
            href: '/profil/duzenle',
            color: 'bg-brand-primary/20 text-brand-primary'
        },
        {
            title: 'Bildirim Tercihleri',
            description: 'E-posta ve push bildirimleri',
            icon: Bell,
            href: '#',
            color: 'bg-accent-blue/20 text-accent-blue',
            disabled: true
        },
        {
            title: 'Görünüm',
            description: 'Tema ve görüntüleme ayarları',
            icon: Moon,
            href: '#',
            color: 'bg-purple-500/20 text-purple-500',
            disabled: true
        },
        {
            title: 'Yardım & Destek',
            description: 'SSS ve iletişim',
            icon: HelpCircle,
            href: '/iletisim',
            color: 'bg-accent-green/20 text-accent-green'
        }
    ];

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-brand-primary/20 text-brand-primary">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Ayarlar</h1>
                        <p className="text-sm text-text-muted">{profile?.username || user.email}</p>
                    </div>
                </div>

                {/* Settings List */}
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                    {settingSections.map((section) => (
                        <Link
                            key={section.title}
                            href={section.href}
                            className={`flex items-center gap-4 p-4 transition-colors ${section.disabled
                                ? 'opacity-50 pointer-events-none'
                                : 'hover:bg-white/[0.02]'
                                }`}
                        >
                            <div className={`p-2.5 rounded-xl ${section.color}`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-white text-sm">{section.title}</h3>
                                <p className="text-xs text-text-muted">{section.description}</p>
                                {section.disabled && (
                                    <span className="text-[10px] text-yellow-500 mt-0.5 inline-block">Yakında</span>
                                )}
                            </div>
                            {!section.disabled && (
                                <ChevronRight className="w-4 h-4 text-text-muted" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full flex items-center gap-4 p-4 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors"
                    >
                        <div className="p-2.5 rounded-xl bg-accent-red/20 text-accent-red">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-medium text-accent-red text-sm">Çıkış Yap</h3>
                            <p className="text-xs text-text-muted">Hesabından güvenli çıkış yap</p>
                        </div>
                    </button>
                </form>
            </div>

            <Footer />
        </main>
    );
}
