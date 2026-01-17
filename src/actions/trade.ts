'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type TradeResult = {
    success: boolean;
    message: string;
};

export async function executeTrade(symbol: string, type: 'BUY' | 'SELL', quantity: number, price: number): Promise<TradeResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'İşlem yapmak için giriş yapmalısınız.' };
    }

    const totalAmount = quantity * price;

    try {
        // 1. Bakiyeyi Kontrol Et
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return { success: false, message: 'Kullanıcı profili bulunamadı.' };
        }

        if (type === 'BUY') {
            if (profile.balance < totalAmount) {
                return { success: false, message: `Yetersiz bakiye. Gerekli: ₺${totalAmount}, Mevcut: ₺${profile.balance}` };
            }

            // 2. Bakiyeyi Düş
            const { error: balanceError } = await supabase
                .from('profiles')
                .update({ balance: profile.balance - totalAmount })
                .eq('id', user.id);

            if (balanceError) throw balanceError;

            // 3. Portföye Ekle (Upsert)
            // Önce mevcut portföyü çekelim
            const { data: portfolioItem } = await supabase
                .from('portfolios')
                .select('*')
                .eq('user_id', user.id)
                .eq('symbol', symbol)
                .single();

            let newQuantity = quantity;
            if (portfolioItem) {
                newQuantity += Number(portfolioItem.quantity);
            }

            const { error: portfolioError } = await supabase
                .from('portfolios')
                .upsert({
                    user_id: user.id,
                    symbol: symbol,
                    quantity: newQuantity,
                    updated_at: new Date()
                }, { onConflict: 'user_id, symbol' });

            if (portfolioError) throw portfolioError;

        } else if (type === 'SELL') {
            // Satış mantığı (Burada kullanıcının elinde o hisse var mı kontrolü lazım)
            const { data: portfolioItem } = await supabase
                .from('portfolios')
                .select('*')
                .eq('user_id', user.id)
                .eq('symbol', symbol)
                .single();

            if (!portfolioItem || Number(portfolioItem.quantity) < quantity) {
                return { success: false, message: 'Satılacak yeterli hisseniz yok.' };
            }

            // Bakiyeyi Artır
            const { error: balanceError } = await supabase
                .from('profiles')
                .update({ balance: profile.balance + totalAmount })
                .eq('id', user.id);

            if (balanceError) throw balanceError;

            // Portföyden Düş
            const { error: portfolioError } = await supabase
                .from('portfolios')
                .update({
                    quantity: Number(portfolioItem.quantity) - quantity,
                    updated_at: new Date()
                })
                .eq('user_id', user.id)
                .eq('symbol', symbol);

            if (portfolioError) throw portfolioError;
        }

        // 4. İşlemi Kaydet (Transaction History)
        const { error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                symbol: symbol,
                type: type,
                quantity: quantity,
                price: price,
                total_amount: totalAmount
            });

        if (txError) throw txError;

        revalidatePath(`/piyasa/${symbol}`); // Sayfayı yenile
        return { success: true, message: `İşlem başarılı: ${symbol} ${type === 'BUY' ? 'alındı' : 'satıldı'}.` };

    } catch (error: any) {
        console.error('Trade Error:', error);
        return { success: false, message: 'İşlem sırasında hat oluştu: ' + error.message };
    }
}
