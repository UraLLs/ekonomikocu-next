import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Header() {
    return (
        <header className="bg-deep-navy border-b-2 border-muted-gold sticky top-0 z-50 py-4 relative">
            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-muted-gold to-transparent opacity-30 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-[42px] h-[42px] bg-gradient-to-br from-muted-gold to-bright-gold flex items-center justify-center text-deep-navy text-xl shadow-gold transition-transform group-hover:scale-105"
                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                        ◆
                    </div>
                    <span className="font-display text-2xl font-bold text-bright-gold tracking-widest uppercase">
                        EKONOMIKOCU
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex gap-6 items-center hidden lg:flex">
                    {["Piyasalar", "Döviz", "Altın & Emtia", "Borsa", "Haberler"].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="text-ivory font-medium text-sm tracking-widest uppercase relative hover:text-bright-gold transition-colors duration-300 group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-bright-gold transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex gap-4 items-center">
                    {/* Search Box */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Sembol veya haber ara..."
                            className="w-60 py-2 px-4 bg-midnight border border-slate-blue text-ivory text-sm focus:outline-none focus:border-muted-gold transition-colors placeholder:text-graphite"
                            style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                        />
                        <MagnifyingGlassIcon className="w-4 h-4 text-muted-gold absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>

                    {/* Login Button */}
                    <button
                        className="px-6 py-2 bg-transparent text-bright-gold border-2 border-muted-gold font-bold text-xs tracking-widest uppercase hover:bg-muted-gold hover:text-deep-navy transition-all duration-300 cursor-pointer"
                        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                    >
                        Giriş Yap
                    </button>
                </div>
            </div>
        </header>
    );
}
