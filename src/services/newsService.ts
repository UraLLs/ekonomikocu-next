import { createClient } from "@/utils/supabase/server";
import { fetchRssFeed, RSS_FEEDS } from "./rssService";

export type NewsItem = {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    url: string | null;
    source: string | null;
    category: string | null;
    image_url: string | null;
    published_at: string;
    created_at?: string;
    status?: 'draft' | 'published' | 'archived';
    // Extras for UI
    link?: string; // For RSS compatibility
    pubDate?: string; // For RSS compatibility
    contentSnippet?: string; // For RSS compatibility
    image?: string; // For RSS compatibility
    relatedTicker?: any;
};

// 1. DATABASE NEWS (Curated / AI Processed)
export async function getDatabaseNews(isAdmin = false) {
    const supabase = await createClient();
    let query = supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('published_at', { ascending: false });

    if (!isAdmin) {
        query = query.eq('status', 'published');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as NewsItem[];
}

export async function getNewsBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        // .eq('status', 'published') // Configurable: admins might view drafts via slug? 
        // For public page, usually we want published only.
        .single();

    // Check status if not found or handled in UI
    if (error) return null;
    return data as NewsItem;
}

export async function getNewsById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as NewsItem;
}

// 2. LIVE ECONOMY NEWS (For Homepage - Bypasses DB to keep homepage alive/fresh)
// This restores the "Old System" behavior where backend handles fetching/caching live feeds directly.
export async function getEconomyNews(query?: string) {
    // Determine sources based on query or default
    const feeds = RSS_FEEDS;

    // Fetch all in parallel
    const allItems = await Promise.all(feeds.map(f => fetchRssFeed(f.url)));

    // Flatten
    const flatItems = allItems.flat();

    // Transform to NewsItem expected by UI
    const mapped: NewsItem[] = flatItems.map((item: any) => ({
        id: item.guid || item.link,
        title: item.title,
        slug: 'live-news', // Placeholder, homepage just links external usually or we can generate on fly if needed
        summary: item.contentSnippet,
        content: item.content,
        url: item.link,
        link: item.link, // For compatibility
        source: "Canlı Haber",
        category: "Finans",
        published_at: item.isoDate || new Date().toISOString(),
        pubDate: item.isoDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet,
        image_url: item.enclosure?.url || null,
        image: item.enclosure?.url || null,
        status: 'published'
    }));

    // Sort by date
    mapped.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    return mapped.slice(0, 10); // Return top 10
}
