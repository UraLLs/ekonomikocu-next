import { getPosts } from "@/services/blogService";
import Link from "next/link";
import { Plus, Edit2, Eye, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import DeletePostButton from "./_components/DeletePostButton";

export default async function BlogListPage() {
    const posts = await getPosts(true); // isAdmin=true to fetch all posts

    return (
        <main className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white mb-2">Blog Yönetimi</h1>
                    <p className="text-text-muted">Haber ve makaleleri yönetin</p>
                </div>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg transition-colors font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Yazı Ekle
                </Link>
            </div>

            {/* Stats Cards (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-muted font-medium mb-1">Toplam Yazı</h3>
                        <p className="text-3xl font-black text-white">{posts.length}</p>
                    </div>
                </div>
                <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Eye className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-muted font-medium mb-1">Yayındaki Yazılar</h3>
                        <p className="text-3xl font-black text-accent-green">
                            {posts.filter(p => p.published).length}
                        </p>
                    </div>
                </div>
                <div className="bg-bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-text-muted font-medium mb-1">Taslaklar</h3>
                        <p className="text-3xl font-black text-accent-orange">
                            {posts.filter(p => !p.published).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-text-muted">
                            <tr>
                                <th className="px-6 py-4">Başlık</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Görüntülenme</th>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                        Henüz hiç blog yazısı eklenmemiş.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 relative overflow-hidden flex-shrink-0">
                                                    {post.thumbnail_url ? (
                                                        <Image
                                                            src={post.thumbnail_url}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-text-muted">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors line-clamp-1 max-w-md">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-text-muted font-mono mt-0.5">
                                                        /{post.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${post.published
                                                ? 'bg-accent-green/10 text-accent-green'
                                                : 'bg-accent-orange/10 text-accent-orange'
                                                }`}>
                                                {post.published ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                                            {post.views.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-secondary">
                                            {new Date(post.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/blog/${post.id}`}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <DeletePostButton postId={post.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
