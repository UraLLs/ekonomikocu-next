'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { XP_AMOUNTS, LEVEL_THRESHOLDS, type XPReason } from "@/utils/gamification";

export async function getLevelInfo(xp: number) {
    const levelData = LEVEL_THRESHOLDS.find(l => xp >= l.min && xp <= l.max) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

    // Calculate progress to next level
    let progress = 0;
    if (levelData.level < 4) {
        const range = levelData.max - levelData.min;
        const current = xp - levelData.min;
        progress = Math.min(100, Math.max(0, (current / range) * 100));
    } else {
        progress = 100; // Max level
    }

    return {
        currentLevel: levelData.level,
        title: levelData.title,
        progress: Math.round(progress),
        nextLevelXP: levelData.max + 1
    };
}

export async function awardXP(userId: string, reason: XPReason) {
    const supabase = await createClient();
    const amount = XP_AMOUNTS[reason];

    try {
        // 1. Get current user profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('xp, level')
            .eq('id', userId)
            .single();

        if (fetchError || !profile) {
            console.error('Error fetching profile for XP update:', fetchError);
            return { success: false, message: 'Kullanıcı bulunamadı.' };
        }

        let newXP = (profile.xp || 0) + amount;
        let currentLevel = profile.level || 1;

        // 2. Calculate New Level
        const levelInfo = await getLevelInfo(newXP);
        const newLevel = levelInfo.currentLevel;
        const isLevelUp = newLevel > currentLevel;

        // 3. Update Database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                xp: newXP,
                level: newLevel
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating XP:', updateError);
            return { success: false };
        }

        // Return clear stats for UI
        return {
            success: true,
            amount,
            newXP,
            newLevel,
            isLevelUp,
            previousLevel: currentLevel
        };

    } catch (error) {
        console.error('awardXP Exception:', error);
        return { success: false };
    }
}
