"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
    onSendMessage: (content: string) => Promise<void>;
    disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading || disabled) return;

        setIsLoading(true);
        try {
            await onSendMessage(message);
            setMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3 bg-bg-surface border-t border-border-subtle flex items-center gap-2"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={disabled ? "Sohbet etmek için giriş yapın..." : "Bir mesaj yazın..."}
                disabled={disabled || isLoading}
                className="flex-1 bg-bg-elevated/50 border border-border-subtle text-text-primary text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent-green/50 focus:border-accent-green/50 placeholder:text-text-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={disabled || isLoading || !message.trim()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-accent-green text-white hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-green/20"
            >
                <PaperAirplaneIcon className={`w-5 h-5 ${isLoading ? 'opacity-0' : ''}`} />
                {isLoading && (
                    <div className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
            </button>
        </form>
    );
}
