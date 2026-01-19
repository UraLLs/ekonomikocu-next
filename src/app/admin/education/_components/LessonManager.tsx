'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Plus, Trash2, Video, GripVertical, Pencil, X, Check, ExternalLink, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Lesson {
    id: string;
    title: string;
    video_url: string;
    duration: string;
    order: number;
}

export default function LessonManager({ courseId, lessons }: { courseId: string, lessons: Lesson[] }) {
    const supabase = createClient();
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newLesson, setNewLesson] = useState({ title: '', video_url: '', duration: '' });
    const [editLesson, setEditLesson] = useState({ title: '', video_url: '', duration: '' });
    const [saving, setSaving] = useState(false);

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
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
        setSaving(false);
    };

    const handleStartEdit = (lesson: Lesson) => {
        setEditingId(lesson.id);
        setEditLesson({
            title: lesson.title,
            video_url: lesson.video_url || '',
            duration: lesson.duration || ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        setSaving(true);

        const { error } = await supabase
            .from('lessons')
            .update(editLesson)
            .eq('id', editingId);

        if (error) {
            alert('Hata: ' + error.message);
        } else {
            setEditingId(null);
            router.refresh();
        }
        setSaving(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditLesson({ title: '', video_url: '', duration: '' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Dersi silmek istiyor musunuz?')) return;
        await supabase.from('lessons').delete().eq('id', id);
        router.refresh();
    };

    // Extract YouTube video ID for preview
    const getYouTubeId = (url: string) => {
        const match = url?.match(/(?:embed\/|watch\?v=|youtu\.be\/)([^&?/]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
                        <Video className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Ders İçerikleri</h2>
                        <p className="text-xs text-text-muted">{lessons.length} ders mevcut</p>
                    </div>
                </div>
                <button
                    onClick={() => setAdding(!adding)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${adding
                        ? 'bg-white/10 text-white'
                        : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20'
                        }`}
                >
                    {adding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {adding ? 'İptal' : 'Ders Ekle'}
                </button>
            </div>

            {/* Add Lesson Form */}
            {adding && (
                <form onSubmit={handleAddLesson} className="p-5 border-b border-white/5 bg-brand-primary/5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-text-secondary mb-2">Ders Başlığı *</label>
                            <input
                                value={newLesson.title}
                                onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                                required
                                placeholder="örn: Teknik Analiz Temelleri"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-2">Video URL (Embed)</label>
                                <input
                                    value={newLesson.video_url}
                                    onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })}
                                    placeholder="https://www.youtube.com/embed/..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-text-secondary mb-2">Süre</label>
                                <input
                                    value={newLesson.duration}
                                    onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                                    placeholder="15:00"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setAdding(false)}
                                className="px-4 py-2 text-sm text-text-secondary hover:text-white transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 transition-all"
                            >
                                {saving ? 'Ekleniyor...' : 'Ders Ekle'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Lessons List */}
            <div className="divide-y divide-white/5">
                {lessons && lessons.length > 0 ? (
                    lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                        <div key={lesson.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                            {editingId === lesson.id ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm flex-shrink-0 mt-1">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                value={editLesson.title}
                                                onChange={e => setEditLesson({ ...editLesson, title: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none"
                                                placeholder="Ders başlığı"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    value={editLesson.video_url}
                                                    onChange={e => setEditLesson({ ...editLesson, video_url: e.target.value })}
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none"
                                                    placeholder="Video URL"
                                                />
                                                <input
                                                    value={editLesson.duration}
                                                    onChange={e => setEditLesson({ ...editLesson, duration: e.target.value })}
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary focus:outline-none"
                                                    placeholder="Süre"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2 pl-11">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-3 py-1.5 text-xs text-text-secondary hover:text-white transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={saving}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green text-white text-xs font-bold rounded-lg hover:bg-accent-green/90 disabled:opacity-50 transition-all"
                                        >
                                            <Check className="w-3 h-3" />
                                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="flex items-center gap-4">
                                    <div className="text-text-muted hover:text-white cursor-grab active:cursor-grabbing transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </div>

                                    {/* Video Preview Thumbnail */}
                                    {lesson.video_url && getYouTubeId(lesson.video_url) && (
                                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${getYouTubeId(lesson.video_url)}/mqdefault.jpg`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <Video className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{lesson.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                                            {lesson.duration && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {lesson.duration}
                                                </span>
                                            )}
                                            {lesson.video_url && (
                                                <a
                                                    href={lesson.video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-brand-primary transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Video
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(lesson)}
                                            className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lesson.id)}
                                            className="p-2 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <Video className="w-12 h-12 mx-auto mb-4 text-white/10" />
                        <h3 className="text-white font-bold mb-2">Henüz Ders Yok</h3>
                        <p className="text-text-muted text-sm mb-4">Bu kursa ders ekleyerek başlayın</p>
                        <button
                            onClick={() => setAdding(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            İlk Dersi Ekle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
