export interface ChatRoom {
    id: string;
    name: string;
    description: string | null;
    is_private: boolean;
    created_by: string | null;
    min_level: number;
    created_at?: string;
}

export interface Message {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    room_id: string;
    isOptimistic?: boolean;
    user?: {
        email?: string;
    };
}
