import { Post } from '@/types/post';
import PostCard from './PostCard';

interface PostFeedProps {
    posts: Post[];
    currentUserId?: string | null;
}

export default function PostFeed({ posts, currentUserId }: PostFeedProps) {
    if (posts.length === 0) {
        return (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">💭</div>
                <h3 className="text-lg font-bold text-white mb-1">Henuz paylasim yok</h3>
                <p className="text-gray-500 text-sm">Ilk paylasimi sen yap!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    );
}
