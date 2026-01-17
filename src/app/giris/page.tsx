"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Clear message when switching modes
    useEffect(() => {
        setMessage(null);
    }, [isSignUp]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage({ text: "Kayıt başarılı! Lütfen e-postanızı doğrulayın.", type: "success" });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/profil"); // Redirect to profile after login
                router.refresh();
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            setMessage({ text: error.message || "Bir hata oluştu.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen flex text-text-primary">
            {/* Left Column: Visual/Hero (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-bg-primary overflow-hidden items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-accent-green/5 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-accent-blue/5 rounded-full blur-[150px]"></div>
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                </div>

                <div className="relative z-10 max-w-lg px-10 text-center">
                    <div className="inline-block p-4 rounded-3xl bg-bg-surface/50 backdrop-blur-xl border border-border-subtle mb-8 shadow-2xl">
                        {/* Placeholder for Logo or Icon */}
                        <span className="text-5xl">🐂</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-accent-green via-text-primary to-accent-blue bg-clip-text text-transparent mb-6 leading-tight">
                        Piyasanın Nabzını <br /> Tutmaya Başla
                    </h1>
                    <p className="text-xl text-text-secondary leading-relaxed">
                        Ekonomikoçu ile yatırımlarını takip et, toplulukla tartış, analizlerini paylaş ve kazanmaya başla.
                    </p>

                    {/* Stats or Trust Indicators */}
                    <div className="mt-12 grid grid-cols-2 gap-6">
                        <div className="p-4 bg-bg-elevated/30 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-accent-green mb-1">100+</div>
                            <div className="text-sm text-text-secondary">Aktif Yatırımcı</div>
                        </div>
                        <div className="p-4 bg-bg-elevated/30 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-3xl font-bold text-accent-blue mb-1">24/7</div>
                            <div className="text-sm text-text-secondary">Canlı Veri</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-bg-surface lg:bg-bg-primary relative">
                {/* Mobile Background Decor */}
                <div className="absolute lg:hidden top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/10 rounded-full blur-[120px]"></div>

                <div className="w-full max-w-[420px] px-6 lg:px-0 relative z-10">
                    {/* Header */}
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            {isSignUp ? "Hesap Oluştur" : "Hoşgeldiniz"}
                        </h2>
                        <p className="text-text-secondary">
                            {isSignUp
                                ? "Finansal özgürlüğüne ilk adımı at."
                                : "Hesabına giriş yap ve piyasaları incele."}
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-bg-elevated hover:bg-bg-surface-hover border border-border-subtle text-text-primary font-medium py-3 rounded-xl transition-all mb-6 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google ile Devam Et
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px flex-1 bg-border-subtle"></div>
                        <span className="text-xs text-text-muted uppercase tracking-wider">veya e-posta</span>
                        <div className="h-px flex-1 bg-border-subtle"></div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">E-posta Adresi</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-secondary border border-border-default hover:border-border-hover focus:border-accent-green rounded-xl px-4 py-3.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-green transition-all placeholder:text-text-muted"
                                placeholder="isim@ornek.com"
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider">Şifre</label>
                                {!isSignUp && (
                                    <a href="#" className="text-xs text-accent-green hover:underline">Şifremi Unuttum?</a>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-secondary border border-border-default hover:border-border-hover focus:border-accent-green rounded-xl px-4 py-3.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-green transition-all placeholder:text-text-muted"
                                placeholder="En az 6 karakter"
                                required
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${message.type === 'error' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' : 'bg-accent-green/10 text-accent-green border border-accent-green/20'}`}>
                                {message.type === 'error' ? (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent-green to-accent-emerald hover:to-accent-green text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-green/20 hover:shadow-accent-green/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    İşleniyor...
                                </span>
                            ) : (isSignUp ? "Hesap Oluştur" : "Giriş Yap")}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-sm text-text-secondary">
                            {isSignUp ? "Zaten bir hesabın var mı?" : "Henüz hesabın yok mu?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 font-bold text-accent-green hover:text-accent-emerald transition-colors hover:underline"
                            >
                                {isSignUp ? "Giriş Yap" : "Hemen Kayıt Ol"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
