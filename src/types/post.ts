export type PostType = 'chat' | 'forum';
export type ForumCategory = 'borsa' | 'kripto' | 'doviz' | 'yatirim' | 'genel';

export interface Post {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    content: string;
    symbol?: string | null;
    sentiment?: 'BULL' | 'BEAR' | 'NEUTRAL' | null;
    image_url?: string | null;
    likes_count: number;
    comments_count: number;
    is_pinned: boolean;
    post_type: PostType;
    category?: ForumCategory | null;
    // Joined data
    profiles?: {
        id: string;
        username: string;
        avatar_url?: string | null;
        level?: number;
    };
    // Client state
    is_liked?: boolean;
}

export interface PostComment {
    id: string;
    created_at: string;
    post_id: string;
    user_id: string;
    content: string;
    likes_count: number;
    profiles?: {
        id: string;
        username: string;
        avatar_url?: string | null;
        level?: number;
    };
}

export interface PostLike {
    id: string;
    created_at: string;
    post_id: string;
    user_id: string;
}

export interface CreatePostInput {
    content: string;
    symbol?: string;
    sentiment?: 'BULL' | 'BEAR' | 'NEUTRAL';
    image_url?: string;
    post_type?: PostType;
    category?: ForumCategory;
}
