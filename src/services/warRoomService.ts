export interface VoteStats {
    bull: number; // Percentage
    bear: number;
    totalVotes: number;
}

export interface Comment {
    id: string;
    username: string;
    text: string;
    sentiment: 'BULL' | 'BEAR' | 'NEUTRAL';
    timestamp: Date;
}

// Mock Data for initial UI development
let MOCK_STATS: Record<string, VoteStats> = {
    'THYAO': { bull: 65, bear: 35, totalVotes: 1240 },
    'BTCUSDT': { bull: 82, bear: 18, totalVotes: 5430 },
};

let MOCK_COMMENTS: Record<string, Comment[]> = {
    'THYAO': [
        { id: '1', username: 'Ahmet K.', text: 'Bilanço çok iyi gelecek, tavan bekliyorum! 🚀', sentiment: 'BULL', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { id: '2', username: 'BorsaKurdu', text: 'Düzeltme yapmadan girmem, grafikte şişkinlik var.', sentiment: 'BEAR', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
        { id: '3', username: 'Yatırımcı01', text: 'Yabancı takası artıyor.', sentiment: 'BULL', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
    ],
    'BTCUSDT': [
        { id: '1', username: 'CryptoKing', text: '100k coming soon! 🔥', sentiment: 'BULL', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    ]
};

export const warRoomService = {
    getStats: async (symbol: string): Promise<VoteStats> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_STATS[symbol] || { bull: 50, bear: 50, totalVotes: 0 };
    },

    getComments: async (symbol: string): Promise<Comment[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_COMMENTS[symbol] || [];
    },

    castVote: async (symbol: string, type: 'BULL' | 'BEAR'): Promise<VoteStats> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const current = MOCK_STATS[symbol] || { bull: 50, bear: 50, totalVotes: 100 };

        // Simple mock logic to shift stats
        if (type === 'BULL') {
            current.bull = Math.min(99, current.bull + 1);
            current.bear = 100 - current.bull;
        } else {
            current.bear = Math.min(99, current.bear + 1);
            current.bull = 100 - current.bear;
        }
        current.totalVotes++;
        MOCK_STATS[symbol] = current;
        return current;
    },

    postComment: async (symbol: string, text: string, sentiment: 'BULL' | 'BEAR' | 'NEUTRAL', username: string = 'Misafir'): Promise<Comment> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newComment: Comment = {
            id: Math.random().toString(),
            username,
            text,
            sentiment,
            timestamp: new Date()
        };
        if (!MOCK_COMMENTS[symbol]) MOCK_COMMENTS[symbol] = [];
        MOCK_COMMENTS[symbol].unshift(newComment);
        return newComment;
    }
};
