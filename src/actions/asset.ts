"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface CommentActionState {
    success: boolean;
    message?: string;
}

export async function postComment(symbol: string, content: string): Promise<CommentActionState> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, message: "Yorum yapmak için giriş yapmalısınız." };
        }

        if (!content || content.trim().length === 0) {
            return { success: false, message: "Yorum içeriği boş olamaz." };
        }

        const { error } = await supabase.from("comments").insert({
            user_id: user.id,
            symbol: symbol,
            content: content
        });

        if (error) {
            console.error("Error posting comment:", error);
            return { success: false, message: "Yorum gönderilirken bir hata oluştu." };
        }

        revalidatePath(`/piyasa/${symbol}`); // Revalidate the specific asset page
        return { success: true, message: "Yorumunuz başarıyla gönderildi." };

    } catch (error) {
        console.error("Unexpected error posting comment:", error);
        return { success: false, message: "Beklenmedik bir hata oluştu." };
    }
}
