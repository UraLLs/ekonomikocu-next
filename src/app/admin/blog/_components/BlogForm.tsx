'use client';

import { useState, useTransition } from 'react';
import ReactMarkdown from 'react-markdown';
import { Post } from '@/services/blogService';
import { createPost, updatePost } from '@/actions/blog';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Eye, FileEdit } from 'lucide-react';
import Link from 'next/link';

interface BlogFormProps {
    post?: Post;
}

export default function BlogForm({ post }: BlogFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form States
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url || '');
    const [published, setPublished] = useState(post?.published || false);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!post) { // Only auto-generate slug for new posts
            const newSlug = newTitle
                .toLowerCase()
                .replace(/[^a-z0-9ğüşıöç\s]/g, '')
                .replace(/\s+/g, '-');
            setSlug(newSlug);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                const postData = {
                    title,
                    slug,
                    content,
                    excerpt,
                    thumbnail_url: thumbnailUrl,
                    published,
                };

                if (post) {
                    await updatePost(post.id, postData);
                    alert('Yazı güncellendi!');
                } else {
                    await createPost(postData);
                    alert('Yazı oluşturuldu!');
                    router.push('/admin/blog');
                }
                router.refresh();
            } catch (error) {
                console.error(error);
                alert('Bir hata oluştu.');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-7xl mx-auto">
            {/* Header / Actions */}
            <div className="flex items-center justify-between mb-8 sticky top-4 z-50 bg-[#0a0a0f]/90 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {post ? 'Yazıyı Düzenle' : 'Yeni Yazı Oluştur'}
                        </h1>
                        <p className="text-xs text-text-muted">
                            {published ? 'Yayında' : 'Taslak Modunda'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 mr-4">
                        <button
                            type="button"
                            onClick={() => setPublished(false)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${!published
                                ? 'bg-accent-orange text-white shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                        >
                            Taslak
                        </button>
                        <button
                            type="button"
                            onClick={() => setPublished(true)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${published
                                ? 'bg-accent-green text-white shadow-lg'
                                : 'text-text-muted hover:text-white'
                                }`}
                        >
                            Yayınla
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                    >
                        {isPending ? (
                            <span className="animate-spin">⌛</span>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {post ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Main Editor (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Title & Slug */}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Yazı Başlığı..."
                                value={title}
                                onChange={handleTitleChange}
                                className="w-full bg-transparent text-4xl font-black text-white placeholder-white/20 border-none focus:ring-0 px-0"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted font-mono">
                            <span>/blog/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="bg-transparent border-b border-white/10 focus:border-brand-primary focus:outline-none text-text-primary w-full max-w-md"
                            />
                        </div>
                    </div>

                    {/* Editor / Preview Tabs */}
                    <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                        <div className="flex items-center border-b border-white/5 bg-white/[0.02]">
                            <button
                                type="button"
                                onClick={() => setActiveTab('edit')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-r border-white/5 transition-colors ${activeTab === 'edit'
                                    ? 'bg-white/5 text-white'
                                    : 'text-text-muted hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                <FileEdit className="w-4 h-4" /> Editör
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-r border-white/5 transition-colors ${activeTab === 'preview'
                                    ? 'bg-white/5 text-white'
                                    : 'text-text-muted hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                <Eye className="w-4 h-4" /> Önizleme
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            {activeTab === 'edit' ? (
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Markdown formatında içeriğinizi buraya yazın..."
                                    className="w-full h-full min-h-[500px] bg-transparent p-6 text-text-primary focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                />
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none p-8 overflow-y-auto h-full min-h-[500px]">
                                    <ReactMarkdown>{content || '*Önizleme yapılacak içerik yok...*'}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Settings (1/3) */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Thumbnail */}
                    <div className="bg-bg-surface border border-white/5 rounded-2xl p-5">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-brand-primary" />
                            Kapak Görseli
                        </h3>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Görsel URL (https://...)"
                                value={thumbnailUrl}
                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors"
                            />

                            {thumbnailUrl && (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={thumbnailUrl}
                                        alt="Thumbnail Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-bg-surface border border-white/5 rounded-2xl p-5">
                        <h3 className="font-bold text-white mb-4">Kısa Özet (Excerpt)</h3>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Yazının kısa bir özeti..."
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary focus:outline-none transition-colors resize-none"
                        />
                        <p className="text-[10px] text-text-muted mt-2 text-right">
                            {excerpt.length}/160 karakter
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-5">
                        <h4 className="font-bold text-brand-primary text-sm mb-2">Markdown İpuçları</h4>
                        <ul className="text-xs text-text-secondary space-y-1 list-disc pl-4">
                            <li># Başlık 1, ## Başlık 2</li>
                            <li>**Kalın**, *İtalik*</li>
                            <li>- Liste öğesi</li>
                            <li>[Link Metni](url)</li>
                            <li>![Resim Açıklaması](resim-url)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </form>
    );
}
