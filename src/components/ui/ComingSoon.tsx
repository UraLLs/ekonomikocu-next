import Link from 'next/link';
import React from 'react';

interface ComingSoonProps {
    title?: string;
    description?: string;
}

export default function ComingSoon({
    title = "Çok Yakında",
    description = "Bu özellik üzerinde çalışmalarımız devam ediyor. En iyi deneyimi sunmak için hazırlanıyoruz."
}: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                    <span className="text-4xl">🚀</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex justify-center gap-3 pt-4">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                    >
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        href="/iletisim"
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Bize Ulaşın
                    </Link>
                </div>
            </div>
        </div>
    );
}
