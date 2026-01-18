"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserMenu({ user, balance }: { user: User, balance: number | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const initial = user.email ? user.email[0].toUpperCase() : "U";

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-bg-secondary p-1.5 rounded-full transition-colors"
            >
                <div className="w-9 h-9 bg-accent-blue rounded-full flex items-center justify-center text-white font-bold border-2 border-bg-surface shadow-sm">
                    {initial}
                </div>
                <div className="hidden lg:block text-left mr-1">
                    <div className="text-xs font-bold text-text-primary text-white">Yatırımcı</div>
                    <div className="text-[10px] text-text-muted">{user.email?.slice(0, 15)}...</div>
                </div>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-12 w-64 bg-bg-surface border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-border-subtle bg-bg-elevated/50">
                            <div className="text-sm font-bold text-text-primary break-all">{user.email}</div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-text-muted">Bakiye:</span>
                                <span className="text-sm font-bold text-accent-green">
                                    ₺{balance?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '...'}
                                </span>
                            </div>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                            <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors flex items-center gap-2">
                                <span>👤</span> Profilim
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors flex items-center gap-2">
                                <span>⚙️</span> Ayarlar
                            </button>
                            <div className="h-px bg-border-subtle my-1"></div>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-3 py-2 text-sm text-accent-red hover:bg-accent-red-soft rounded-lg transition-colors flex items-center gap-2"
                            >
                                <span>🚪</span> Çıkış Yap
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
