"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatRootProps {
    roomId: string; // UUID of the room
    currentUser: User | null;
}

interface Message {
    id: number; // We might use a negative number or string for temp IDs
    content: string;
    created_at: string;
    user_id: string;
    room_id: string;
    isOptimistic?: boolean;
}

export default function ChatRoot({ roomId, currentUser }: ChatRootProps) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const messagesRef = useRef<Message[]>([]);

    // Keep ref in sync for callbacks
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Initial Fetch & Subscription
    useEffect(() => {
        if (!roomId) return;

        // 1. Fetch initial messages
        const fetchMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from("messages")
                    .select("*")
                    .eq("room_id", roomId)
                    .order("created_at", { ascending: true })
                    .limit(50);

                if (error) {
                    console.error("Error fetching messages:", error);
                    setFetchError(`Mesajlar yüklenemedi`);
                } else {
                    setMessages(data || []);
                    setFetchError(null);
                }
            } catch (err: any) {
                console.error("Unexpected fetch error:", err);
                setFetchError(`Bağlantı hatası`);
            }
        };

        fetchMessages();

        // 2. Subscribe to new messages
        const channel = supabase
            .channel(`room:${roomId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `room_id=eq.${roomId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;

                    setMessages((prev) => {
                        // Check if we already have this message (deduplication)
                        const filtered = prev.filter(msg =>
                            !(msg.isOptimistic && msg.content === newMessage.content && msg.user_id === newMessage.user_id)
                        );

                        if (filtered.some(msg => msg.id === newMessage.id)) {
                            return filtered;
                        }

                        return [...filtered, newMessage];
                    });
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    setIsConnected(true);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, supabase]);

    const handleSendMessage = async (content: string) => {
        if (!currentUser) return;

        // 1. Optimistic Update
        const tempId = Date.now();
        const optimisticMessage: Message = {
            id: tempId,
            content,
            created_at: new Date().toISOString(),
            user_id: currentUser.id,
            room_id: roomId,
            isOptimistic: true
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        // 2. Send to DB
        const result = await supabase.from("messages").insert({
            room_id: roomId,
            user_id: currentUser.id,
            content: content,
        });

        const { error } = result;

        if (error) {
            console.error("Error sending message:", error);

            // Remove optimistic message on error
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

            alert(`Mesaj gönderilemedi!`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm relative">
            {/* Header */}
            <div className="p-4 border-b border-border-subtle bg-bg-elevated/10 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-2 text-text-primary">
                    Canlı Sohbet
                    {isConnected ? (
                        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" title="Bağlı"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-accent-red" title="Bağlantı kesildi"></span>
                    )}
                </h2>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted bg-bg-elevated px-2 py-1 rounded-full uppercase tracking-wider font-bold">
                        CANLI
                    </span>
                </div>
            </div>

            {/* ERROR DISPLAY */}
            {fetchError && (
                <div className="absolute top-16 left-4 right-4 z-10 bg-accent-red/10 border border-accent-red text-accent-red p-3 rounded-md text-xs">
                    <strong>Hata:</strong> {fetchError}
                </div>
            )}

            {/* Messages */}
            <ChatMessages messages={messages} currentUserId={currentUser?.id || null} />

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                disabled={!currentUser}
            />
        </div>
    );
}
