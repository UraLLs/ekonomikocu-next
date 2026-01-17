import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ekonomikocu.net'

    // Static pages
    const routes = [
        '',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Example dynamic pages (Ideally fetch from DB)
    const popularAssets = ['THYAO', 'BTC', 'GARAN', 'ASELS', 'EREGL'].map((symbol) => ({
        url: `${baseUrl}/piyasa/${symbol}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.8,
    }))

    return [...routes, ...popularAssets]
}
