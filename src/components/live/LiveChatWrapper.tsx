"use client";

import { User } from "@supabase/supabase-js";
import ChatRoot from "../chat/ChatRoot";
import { ChatRoom } from "@/types/chat";

interface LiveChatWrapperProps {
    room: ChatRoom | null;
    currentUser: User | null;
}

export default function LiveChatWrapper({ room, currentUser }: LiveChatWrapperProps) {
    if (!room || !room.id) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-bg-surface border border-border-subtle rounded-2xl p-4 text-center text-text-muted">
                <div className="animate-spin w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full mb-4"></div>
                <p>Sohbet odasına bağlanılıyor...</p>
            </div>
        );
    }

    // Check for Mock ID
    const isMock = room.id === '00000000-0000-0000-0000-000000000000';

    if (isMock) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-bg-surface border-2 border-accent-red rounded-2xl p-4 text-center">
                <div className="text-accent-red text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Sohbet Bağlantı Hatası</h3>
                <p className="text-sm text-text-secondary mb-4">
                    Sistem "Genel Piyasalar" sohbet odasına erişemiyor.
                </p>
                <div className="text-xs text-text-muted bg-bg-elevated p-2 rounded text-left w-full overflow-x-auto">
                    <strong>Sebep:</strong> Veritabanında oda bulunamadı veya yetki hatası.<br />
                    <strong>Çözüm:</strong> Lütfen <code>reinit_chat.sql</code> migrasyonunu çalıştırdığınızdan emin olun.
                </div>
            </div>
        );
    }

    return (
        <ChatRoot roomId={room.id} currentUser={currentUser} />
    );
}
