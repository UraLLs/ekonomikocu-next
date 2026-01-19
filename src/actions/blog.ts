'use server';

import { createClient } from "@/utils/supabase/server";
import { type Post } from "@/services/blogService";
import { revalidatePath } from "next/cache";

export async function createPost(post: Partial<Post>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return data;
}

export async function updatePost(id: string, updates: Partial<Post>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    if (updates.slug) revalidatePath(`/blog/${updates.slug}`);
    return data;
}

export async function deletePost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return true;
}
