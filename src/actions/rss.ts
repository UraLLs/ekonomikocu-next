'use server';

import { createClient } from "@/utils/supabase/server";
import { fetchRssFeed, RSS_FEEDS } from "@/services/rssService";
import { revalidatePath } from "next/cache";

export async function fetchAndSaveNews() {
    const supabase = await createClient();
    let stats = {
        totalFound: 0,
        newAdded: 0,
        errors: 0
    };

    // Note: News functionality doesn't strictly need an author_id, but if we wanted to track who triggered it, we could.
    // For now, we just proceed.

    for (const feedSource of RSS_FEEDS) {
        const items = await fetchRssFeed(feedSource.url);
        stats.totalFound += items.length;

        for (const item of items) {
            try {
                if (!item.title || !item.link) continue;

                // Create slug from title
                let slug = item.title
                    .toLowerCase()
                    .replace(/[^a-z0-9ğüşıöç\s]/g, '')
                    .replace(/\s+/g, '-')
                    .substring(0, 100);

                // Check if news already exists (by slug)
                const { data: existing } = await supabase
                    .from('news')
                    .select('id')
                    .eq('slug', slug)
                    .single();

                if (existing) continue;

                // Prepare content
                // RSS content is often short. We map it to 'content' or 'summary'

                // Insert new news
                const { error } = await supabase.from('news').insert({
                    title: item.title,
                    slug: slug,
                    content: item.content || item.contentSnippet || '',
                    summary: item.contentSnippet || null,
                    url: item.link,
                    source: feedSource.name,
                    category: feedSource.category,
                    published_at: item.isoDate || new Date().toISOString(),
                    status: 'draft', // Back to draft for AI flow
                    // image_url: ... (Hard to get from RSS consistently)
                });

                if (error) {
                    console.error("Error inserting news:", error);
                    stats.errors++;
                } else {
                    stats.newAdded++;
                }

            } catch (e) {
                console.error("Error processing item:", e);
                stats.errors++;
            }
        }
    }

    revalidatePath('/admin/news');
    revalidatePath('/haberler');
    return stats;
}
