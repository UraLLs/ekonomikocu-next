"use client";

import { User } from "@supabase/supabase-js";

interface LiveChatWrapperProps {
    room: unknown;
    currentUser: User | null;
}

export default function LiveChatWrapper({ currentUser }: LiveChatWrapperProps) {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-bold text-white mb-2">Canlı Sohbet</h3>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
                Yatırımcılarla gerçek zamanlı sohbet özelliği çok yakında aktif olacak.
            </p>
            {!currentUser && (
                <a
                    href="/giris"
                    className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-bold rounded-lg transition-colors"
                >
                    Giriş Yap
                </a>
            )}
            {currentUser && (
                <div className="px-4 py-2 bg-white/10 text-gray-400 text-sm font-medium rounded-lg">
                    Geliştirme aşamasında...
                </div>
            )}
        </div>
    );
}
