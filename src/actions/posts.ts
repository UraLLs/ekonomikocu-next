'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Post, CreatePostInput } from '@/types/post';

// Post olustur
export async function createPost(input: CreatePostInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Giris yapmaniz gerekiyor' };
    }

    const { data, error } = await supabase
        .from('social_posts')
        .insert({
            user_id: user.id,
            content: input.content,
            symbol: input.symbol || null,
            sentiment: input.sentiment || null,
            image_url: input.image_url || null,
            post_type: input.post_type || 'chat',
            category: input.category || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Post olusturma hatasi:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true, post: data };
}

// Postlari getir
export async function getPosts(limit = 20, offset = 0, postType?: 'chat' | 'forum') {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    // Filter by post_type if specified
    if (postType) {
        query = query.eq('post_type', postType);
    }

    const { data: posts, error } = await query;

    if (error && Object.keys(error).length > 0) {
        console.error('Post getirme hatasi:', JSON.stringify(error, null, 2));
        return [];
    }

    // Profil bilgilerini ayri cek
    if (posts && posts.length > 0) {
        const userIds = [...new Set(posts.map(p => p.user_id))];
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, level')
            .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const postsWithProfiles = posts.map(post => ({
            ...post,
            profiles: profileMap.get(post.user_id) || null
        }));

        // Eger kullanici girisliyse, begenip begenmedigi kontrol et
        if (user) {
            const postIds = posts.map(p => p.id);
            const { data: likes } = await supabase
                .from('social_post_likes')
                .select('post_id')
                .eq('user_id', user.id)
                .in('post_id', postIds);

            const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

            return postsWithProfiles.map(post => ({
                ...post,
                is_liked: likedPostIds.has(post.id)
            })) as Post[];
        }

        return postsWithProfiles as Post[];
    }

    return posts as Post[];
}

// Tek post getir
export async function getPost(postId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: post, error } = await supabase
        .from('social_posts')
        .select(`
            *,
            profiles:user_id (
                id,
                username,
                avatar_url,
                level
            )
        `)
        .eq('id', postId)
        .single();

    if (error) {
        return null;
    }

    // Begeni durumu kontrol
    if (user) {
        const { data: like } = await supabase
            .from('social_post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single();

        return { ...post, is_liked: !!like } as Post;
    }

    return post as Post;
}

// Post begen/begeniyi kaldir
export async function toggleLike(postId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Giris yapmaniz gerekiyor' };
    }

    // Zaten begenmis mi kontrol et
    const { data: existingLike } = await supabase
        .from('social_post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        // Begeniyi kaldir
        const { error } = await supabase
            .from('social_post_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true, liked: false };
    } else {
        // Begen
        const { error } = await supabase
            .from('social_post_likes')
            .insert({
                post_id: postId,
                user_id: user.id
            });

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true, liked: true };
    }
}

// Post sil
export async function deletePost(postId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Giris yapmaniz gerekiyor' };
    }

    const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true };
}

// Sembol bazli postlari getir
export async function getPostsBySymbol(symbol: string, limit = 10) {
    const supabase = await createClient();

    const { data: posts, error } = await supabase
        .from('social_posts')
        .select(`
            *,
            profiles:user_id (
                id,
                username,
                avatar_url,
                level
            )
        `)
        .eq('symbol', symbol.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        return [];
    }

    return posts as Post[];
}
