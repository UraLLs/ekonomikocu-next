"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="lg:hidden">
            {/* Hamburger Trigger */}
            <button
                onClick={toggleMenu}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-md transition-colors"
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                ) : (
                    <Bars3Icon className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Menu Overlay & Drawer */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 w-64 bg-bg-surface border-l border-border-subtle shadow-2xl z-50 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-text-primary">Menü</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 text-text-muted hover:text-text-primary">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <MobileLink href="/" onClick={() => setIsOpen(false)} icon={<HomeIcon />}>
                                Ana Sayfa
                            </MobileLink>
                            <MobileLink href="/piyasa" onClick={() => setIsOpen(false)} icon={<ChartIcon />}>
                                Piyasalar
                            </MobileLink>
                            <MobileLink href="/egitim" onClick={() => setIsOpen(false)} icon={<AcademicIcon />}>
                                Eğitim
                            </MobileLink>
                            <MobileLink href="/canli" onClick={() => setIsOpen(false)} icon={<LiveIcon />}>
                                Canlı
                            </MobileLink>
                            <a href="https://forum.ekonomikocu.com" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors border border-transparent hover:border-border-subtle">
                                <span className="text-accent-green"><ChatIcon /></span>
                                Forum
                            </a>
                        </nav>

                        <div className="mt-auto pt-6 border-t border-border-subtle">
                            <p className="text-xs text-text-muted text-center">
                                &copy; 2025 Ekonomikoçu
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function MobileLink({ href, children, icon, onClick }: { href: string, children: React.ReactNode, icon: React.ReactNode, onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover rounded-lg transition-colors border border-transparent hover:border-border-subtle"
        >
            <span className="text-accent-green">{icon}</span>
            {children}
        </Link>
    );
}

// Icons
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const ChartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const AcademicIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const LiveIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>;
const ChatIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
