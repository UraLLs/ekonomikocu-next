import { CATEGORIES } from "@/data/education";

export default function CategoryFilter({ activeCategory, onSelect }: { activeCategory: string, onSelect: (cat: string) => void }) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                            ? 'bg-accent-green text-white shadow-lg shadow-accent-green/20'
                            : 'bg-bg-surface border border-border-subtle text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
