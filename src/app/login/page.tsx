"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const supabase = createClient();

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
                router.push("/");
                router.refresh();
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
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
        <div className="min-h-screen flex items-center justify-center bg-bg-primary relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-green/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/10 rounded-full blur-[120px]"></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md p-8 bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {isSignUp ? "Aramıza Katıl" : "Tekrar Hoşgeldin"}
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Türkiye'nin Yeni Nesil Finans Platformu
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-bg-elevated hover:bg-bg-surface-hover border border-border-subtle text-text-primary font-medium py-2.5 rounded-lg transition-all mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google ile Devam Et
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px flex-1 bg-border-subtle"></div>
                        <span className="text-xs text-text-muted uppercase">veya e-posta ile</span>
                        <div className="h-px flex-1 bg-border-subtle"></div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">E-posta</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-bg-secondary/50 border border-border-default rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-green transition-colors"
                                placeholder="ornek@mail.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-bg-secondary/50 border border-border-default rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-green transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-green/10 text-accent-green'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent-green hover:bg-accent-green/90 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-accent-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "İşleniyor..." : (isSignUp ? "Kayıt Ol" : "Giriş Yap")}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-text-secondary hover:text-accent-green transition-colors"
                        >
                            {isSignUp ? "Zaten hesabın var mı? Giriş Yap" : "Hesabın yok mu? Hemen Kayıt Ol"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
