import { getPostBySlug } from "@/services/blogService";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReactMarkdown from 'react-markdown';
import { Calendar, Eye, User, Share2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Yazı Bulunamadı',
        };
    }

    return {
        title: `${post.title} | Ekonomikoçu Blog`,
        description: post.excerpt || `${post.title} hakkında detaylı bilgi ve analizler.`,
        openGraph: {
            images: post.thumbnail_url ? [post.thumbnail_url] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            {/* Progress Bar (Optional - could be added later) */}

            <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">

                {/* Header Section */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-text-muted mb-6 font-mono">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()} okunma
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author (If available) */}
                    {post.profiles && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <div className="w-10 h-10 rounded-full bg-white/10 relative overflow-hidden">
                                {post.profiles.avatar_url ? (
                                    <Image src={post.profiles.avatar_url} alt={post.profiles.username} fill className="object-cover" />
                                ) : (
                                    <User className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted" />
                                )}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm">{post.profiles.username}</p>
                                <p className="text-xs text-text-muted">Yazar</p>
                            </div>
                        </div>
                    )}
                </header>

                {/* Featured Image */}
                {post.thumbnail_url && (
                    <div className="aspect-video relative rounded-2xl overflow-hidden mb-12 border border-white/5 shadow-2xl">
                        <Image
                            src={post.thumbnail_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-text-secondary prose-a:text-brand-primary prose-strong:text-white prose-code:text-accent-orange prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl">
                    <ReactMarkdown components={{
                        // Custom renderer for images to make them responsive
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        img: ({ node, ...props }) => (
                            <span className="block relative aspect-video my-8 rounded-xl overflow-hidden border border-white/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img {...props} className="w-full h-full object-cover" alt={props.alt || ''} />
                            </span>
                        )
                    }}>
                        {post.content || ''}
                    </ReactMarkdown>
                </div>

                {/* Footer / Share */}
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="text-text-muted hover:text-white transition-colors font-medium flex items-center gap-2"
                    >
                        ← Tüm Yazılar
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                        Paylaş
                    </button>
                </div>

            </article>

            <Footer />
        </main>
    );
}
