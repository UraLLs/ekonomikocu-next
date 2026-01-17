"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface Message {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        username: string;
    };
}

interface ChatStreamProps {
    messages: Message[];
    currentUserId?: string;
}

export default function ChatStream({ messages, currentUserId }: ChatStreamProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-50 space-y-4">
                <div className="text-4xl animate-pulse grayscale">📡</div>
                <p className="text-xs font-mono tracking-widest uppercase">Sinyal Bekleniyor...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-none hover:scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, i) => {
                const isMe = currentUserId === msg.user_id;
                const username = msg.profiles?.username?.split('@')[0] || "Trader_X";
                const time = new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                const initial = username[0].toUpperCase();

                // Determine sentiment style based on keywords (simple heuristic)
                const isBullish = msg.content.toLowerCase().includes('uçuş') || msg.content.toLowerCase().includes('yüksel') || msg.content.includes('🚀');
                const isBearish = msg.content.toLowerCase().includes('çöküş') || msg.content.toLowerCase().includes('düş') || msg.content.includes('🔻');

                let glowClass = "border-white/5";
                if (isBullish) glowClass = "border-accent-green/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                if (isBearish) glowClass = "border-accent-red/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]";

                return (
                    <div key={msg.id} className={`group flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 shadow-lg 
                            ${isMe
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 border border-white/5'}`
                        }>
                            {initial}
                        </div>

                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                                {!isMe && <span className="text-[11px] font-bold text-gray-400 tracking-wide">{username}</span>}
                                <span className="text-[9px] font-mono text-gray-600">{time}</span>
                            </div>

                            <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed backdrop-blur-md border ${glowClass}
                                ${isMe
                                    ? 'bg-accent-blue/10 text-gray-100 rounded-tr-sm'
                                    : 'bg-white/5 text-gray-300 rounded-tl-sm hover:bg-white/10 transition-colors'
                                }
                            `}>
                                {msg.content}

                                {/* Sentiment Indicator */}
                                {isBullish && <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></div>}
                                {isBearish && <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></div>}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
