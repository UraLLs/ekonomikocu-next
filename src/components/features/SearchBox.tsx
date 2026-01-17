'use client';

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/piyasa/${query.trim().toUpperCase()}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-bg-secondary border border-border-subtle rounded-md focus-within:border-accent-green focus-within:ring-1 focus-within:ring-accent-green/20 transition-all group w-48 shadow-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-text-muted group-hover:text-text-secondary" />
            <input
                type="text"
                placeholder="Hisse/Kripto Ara..."
                className="bg-transparent border-none outline-none text-[13px] text-text-primary placeholder:text-text-muted flex-1 min-w-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
}
