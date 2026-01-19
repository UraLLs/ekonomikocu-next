import { createClient } from "@/utils/supabase/server";

export type Post = {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    excerpt: string | null;
    thumbnail_url: string | null;
    published: boolean;
    author_id: string;
    views: number;
    created_at: string;
    updated_at: string;
};

export async function getPosts(isAdmin = false) {
    const supabase = await createClient();
    let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

    // If not admin fetching, show only published
    if (!isAdmin) {
        query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Post[];
}

export async function getPostBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url)')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error) return null;
    return data;
}

export async function getPostById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Post;
}
