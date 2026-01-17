"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";

interface Message {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        username: string;
    };
}

export default function WarRoom({ symbol }: { symbol: string }) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineCount, setOnlineCount] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);

    // Get Current User
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    // Fetch Initial Messages & Subscribe to Realtime
    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*, profiles(username)')
                .eq('asset_symbol', symbol)
                .order('created_at', { ascending: true })
                .limit(50);

            if (data) setMessages(data);
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`room_${symbol}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `asset_symbol=eq.${symbol}`
                },
                async (payload) => {
                    // We need to fetch the username for the new message
                    const { data: userData } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', payload.new.user_id)
                        .single();

                    const newMsg = {
                        ...payload.new,
                        profiles: userData
                    } as Message;

                    setMessages((current) => [...current, newMsg]);
                }
            )
            .subscribe((status) => {
                // Simple online count logic simulation for now
                if (status === 'SUBSCRIBED') {
                    setOnlineCount(Math.floor(Math.random() * 50) + 120);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [symbol]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !user) return;

        const content = newMessage.trim();
        setNewMessage(""); // Optimistic clear

        const { error } = await supabase
            .from('messages')
            .insert({
                content,
                asset_symbol: symbol,
                user_id: user.id
            });

        if (error) {
            console.error(error);
            alert("Mesaj gönderilemedi. Giriş yaptınız mı?");
        }
    };

    const handleQuickReply = (text: string) => {
        setNewMessage(text);
        // Optional: Auto send or just fill input
    };

    return (
        <div className="flex flex-col h-[600px] bg-bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-elevated/50">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className="text-lg">💬</span>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-red rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-red rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-sm">War Room: {symbol}</h3>
                        <span className="text-[10px] text-accent-green flex items-center gap-1">
                            ● {onlineCount} Online
                        </span>
                    </div>
                </div>
                <button className="text-xs bg-bg-surface hover:bg-bg-surface-hover text-text-secondary px-2 py-1 rounded border border-border-subtle transition-colors">
                    Kurallar
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center text-text-muted text-xs py-10 opacity-50">
                        Henüz mesaj yok. İlk yazan sen ol! 👇
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = user?.id === msg.user_id;
                    const initial = msg.profiles?.username?.[0]?.toUpperCase() || "A";
                    // Using email as username for now
                    const username = msg.profiles?.username?.split('@')[0] || "Anonim";
                    const time = new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-blue/20 text-accent-blue'}`}>
                                {initial}
                            </div>
                            <div className={`${isMe ? 'text-right' : ''} max-w-[80%]`}>
                                <div className={`flex items-center gap-2 mb-0.5 ${isMe ? 'justify-end' : ''}`}>
                                    {!isMe && <span className="text-xs font-bold text-text-primary">{username}</span>}
                                    <span className="text-[10px] text-text-muted">{time}</span>
                                    {isMe && <span className="text-xs font-bold text-text-primary">Sen</span>}
                                </div>
                                <p className={`text-sm p-2 rounded-lg ${isMe
                                        ? 'bg-accent-green/10 text-text-primary rounded-tr-none border border-accent-green/20'
                                        : 'bg-bg-elevated text-text-secondary rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border-subtle bg-bg-elevated/30">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={user ? `#${symbol} hakkında bir şeyler yaz...` : "Mesaj yazmak için giriş yap"}
                        disabled={!user}
                        className="w-full bg-bg-surface border border-border-default rounded-lg pl-4 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors placeholder:text-text-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!user || !newMessage.trim()}
                        className="absolute right-2 top-2 text-accent-blue hover:text-accent-blue-soft transition-colors p-0.5 disabled:opacity-30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    </button>
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
                    {['🚀 Uçuş', '🔻 Çöküş', '🤔 Analiz?', '💰 Ekleme Yaptım'].map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleQuickReply(tag)}
                            disabled={!user}
                            className="px-2 py-1 rounded bg-bg-surface text-text-secondary text-[10px] border border-border-subtle hover:bg-bg-surface-hover whitespace-nowrap transition-colors disabled:opacity-50"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </form>
        </div>
    );
}
