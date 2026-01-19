'use client';

import { useState } from 'react';

interface ForumCategory {
    id: string;
    name: string;
    emoji: string;
    description: string;
    color: string;
}

const FORUM_CATEGORIES: ForumCategory[] = [
    { id: 'borsa', name: 'Borsa', emoji: '📈', description: 'BIST hisseleri hakkında tartışmalar', color: 'accent-green' },
    { id: 'kripto', name: 'Kripto', emoji: '₿', description: 'Bitcoin, Ethereum ve altcoinler', color: 'accent-orange' },
    { id: 'doviz', name: 'Döviz', emoji: '💱', description: 'Dolar, Euro ve diğer para birimleri', color: 'accent-blue' },
    { id: 'yatirim', name: 'Yatırım', emoji: '💰', description: 'Strateji ve portföy yönetimi', color: 'accent-purple' },
    { id: 'genel', name: 'Genel', emoji: '💬', description: 'Serbest sohbet alanı', color: 'gray' },
];

interface ForumTabsProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export default function ForumTabs({ activeCategory, onCategoryChange }: ForumTabsProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {FORUM_CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeCategory === cat.id
                            ? `bg-${cat.color} text-white shadow-lg`
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                </button>
            ))}
        </div>
    );
}

export { FORUM_CATEGORIES };
export type { ForumCategory };
