import Parser from 'rss-parser';
import slugify from 'slugify';
import { createClient } from '@/utils/supabase/server'; // Use server client here as these run on server
import { analyzeNewsWithGemini } from './geminiService';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

// Fetch actual article content from source URL
async function fetchArticleContent(url: string): Promise<string> {
    try {
        // Security Check: SSRF Prevention
        // Only allow http/https and block local/private IP ranges if possible (basic check here)
        const validUrl = new URL(url);
        if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
            console.warn(`Blocked invalid protocol: ${validUrl.protocol}`);
            return '';
        }

        // Basic block for localhost/private IPs (Naive check, but better than nothing)
        const hostname = validUrl.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
            console.warn(`Blocked potentially private hostname: ${hostname}`);
            return '';
        }

        console.log(`Fetching article content from: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            console.warn(`Failed to fetch article: ${response.status}`);
            return '';
        }

        const html = await response.text();

        // Extract text content from article body
        // NTV uses article-body class or similar patterns
        let content = '';

        // Try to find article content using regex patterns
        // Pattern 1: Look for article-body or news-content divs
        const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
            html.match(/<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
            html.match(/<div[^>]*class="[^"]*news-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
            html.match(/<div[^>]*class="[^"]*content-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

        if (articleMatch) {
            content = articleMatch[1];
        } else {
            // Fallback: get all paragraph text
            const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
            content = paragraphs.slice(0, 10).join(' '); // First 10 paragraphs
        }

        // Clean HTML tags and normalize whitespace
        content = content
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();

        // Limit to reasonable length for AI processing
        if (content.length > 3000) {
            content = content.substring(0, 3000) + '...';
        }

        console.log(`Extracted ${content.length} chars of content`);
        return content;

    } catch (error) {
        console.error('Error fetching article content:', error);
        return '';
    }
}

export interface NewsItem {
    id?: string;
    title: string;
    slug: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    content?: string;
    summary?: string;
    image?: string;
    source: string;
    sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    relatedTicker?: {
        symbol: string;
        changePercent: string;
        isUp: boolean;
    };
}

// Helper to create URL-friendly slugs
function createSlug(title: string): string {
    return slugify(title, {
        lower: true,
        strict: true,
        locale: 'tr'
    }) + '-' + Math.floor(Math.random() * 1000); // Add random suffix to avoid collisions
}

export async function getEconomyNews(query?: string): Promise<NewsItem[]> {
    console.log(`RSS Fetching started. Source: ${query ? 'Google News (' + query + ')' : 'NTV Ekonomi'}...`);
    try {
        let feedUrl = 'https://www.ntv.com.tr/ekonomi.rss';

        // If a specific query is provided (e.g. for Asset Page), use Google News RSS for better relevance
        // BUT if it is 'general', we want the default NTV feed (Homepage)
        if (query && query !== 'general') {
            feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=tr&gl=TR&ceid=TR:tr`;
        }

        const feed = await parser.parseURL(feedUrl);

        // Map items to our format
        const items = feed.items.slice(0, 15).map(item => {
            // Google News doesn't provide images in standard enclosure usually, but we can try to extract from description if available
            // or leave it empty to fallback to default placeholders.
            let imageUrl: string | undefined = undefined;
            if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
            } else if (item.content?.includes('<img')) {
                const match = item.content.match(/src=["'](.*?)["']/);
                if (match) imageUrl = match[1];
            }

            // Clean and deterministic slug
            const slug = slugify(item.title || '', { lower: true, strict: true, locale: 'tr' });

            return {
                title: item.title || 'Başlıksız Haber',
                slug: slug,
                link: item.link || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                contentSnippet: item.contentSnippet || item.content || '',
                image: imageUrl,
                source: (query && query !== 'general') ? 'Google News' : 'NTV Ekonomi'
            };
        });

        if (query) {
            // Google News RSS returns matches, so strictly no need to filter again, but we return all items found.
            return items;
        }

        return items;

    } catch (error) {
        console.error("RSS Fetch Error:", error);
        return [];
    }
}

