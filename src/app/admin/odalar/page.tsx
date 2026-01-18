import { createClient } from "@/utils/supabase/server";
import { createChatRoomAdmin, deleteChatRoom } from "@/actions/admin";
import { ChatBubbleLeftRightIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default async function AdminRoomsPage() {
    const supabase = await createClient();
    const { data: rooms } = await supabase
        .from('chat_rooms')
        .select(`
            *,
            profiles:created_by (username)
        `)
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
                        <ChatBubbleLeftRightIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">Sohbet Odaları</h1>
                        <p className="text-text-secondary">Odaları yönet, yenisini ekle veya sil.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create New Room Form */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 h-fit">
                    <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <PlusIcon className="w-5 h-5 text-accent-green" />
                        Yeni Resmi Oda
                    </h2>
                    <form action={async (formData) => {
                        "use server";
                        const name = formData.get("name") as string;
                        const desc = formData.get("desc") as string;
                        const level = parseInt(formData.get("level") as string);
                        await createChatRoomAdmin(name, desc, level);
                    }} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Oda İsmi</label>
                            <input name="name" required className="w-full bg-bg-secondary border border-border-default rounded-lg px-3 py-2 outline-none focus:border-accent-blue" placeholder="Örn: Halka Arzlar" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Açıklama</label>
                            <input name="desc" required className="w-full bg-bg-secondary border border-border-default rounded-lg px-3 py-2 outline-none focus:border-accent-blue" placeholder="Odanın amacı..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-text-muted mb-1">Min. Seviye</label>
                            <select name="level" className="w-full bg-bg-secondary border border-border-default rounded-lg px-3 py-2 outline-none focus:border-accent-blue">
                                <option value="0">Tüm Üyeler (Lvl 0)</option>
                                <option value="5">Tecrübeli (Lvl 5+)</option>
                                <option value="20">Uzman (Lvl 20+)</option>
                                <option value="50">VIP (Lvl 50+)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-accent-blue text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Oluştur
                        </button>
                    </form>
                </div>

                {/* Room List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-bold text-xl mb-4">Aktif Odalar ({rooms?.length || 0})</h2>
                    <div className="grid gap-4">
                        {rooms?.map((room) => (
                            <div key={room.id} className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center justify-between group hover:border-border-default transition-all">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                                        {room.name}
                                        {room.is_private && <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded uppercase">Özel</span>}
                                        {room.min_level > 0 && <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-0.5 rounded uppercase">LVL {room.min_level}+</span>}
                                    </h3>
                                    <p className="text-text-muted text-sm">{room.description}</p>
                                    <p className="text-xs text-text-muted mt-2">
                                        Oluşturan: <span className="text-text-primary">{room.profiles?.username || 'Sistem'}</span>
                                    </p>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await deleteChatRoom(room.id);
                                }}>
                                    <button className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Odayı Sil">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ))}
                        {rooms?.length === 0 && (
                            <div className="text-center py-10 text-text-muted border border-dashed border-border-subtle rounded-xl">
                                Hiç oda bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
