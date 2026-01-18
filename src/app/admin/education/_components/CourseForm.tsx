'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface CourseFormProps {
    initialData?: any;
    mode?: 'create' | 'edit';
}

export default function CourseForm({ initialData, mode = 'create' }: CourseFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        instructor: initialData?.instructor || 'Borsa Koçu',
        level: initialData?.level || 'beginner',
        category: initialData?.category || 'Borsa',
        is_published: initialData?.is_published || false,
        price: initialData?.price || 'Ücretsiz',
        thumbnail_url: initialData?.thumbnail_url || '',
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `education/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('content')
            .upload(filePath, file);

        if (uploadError) {
            alert('Resim yükleme hatası: ' + uploadError.message);
        } else {
            const { data } = supabase.storage.from('content').getPublicUrl(filePath);
            setFormData({ ...formData, thumbnail_url: data.publicUrl });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            is_published: Boolean(formData.is_published) // Ensure boolean
        };
        console.log('Submitting payload:', payload); // For debugging

        let error;
        let routeId = initialData?.id;

        if (mode === 'edit' && initialData?.id) {
            // Update
            const { error: updateError } = await supabase
                .from('courses')
                .update(payload)
                .eq('id', initialData.id);
            error = updateError;
        } else {
            // Create
            const { data, error: insertError } = await supabase.from('courses').insert([payload]).select().single();
            error = insertError;
            if (data) routeId = data.id;
        }

        if (error) {
            alert('İşlem başarısız: ' + error.message);
            setLoading(false);
        } else {
            if (mode === 'create') {
                // If created, redirect to edit page to add lessons
                router.push(`/admin/education/${routeId}`);
            } else {
                router.refresh();
                alert('Kurs bilgileri güncellendi.');
            }
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-bg-surface p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4">Kurs Bilgileri</h2>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary">Kurs Başlığı</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary">Açıklama</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none">
                        <option value="Borsa">Borsa</option>
                        <option value="Kripto">Kripto</option>
                        <option value="Teknik Analiz">Teknik Analiz</option>
                        <option value="Temel Analiz">Temel Analiz</option>
                        <option value="Yatırım Fonları">Yatırım Fonları</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Eğitmen</label>
                    <input name="instructor" value={formData.instructor} onChange={handleChange} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Seviye</label>
                    <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none">
                        <option value="beginner">Başlangıç</option>
                        <option value="intermediate">Orta Seviye</option>
                        <option value="advanced">İleri Seviye</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Durum</label>
                    <div className="flex items-center justify-between bg-bg-primary border border-white/10 rounded-xl px-4 py-3">
                        <span className={`text-sm font-bold ${formData.is_published ? 'text-accent-green' : 'text-text-muted'}`}>
                            {formData.is_published ? 'YAYINDA (Aktif)' : 'TASLAK (Pasif)'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                            className={`relative cursor-pointer w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-green/50 ${formData.is_published ? 'bg-accent-green' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary">Kapak Resmi</label>
                <div className="flex items-start gap-4">
                    {formData.thumbnail_url && (
                        <div className="relative w-32 h-20 bg-white rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                            <Image src={formData.thumbnail_url} alt="Preview" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                                className="absolute top-1 right-1 bg-accent-red text-white p-1 rounded-full shadow-lg"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                        <div className="w-full h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:bg-white/5 transition-all group">
                            <Upload className="w-5 h-5 text-text-muted group-hover:text-brand-primary" />
                            <span className="text-xs text-text-secondary">Resim Yükle</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20"
                >
                    {loading ? 'İşleniyor...' : (mode === 'create' ? 'Oluştur ve Ders Ekle' : 'Güncelle')}
                </button>
            </div>
        </form>
    );
}
