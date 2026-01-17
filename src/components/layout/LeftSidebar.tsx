import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const MARKETS = [
    "Hisse Senetleri",
    "Döviz",
    "Kripto Paralar",
    "Emtia",
    "Endeksler",
    "Tahviller",
    "Vadeli İşlemler",
    "Fonlar"
];

const SECTORS = [
    { name: "Teknoloji", change: "+2.1%", isUp: true },
    { name: "Bankacılık", change: "+1.8%", isUp: true },
    { name: "Enerji", change: "-0.5%", isUp: false },
    { name: "Sağlık", change: "+3.2%", isUp: true },
    { name: "Sanayi", change: "+0.9%", isUp: true },
    { name: "Turizm", change: "-1.2%", isUp: false },
    { name: "İnşaat", change: "+0.4%", isUp: true },
];

export default function LeftSidebar() {
    return (
        <aside className="hidden lg:block w-[220px] shrink-0 space-y-8 sticky top-32 self-start">
            {/* Markets Menu */}
            <div className="bg-ivory p-4 shadow-sm border-l-2 border-muted-gold">
                <h3 className="font-display font-bold text-deep-navy text-sm uppercase tracking-widest mb-4 pb-2 border-b border-pearl">
                    Piyasalar
                </h3>
                <nav className="flex flex-col gap-1">
                    {MARKETS.map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-charcoal hover:bg-pearl hover:text-deep-navy transition-all"
                            style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
                        >
                            {item}
                            <ChevronRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-gold" />
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Sectors */}
            <div className="bg-ivory p-4 shadow-sm border-l-2 border-muted-gold">
                <h3 className="font-display font-bold text-deep-navy text-sm uppercase tracking-widest mb-4 pb-2 border-b border-pearl">
                    Sektörler
                </h3>
                <div className="flex flex-col gap-1">
                    {SECTORS.map((sector) => (
                        <div
                            key={sector.name}
                            className="flex justify-between items-center px-3 py-2 text-sm cursor-pointer hover:bg-pearl transition-colors"
                        >
                            <span className="font-medium text-charcoal">{sector.name}</span>
                            <span className={`font-mono font-bold text-xs ${sector.isUp ? 'text-emerald' : 'text-ruby'}`}>
                                {sector.change}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
