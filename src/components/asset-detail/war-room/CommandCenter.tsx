"use client";

import { useState } from "react";

interface CommandCenterProps {
    onSendMessage: (text: string) => void;
    disabled?: boolean;
}

export default function CommandCenter({ onSendMessage, disabled = false }: CommandCenterProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const quickActions = [
        { label: "🚀 Uçuş", value: "🚀 Hissediyorum, uçuşa geçiyoruz!", color: "text-accent-green hover:bg-accent-green/10 border-accent-green/20" },
        { label: "🔻 Düşüş", value: "🔻 Dikkat! Düşüş trendi görüyorum.", color: "text-accent-red hover:bg-accent-red/10 border-accent-red/20" },
        { label: "💰 Ekleme", value: "💰 Portföye ekleme yapıldı.", color: "text-accent-orange hover:bg-accent-orange/10 border-accent-orange/20" },
    ];

    return (
        <div className="p-4 bg-black/20 backdrop-blur-xl border-t border-white/5">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => onSendMessage(action.value)}
                        disabled={disabled}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 whitespace-nowrap ${action.color} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            {/* Main Input */}
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue/50 to-accent-purple/50 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-black/60 rounded-xl border border-white/10 focus-within:border-white/20 transition-colors">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={disabled ? "Giriş yapmalısın..." : "Emir gir veya yorum yap..."}
                        disabled={disabled}
                        className="w-full bg-transparent border-none px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:ring-0 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={disabled || !message.trim()}
                        className="mr-2 p-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent-blue"
                    >
                        <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>

            {!disabled && (
                <div className="text-[10px] text-gray-600 text-center mt-2 font-mono uppercase tracking-widest">
                    SYSTEM READY • ENCRYPTED
                </div>
            )}
        </div>
    );
}
