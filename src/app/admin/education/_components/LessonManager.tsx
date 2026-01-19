'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Plus, Trash2, Video, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LessonManager({ courseId, lessons }: { courseId: string, lessons: any[] }) {
    const supabase = createClient();
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [newLesson, setNewLesson] = useState({ title: '', video_url: '', duration: '' });

    const handleAddLesson = async (e: any) => {
        e.preventDefault();
        const { error } = await supabase.from('lessons').insert([{
            course_id: courseId,
            ...newLesson,
            order: lessons.length + 1
        }]);

        if (error) {
            alert('Hata: ' + error.message);
        } else {
            setNewLesson({ title: '', video_url: '', duration: '' });
            setAdding(false);
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Dersi silmek istiyor musunuz?')) return;
        await supabase.from('lessons').delete().eq('id', id);
        router.refresh();
    };

    return (
        <div className="bg-bg-surface p-8 rounded-2xl border border-white/5 mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Ders İçerikleri</h2>
                <button
                    onClick={() => setAdding(!adding)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10"
                >
                    <Plus className="w-4 h-4" />
                    Ders Ekle
                </button>
            </div>

            {adding && (
                <form onSubmit={handleAddLesson} className="mb-8 p-6 bg-bg-elevated rounded-xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-white font-bold text-sm">Yeni Ders</h3>
                    <div className="space-y-2">
                        <label className="text-xs text-text-secondary">Ders Başlığı</label>
                        <input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Video URL (Embed)</label>
                            <input value={newLesson.video_url} onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })} placeholder="https://www.youtube.com/embed/..." className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Süre (Dk)</label>
                            <input value={newLesson.duration} onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })} placeholder="15:00" className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setAdding(false)} className="px-4 py-2 text-xs text-secondary hover:text-white">İptal</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg">Ekle</button>
                    </div>
                </form>
            )}

            <div className="space-y-2">
                {lessons && lessons.length > 0 ? (
                    lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center gap-4 p-4 bg-bg-primary rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                            <div className="text-text-muted hover:text-white cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white text-sm">{lesson.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                                    <Video className="w-3 h-3" />
                                    {lesson.duration || 'Belirsiz'}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(lesson.id)}
                                className="p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-text-muted text-sm">
                        Henüz ders eklenmemiş.
                    </div>
                )}
            </div>
        </div>
    );
}
