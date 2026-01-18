"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Message {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    user?: {
        email?: string; // We might need to join this, or just use ID for now/fetch separately. 
        // Usually Supabase realtime payloads don't include joined data easily. 
        // For MVP, we might just show ID or a placeholder if we don't fetch profiles.
        // Enhanced version: Fetch profiles map or store in context.
    };
    // For now, let's assume we might have some basic info or just show a hash/initials.
}

interface ChatMessagesProps {
    messages: Message[];
    currentUserId: string | null;
}

export default function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-50">
                    <p className="text-sm">Henüz mesaj yok. İlk mesajı sen gönder!</p>
                </div>
            ) : (
                messages.map((msg) => {
                    const isMe = currentUserId && msg.user_id === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isMe
                                        ? "bg-accent-green text-white rounded-br-none"
                                        : "bg-bg-elevated text-text-primary border border-border-subtle rounded-bl-none"
                                    }`}
                            >
                                <p className="break-words leading-relaxed">{msg.content}</p>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-[10px] text-text-muted font-medium">
                                    {format(new Date(msg.created_at), "HH:mm", { locale: tr })}
                                </span>
                                {!isMe && (
                                    // Placeholder for username - In a real app we'd fetch profile
                                    <span className="text-[10px] text-text-secondary opacity-70">
                                        • Kullanıcı
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={bottomRef} />
        </div>
    );
}
