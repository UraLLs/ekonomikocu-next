
import { getEconomyNews } from "@/services/newsService";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default async function NewsSection() {
    const news = await getEconomyNews('general');
    const mainNews = news[0];
    const sideNews = news.slice(1, 3);
    const listNews = news.slice(3, 9);

    const getTimeAgo = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: tr });
        } catch {
            return 'Az önce';
        }
    };

    return (
        <section className="flex flex-col gap-5">
            {/* SECTION HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    Ekonomi Manşetleri
                </h2>
                <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                    Kaynak: NTV Ekonomi
                </span>
            </div>

            {/* HERO NEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
                {/* Main Card */}
                {mainNews && (
                    <a href={`/haber/${mainNews.slug}?url=${encodeURIComponent(mainNews.link)}&title=${encodeURIComponent(mainNews.title)}&date=${encodeURIComponent(mainNews.pubDate)}&image=${encodeURIComponent(mainNews.image || "")}`} className="md:row-span-2 bg-bg-surface border border-border-subtle rounded-xl overflow-hidden cursor-pointer hover:border-border-default hover:-translate-y-0.5 hover:shadow-lg transition-all group block">
                        <div className="w-full aspect-video md:aspect-[16/10] relative overflow-hidden">
                            <img src={mainNews.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop"} alt={mainNews.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-accent-red-soft text-accent-red mb-2.5">
                                🔴 Son Dakika
                            </span>
                            <h3 className="text-[22px] font-semibold text-text-primary leading-tight mb-2 group-hover:text-accent-green transition-colors">
                                {mainNews.title}
                            </h3>
                            <p className="text-[13px] text-text-secondary leading-normal line-clamp-2 mb-3">
                                {mainNews.contentSnippet}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                                <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> {getTimeAgo(mainNews.pubDate)}</span>
                            </div>
                        </div>
                    </a>
                )}

                {/* Side Cards */}
                {sideNews.map((item, i) => (
                    <a key={i} href={`/haber/${item.slug}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}&date=${encodeURIComponent(item.pubDate)}&image=${encodeURIComponent(item.image || "")}`} className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden cursor-pointer hover:border-border-default hover:-translate-y-0.5 hover:shadow-md transition-all group flex flex-col sm:flex-row md:flex-col block">
                        <div className="w-full sm:w-1/3 md:w-full aspect-video relative overflow-hidden">
                            <img src={item.image || `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 flex-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-accent-blue-soft text-accent-blue mb-2">
                                Ekonomi
                            </span>
                            <h3 className="text-[15px] font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                                <span>{getTimeAgo(item.pubDate)}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* MORE NEWS HEADER */}
            <div className="flex items-center justify-between mt-2">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                    Diğer Gelişmeler
                </h2>
            </div>

            {/* SMALL NEWS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listNews.map((item, i) => (
                    <a key={i} href={`/haber/${item.slug}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}&date=${encodeURIComponent(item.pubDate)}&image=${encodeURIComponent(item.image || "")}`} className="bg-bg-surface border border-border-subtle rounded-lg p-3.5 flex gap-3 cursor-pointer hover:border-border-default hover:bg-bg-surface-hover transition-all group">
                        <img src={item.image || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=160&h=120&fit=crop"} alt={item.title} className="w-20 h-15 rounded-md object-cover bg-bg-elevated shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5 group-hover:text-accent-green">{item.title}</h4>
                            <div className="text-[11px] text-text-muted">{getTimeAgo(item.pubDate)} • {item.source}</div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