export async function getNewsDetail(slug: string, originalLink?: string, title?: string, image?: string, pubDate?: string): Promise<NewsItem | null> {
    const supabase = await createClient();

    // 1. Check DB first
    let { data: article } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();

    // Self-healing: If article exists but has the generic error message or the new warning format, treat it as not found (re-process)
    if (article &&
        article.summary !== "Analiz sırasında bir hata oluştu." &&
        !article.summary?.startsWith("Analiz hatası:") &&
        !article.summary?.startsWith("⚠️") // Add this line to catch the new error format
    ) {
        // Return formatted from DB
        return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            link: article.original_url,
            pubDate: article.original_date,
            contentSnippet: article.summary,
            content: article.content,
            summary: article.summary,
            image: article.image_url,
            source: 'Ekonomikoçu AI',
            sentiment: article.sentiment
        };
    }

    // 2. If not found (or error state), we check by original_url to avoid duplicates (Unique Constraint)
    // Sometimes slug logic changes or title is slightly different, but URL is same.
    if (originalLink) {
        let { data: existingByUrl } = await supabase
            .from('news_articles')
            .select('*')
            .eq('original_url', originalLink)
            .single();

        if (existingByUrl &&
            existingByUrl.summary !== "Analiz sırasında bir hata oluştu." &&
            !existingByUrl.summary?.startsWith("⚠️")) {
            return {
                id: existingByUrl.id,
                title: existingByUrl.title,
                slug: existingByUrl.slug,
                link: existingByUrl.original_url,
                pubDate: existingByUrl.original_date,
                contentSnippet: existingByUrl.summary,
                summary: existingByUrl.summary,
                content: existingByUrl.content,
                image: existingByUrl.image_url,
                source: 'Ekonomikoçu AI',
                sentiment: existingByUrl.sentiment
            };
        }
    }

    // 2.5 Validation: We need title and link to proceed
    if (!originalLink || !title) {
        // If we only have slug and existing article was error, we can't recover without original data.
        // Return the error article if valid inputs are missing
        if (article) return {
            id: article.id,
            title: article.title,
            slug: article.slug,
            link: article.original_url,
            pubDate: article.original_date,
            contentSnippet: article.summary,
            content: article.content,
            summary: article.summary,
            image: article.image_url,
            source: 'Ekonomikoçu AI',
            sentiment: article.sentiment
        };
        return null;
    }

    // 3. Process with AI
    console.log(`Analyzing news using Gemini: ${title}`);

    // Check API Key existence before even trying (server-side check)
    if (!process.env.GOOGLE_API_KEY) {
        console.error("Serverside: GOOGLE_API_KEY is missing in process.env");
    }

    // Fetch actual content from source URL for accurate AI analysis
    let articleContent = '';
    if (originalLink) {
        articleContent = await fetchArticleContent(originalLink);
    }

    // Use fetched content if available, otherwise fallback to title only
    const contentForAI = articleContent || `Haber başlığı: ${title}. Yayın tarihi: ${pubDate || 'belirtilmemiş'}.`;

    const analysis = await analyzeNewsWithGemini(title, contentForAI);

    // 4. Save to DB (Upsert to fix previous error record if it exists)
    // Use Service Role Key if available to bypass RLS, otherwise fallback to standard client
    let adminSupabase = supabase;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { createClient: createClientJs } = require('@supabase/supabase-js');
        adminSupabase = createClientJs(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );
    }

    const { data: newArticle, error } = await adminSupabase
        .from('news_articles')
        .upsert({
            slug: slug,
            title: title,
            original_url: originalLink,
            image_url: image,
            summary: analysis.summary,
            content: analysis.content,
            sentiment: analysis.sentiment,
            original_date: pubDate
        }, { onConflict: 'slug' }) // Use slug as conflict target
        .select()
        .single();

    if (error) {
        console.error("Error saving news (Full Object):", JSON.stringify(error, null, 2));
        // Return transient object
        return {
            title,
            slug,
            link: originalLink,
            pubDate: pubDate || new Date().toISOString(),
            contentSnippet: analysis.summary,
            content: analysis.content,
            summary: analysis.summary,
            image,
            source: 'Ekonomikoçu AI (Kaydedilemedi)',
            sentiment: analysis.sentiment
        };
    }

    return {
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        link: newArticle.original_url,
        pubDate: newArticle.original_date,
        contentSnippet: newArticle.summary,
        summary: newArticle.summary,
        content: newArticle.content,
        image: newArticle.image_url,
        source: 'Ekonomikoçu AI',
        sentiment: newArticle.sentiment
    };
}

