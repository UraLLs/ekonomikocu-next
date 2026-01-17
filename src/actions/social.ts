'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type SocialResult = {
    success: boolean;
    message: string;
    data?: any;
};

export async function postComment(symbol: string, content: string): Promise<SocialResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'Yorum yapmak için giriş yapmalısınız.' };
    }

    if (!content || content.trim().length === 0) {
        return { success: false, message: 'Yorum boş olamaz.' };
    }

    try {
        const { error } = await supabase
            .from('comments')
            .insert({
                user_id: user.id,
                symbol: symbol,
                content: content.trim()
            });

        if (error) throw error;

        revalidatePath(`/piyasa/${symbol}`);
        return { success: true, message: 'Yorumunuz paylaşıldı.' };

    } catch (error: any) {
        console.error('Post Comment Error:', error);
        return { success: false, message: 'Yorum gönderilirken hata oluştu.' };
    }
}
