import Link from 'next/link';
import Image from 'next/image';
import { getPosts, Post } from '@/services/blogService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export const metadata = {
    title: 'Blog | Ekonomikoçu',
    description: 'Finans, borsa ve yatırım dünyasından en güncel analizler ve makaleler.',
};

export default async function BlogPage() {
    // Only fetch published posts
    const posts = await getPosts(false);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Finans Blogu
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Piyasa analizleri, yatırım stratejileri ve finansal okuryazarlık eğitimleri.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-bg-surface border border-white/5 rounded-3xl">
                            <span className="text-4xl mb-4 block">📭</span>
                            <h3 className="text-xl font-bold text-white mb-2">Henüz Yazı Yok</h3>
                            <p className="text-text-muted">
                                Blog yazıları çok yakında burada olacak.
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col bg-bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video relative overflow-hidden bg-white/5">
                                    {post.thumbnail_url ? (
                                        <Image
                                            src={post.thumbnail_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-accent-blue/5">
                                            <span className="text-4xl">📝</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-text-muted mb-3 font-mono">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {post.views}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="text-text-secondary text-sm line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 flex items-center text-sm font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
                                        Devamını Oku <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
