'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UserProfile {
    id: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    level: number;
    xp: number;
    followers_count: number;
    following_count: number;
    created_at: string;
}

// Takip et/birak
export async function toggleFollow(targetUserId: string) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Giris yapmaniz gerekiyor' };
    }

    if (user.id === targetUserId) {
        return { success: false, error: 'Kendinizi takip edemezsiniz' };
    }

    // Zaten takip ediyor mu kontrol et
    const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    if (existingFollow) {
        // Takibi birak
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('id', existingFollow.id);

        if (error) {
            return { success: false, error: error.message };
        }
        
        revalidatePath('/');
        return { success: true, following: false };
    } else {
        // Takip et
        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: user.id,
                following_id: targetUserId
            });

        if (error) {
            return { success: false, error: error.message };
        }
        
        revalidatePath('/');
        return { success: true, following: true };
    }
}

// Kullanici profilini getir
export async function getUserProfile(username: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) {
        return null;
    }

    return data as UserProfile;
}

// Kullanici profilini ID ile getir
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return data as UserProfile;
}

// Takip durumunu kontrol et
export async function checkFollowStatus(targetUserId: string): Promise<boolean> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return false;
    }

    const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    return !!data;
}

// Takipcileri getir
export async function getFollowers(userId: string, limit = 20) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('follows')
        .select(`
            id,
            created_at,
            follower:follower_id (
                id,
                username,
                avatar_url,
                level
            )
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        return [];
    }

    return data;
}

// Takip edilenleri getir
export async function getFollowing(userId: string, limit = 20) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('follows')
        .select(`
            id,
            created_at,
            following:following_id (
                id,
                username,
                avatar_url,
                level
            )
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        return [];
    }

    return data;
}

// Kullanicinin postlarini getir
export async function getUserPosts(userId: string, limit = 10) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

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
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        return [];
    }

    // Begeni durumu kontrol
    if (user && posts && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const { data: likes } = await supabase
            .from('social_post_likes')
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);

        const likedPostIds = new Set(likes?.map(l => l.post_id) || []);
        
        return posts.map(post => ({
            ...post,
            is_liked: likedPostIds.has(post.id)
        }));
    }

    return posts;
}
