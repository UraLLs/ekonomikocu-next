import { MagnifyingGlassIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import UserMenu from "./UserMenu";
import SearchBox from "../features/SearchBox";
import MobileNav from "./MobileNav";

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let balance = null;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();
        balance = profile?.balance;
    }

    return (
        <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 h-16 shadow-2xl supports-[backdrop-filter]:bg-black/40">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
                    <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                        <img src="/logo.png" alt="Ekonomikoçu Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    </div>
                    <div className="font-bold text-xl text-text-primary tracking-tight">
                        ekonomi<span className="text-accent-green">kocu</span>
                    </div>
                </Link>

                {/* NAV */}

                <nav className="hidden lg:flex items-center gap-2">
                    <Link href="/" className="px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                        Ana Sayfa
                    </Link>
                    <Link href="/piyasa" className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                        Piyasalar
                    </Link>

                    <Link href="/egitim" className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        Eğitim
                    </Link>
                    <Link href="/canli" className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                        Canlı
                        <span className="bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                    </Link>
                    <Link href="/topluluk" className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Topluluk
                    </Link>
                </nav>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                    {/* Search Box */}
                    <SearchBox />

                    {/* Theme Toggle */}
                    <button className="w-10 h-10 flex items-center justify-center rounded-md bg-bg-secondary text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors">
                        <SunIcon className="w-5 h-5 hidden dark:block" />
                        <MoonIcon className="w-5 h-5 block dark:hidden" />
                    </button>

                    {/* AUTH STATE */}
                    {user ? (
                        <>
                            {/* Balance Display */}
                            {/* Balance Display - Modified to show only on XL screens to prevent menu crowding */}
                            <div className="hidden xl:flex flex-col items-end mr-2">
                                <span className="text-[10px] text-text-muted">Portföy</span>
                                <span className="text-sm font-bold text-accent-green">
                                    ₺{balance?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '...'}
                                </span>
                            </div>
                            <UserMenu user={user} balance={balance} />
                        </>
                    ) : (
                        <Link href="/giris" className="px-4.5 py-2 text-sm font-semibold text-white bg-gradient-to-br from-accent-green to-emerald-600 rounded-md hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all">
                            Giriş Yap
                        </Link>
                    )}

                    {/* Mobile Menu Trigger */}
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
