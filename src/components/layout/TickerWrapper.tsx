'use client';

import { usePathname } from 'next/navigation';

export default function TickerWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide ticker on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return <>{children}</>;
}
