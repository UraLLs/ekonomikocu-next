import { LEVEL_THRESHOLDS } from '@/utils/gamification';

interface UserBadgeProps {
    level: number;
    showTitle?: boolean;
    className?: string;
}

export default function UserBadge({ level, showTitle = false, className = "" }: UserBadgeProps) {
    const levelInfo = LEVEL_THRESHOLDS.find(l => level >= l.level && level < (LEVEL_THRESHOLDS[l.level]?.min || Infinity)) || LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];

    // Badge Colors based on level
    const badgeColors = {
        1: 'bg-gray-500/20 text-gray-400 border-gray-500/30', // Çaylak
        2: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30', // Yatırımcı
        3: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30', // Analist
        4: 'bg-accent-orange/20 text-accent-orange border-accent-orange/30' // Üstat
    };

    const colorClass = badgeColors[level as keyof typeof badgeColors] || badgeColors[1];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${colorClass} ${className}`}>
            <span>Lvl {level}</span>
            {showTitle && <span>• {levelInfo.title}</span>}
        </span>
    );
}
