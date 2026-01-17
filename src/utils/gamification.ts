export type XPReason = 'COMMENT' | 'VOTE' | 'CORRECT_GUESS' | 'DAILY_LOGIN';

export const XP_AMOUNTS: Record<XPReason, number> = {
    COMMENT: 5,
    VOTE: 2,
    CORRECT_GUESS: 10,
    DAILY_LOGIN: 5
};

export const LEVEL_THRESHOLDS = [
    { level: 1, min: 0, max: 99, title: 'Çaylak' },
    { level: 2, min: 100, max: 499, title: 'Yatırımcı' },
    { level: 3, min: 500, max: 999, title: 'Analist' },
    { level: 4, min: 1000, max: Infinity, title: 'Üstat' }
];
