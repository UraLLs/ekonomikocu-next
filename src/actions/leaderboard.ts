import { createClient } from "@/utils/supabase/server";
import { getAssetDetail } from "@/services/marketService";

export interface RankedUser {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    xp: number;
    level: number;
    portfolioValue?: number;
}

export async function getTopXPUsers(limit = 50): Promise<RankedUser[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(limit);

    return data || [];
}

export async function getTopPortfolioUsers(limit = 10): Promise<RankedUser[]> {
    const supabase = await createClient();

    // 1. Fetch profiles with their portfolios
    // Note: In a real large-scale app, this aggregation should happen in DB or background job
    const { data: profiles } = await supabase
        .from('profiles')
        .select(`
            *,
            portfolios (
                symbol,
                quantity,
                avg_cost
            )
        `);

    if (!profiles) return [];

    // 2. Calculate Total Value for each user
    const userValues = await Promise.all(profiles.map(async (user) => {
        let totalValue = 0;

        if (user.portfolios && Array.isArray(user.portfolios) && user.portfolios.length > 0) {
            // Get unique symbols to batch fetch prices if possible, or just fetch one by one (cached)
            for (const item of user.portfolios) {
                try {
                    // We use a simplified version or just current price if available
                    // For performance, we might want a bulk fetch, but getAssetDetail is what we have
                    const detail = await getAssetDetail(item.symbol);

                    if (detail && detail.price) {
                        // Parse price: "97,450.00" -> 97450.00
                        const priceStr = String(detail.price).replace(/[$,₺]/g, '').replace(/,/g, '');
                        const price = parseFloat(priceStr);
                        if (!isNaN(price)) {
                            totalValue += price * item.quantity;
                        }
                    }
                } catch (e) {
                    // Silently fail for individual asset price calculation errors
                }
            }
        }

        return {
            ...user,
            portfolioValue: totalValue
        };
    }));

    // 3. Sort and Limit
    return userValues
        .sort((a, b) => (b.portfolioValue || 0) - (a.portfolioValue || 0))
        .slice(0, limit);
}

