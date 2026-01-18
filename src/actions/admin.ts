"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Check if user is admin helper
async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}

export async function updateSystemConfig(key: string, value: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('system_config')
        .upsert({ key, value });

    if (error) throw error;

    revalidatePath('/canli'); // Revalidate live page
    revalidatePath('/admin/yayin');
}

export async function getSystemConfig(key: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', key)
        .single();

    return data?.value || null;
}

export async function deleteChatRoom(roomId: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = await createClient();
    const { error } = await supabase.from('chat_rooms').delete().eq('id', roomId);
    if (error) throw error;

    revalidatePath('/admin/odalar');
    revalidatePath('/sosyal');
}

export async function createChatRoomAdmin(name: string, description: string, minLevel: number) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = await createClient();
    // Use upsert or insert. Admin rooms are usually public (is_private: false).
    // We can use a hardcoded UUID or let Supabase gen it.
    const { error } = await supabase.from('chat_rooms').insert({
        name,
        description,
        min_level: minLevel,
        is_private: false,
        created_by: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) throw error;
    revalidatePath('/admin/odalar');
    revalidatePath('/sosyal');
}
