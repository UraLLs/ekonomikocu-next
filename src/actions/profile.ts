'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileResult = {
    success: boolean;
    message: string;
};

export async function updateProfile(formData: FormData): Promise<ProfileResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Oturum açmanız gerekiyor.' };
    }

    const username = formData.get('username') as string;
    const fullName = formData.get('full_name') as string;
    const avatarUrl = formData.get('avatar_url') as string;

    // Validation
    if (username && username.length < 3) {
        return { success: false, message: 'Kullanıcı adı en az 3 karakter olmalıdır.' };
    }

    // Define exact shape for updates
    type ProfileUpdates = {
        updated_at: string;
        username?: string;
        full_name?: string;
        avatar_url?: string;
    };

    try {
        const updates: ProfileUpdates = {
            updated_at: new Date().toISOString(),
        };

        if (username) updates.username = username;
        if (fullName) updates.full_name = fullName;
        if (avatarUrl) updates.avatar_url = avatarUrl;

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...updates
            });

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { success: false, message: 'Bu kullanıcı adı zaten alınmış.' };
            }
            throw error;
        }

        revalidatePath('/profil');
        return { success: true, message: 'Profil başarıyla güncellendi.' };

    } catch (error: unknown) {
        console.error('Profile Update Error:', error);
        return { success: false, message: 'Profil güncellenirken bir hata oluştu.' };
    }
}
