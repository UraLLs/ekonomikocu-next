import { getSystemConfig, updateSystemConfig } from "@/actions/admin";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export default async function BroadcastPage() {
    const isLive = await getSystemConfig('is_live');
    const youtubeId = await getSystemConfig('live_youtube_id');

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-accent-red/10 rounded-xl text-accent-red">
                    <VideoCameraIcon className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black">Canlı Yayın Yönetimi</h1>
                    <p className="text-text-secondary">Yayını başlat, durdur veya kaynağı değiştir.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6">
                    <h2 className="font-bold text-xl mb-6">Yayın Ayarları</h2>

                    <form action={async (formData) => {
                        "use server";
                        const id = formData.get("youtubeId") as string;
                        const active = formData.get("isLive") === "on" ? "true" : "false";

                        await updateSystemConfig('live_youtube_id', id);
                        await updateSystemConfig('is_live', active);
                    }} className="space-y-6">

                        <div>
                            <label className="block text-sm font-bold mb-2">Yayın Durumu</label>
                            <label className="flex items-center cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    name="isLive"
                                    defaultChecked={isLive === 'true'}
                                    className="peer sr-only"
                                />
                                <div className="w-14 h-8 bg-bg-elevated peer-checked:bg-accent-red rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all relative transition-colors"></div>
                                <span className="font-medium text-text-primary peer-checked:text-accent-red">
                                    {isLive === 'true' ? 'YAYINDA (ON AIR)' : 'Yayın Kapalı'}
                                </span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">YouTube Video ID</label>
                            <div className="flex gap-2">
                                <span className="p-3 bg-bg-elevated border border-border-subtle rounded-l-xl text-text-muted select-none">
                                    youtube.com/watch?v=
                                </span>
                                <input
                                    name="youtubeId"
                                    defaultValue={youtubeId || ''}
                                    placeholder="dQw4w9WgXcQ"
                                    className="flex-1 bg-bg-secondary border border-border-default rounded-r-xl px-4 py-3 text-text-primary outline-none focus:border-accent-blue"
                                />
                            </div>
                            <p className="text-xs text-text-muted mt-2">Sadece URL'nin sonundaki ID kısmını girin.</p>
                        </div>

                        <div className="pt-4 border-t border-border-subtle">
                            <button
                                type="submit"
                                className="w-full bg-text-primary text-bg-primary hover:bg-slate-200 font-bold py-3 rounded-xl transition-colors"
                            >
                                Ayarları Kaydet & Güncelle
                            </button>
                        </div>

                    </form>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                    <h2 className="font-bold text-xl">Önizleme</h2>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border-subtle relative group">
                        {youtubeId ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-muted">
                                Video ID girilmedi.
                            </div>
                        )}

                        {/* Overlay to prevent interaction if needed, or status badge */}
                        <div className="absolute top-4 left-4">
                            {isLive === 'true' ? (
                                <span className="bg-accent-red text-white px-3 py-1 rounded text-xs font-bold animate-pulse shadow-lg shadow-accent-red/20">
                                    ● CANLI
                                </span>
                            ) : (
                                <span className="bg-bg-elevated/80 backdrop-blur text-text-muted px-3 py-1 rounded text-xs font-bold">
                                    KAPALI
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
