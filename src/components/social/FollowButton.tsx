'use client';

import { useState } from 'react';
import { toggleFollow } from '@/actions/follows';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
    targetUserId: string;
    isFollowing: boolean;
    currentUserId?: string | null;
    size?: 'sm' | 'md' | 'lg';
}

export default function FollowButton({ 
    targetUserId, 
    isFollowing: initialIsFollowing, 
    currentUserId,
    size = 'md' 
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        if (!currentUserId) {
            router.push('/giris');
            return;
        }

        if (currentUserId === targetUserId) {
            return;
        }

        setLoading(true);
        // Optimistic update
        setIsFollowing(!isFollowing);

        const result = await toggleFollow(targetUserId);
        
        if (!result.success) {
            // Revert on error
            setIsFollowing(isFollowing);
            alert(result.error);
        }
        
        setLoading(false);
    };

    // Kendini takip edemez
    if (currentUserId === targetUserId) {
        return null;
    }

    const sizeClasses = {
        sm: 'px-3 py-1 text-xs',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-6 py-2 text-base'
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`font-bold rounded-lg transition-all disabled:opacity-50 ${sizeClasses[size]} ${
                isFollowing
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-accent-red/20 hover:text-accent-red hover:border-accent-red/30'
                    : 'bg-accent-blue text-white hover:bg-accent-blue/80'
            }`}
        >
            {loading ? (
                <span className="flex items-center gap-1">
                    <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                </span>
            ) : isFollowing ? (
                'Takip Ediliyor'
            ) : (
                'Takip Et'
            )}
        </button>
    );
}
