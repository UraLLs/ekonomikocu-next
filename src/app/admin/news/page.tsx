import { getDatabaseNews } from "@/services/newsService";
import Link from "next/link";
import { Eye, ExternalLink, Calendar } from "lucide-react";
import RSSFetcher from "../blog/_components/RSSFetcher";
import PublishButton from "./_components/PublishButton"; // Reusing the component, can move it later

export default async function NewsListPage() {
    const news = await getDatabaseNews(true); // isAdmin=true

    return (
        <main className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white mb-2">Haber Yönetimi</h1>
                    <p className="text-text-muted">Otomatik çekilen haberler ve yönetim</p>
                </div>
                <div className="flex items-center gap-3">
                    <RSSFetcher />
                </div>
            </div>

            {/* List */}
            <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-xs uppercase text-text-muted font-bold">
                        <tr>
                            <th className="p-4">Başlık</th>
                            <th className="p-4">Kaynak</th>
                            <th className="p-4">Durum</th>
                            <th className="p-4 text-right">Tarih</th>
                            <th className="p-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {news.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-text-muted">
                                    Henüz haber yok. RSS ile çekmeyi deneyin.
                                </td>
                            </tr>
                        ) : (
                            news.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="font-bold text-white mb-1 line-clamp-1">{item.title}</div>
                                        <div className="text-xs text-text-muted line-clamp-1">{item.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-text-secondary">{item.source}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.status === 'published'
                                            ? 'bg-accent-green/10 text-accent-green'
                                            : 'bg-accent-orange/10 text-accent-orange'
                                            }`}>
                                            {item.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono text-xs text-text-muted">
                                        <div className="flex items-center justify-end gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.published_at).toLocaleDateString('tr-TR')}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.status === 'draft' && (
                                                <PublishButton id={item.id} />
                                            )}
                                            {item.url && (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                                                    title="Kaynağa Git"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
