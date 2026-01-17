
export default function Stories() {
    const stories = [
        { id: 1, title: "Borsa Açılış", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=150&h=150&fit=crop", viewed: false },
        { id: 2, title: "Altın Analiz", img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=150&h=150&fit=crop", viewed: false },
        { id: 3, title: "Kripto Özet", img: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&h=150&fit=crop", viewed: true },
        { id: 4, title: "Dolar/TL", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&h=150&fit=crop", viewed: false },
        { id: 5, title: "Fed Kararı", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&h=150&fit=crop", viewed: false },
        { id: 6, title: "Teknoloji", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop", viewed: true },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[72px]">
                    <div className={`p-[3px] rounded-full ${story.viewed ? 'bg-border-subtle' : 'bg-gradient-to-tr from-accent-green to-blue-500'}`}>
                        <div className="p-[2px] bg-bg-primary rounded-full">
                            <img
                                src={story.img}
                                alt={story.title}
                                className="w-14 h-14 rounded-full object-cover border-2 border-bg-primary group-hover:scale-105 transition-transform"
                            />
                        </div>
                    </div>
                    <span className="text-[11px] font-medium text-text-secondary text-center truncate w-full group-hover:text-text-primary transition-colors">
                        {story.title}
                    </span>
                </div>
            ))}

            {/* Add Story Button */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[72px]">
                <div className="w-[66px] h-[66px] rounded-full border-2 border-dashed border-border-default flex items-center justify-center text-text-muted hover:border-accent-green hover:text-accent-green hover:bg-accent-green-soft transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </div>
                <span className="text-[11px] font-medium text-text-secondary">Ekle</span>
            </div>
        </div>
    );
}
