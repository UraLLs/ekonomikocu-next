'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface IPOFormProps {
    initialData?: any;
}

export default function IPOForm({ initialData }: IPOFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        company_name: initialData?.company_name || '',
        code: initialData?.code || '',
        price: initialData?.price || '',
        date_range: initialData?.date_range || '',
        status: initialData?.status || 'upcoming',
        lot_count: initialData?.lot_count || '',
        logo_url: initialData?.logo_url || '',
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        // Quick simplified upload logic
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ipos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('content')
            .upload(filePath, file);

        if (uploadError) {
            alert('Resim yükleme hatası: ' + uploadError.message);
        } else {
            const { data } = supabase.storage.from('content').getPublicUrl(filePath);
            setFormData({ ...formData, logo_url: data.publicUrl });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...formData };

        let error;
        if (initialData?.id) {
            // Update
            const { error: updateError } = await supabase
                .from('ipos')
                .update(payload)
                .eq('id', initialData.id);
            error = updateError;
        } else {
            // Create
            const { error: insertError } = await supabase.from('ipos').insert([payload]);
            error = insertError;
        }

        if (error) {
            alert('İşlem başarısız: ' + error.message);
        } else {
            router.push('/admin/ipos');
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-bg-surface p-8 rounded-2xl border border-white/5">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Şirket Adı</label>
                    <input name="company_name" value={formData.company_name} onChange={handleChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Borsa Kodu</label>
                    <input name="code" value={formData.code} onChange={handleChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none font-mono uppercase" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Fiyat</label>
                    <input name="price" value={formData.price} onChange={handleChange} placeholder="55,00 TL" required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Tarih Aralığı</label>
                    <input name="date_range" value={formData.date_range} onChange={handleChange} placeholder="18-19 Ocak" required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Durum</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none">
                        <option value="upcoming">Onay Bekliyor (Turuncu)</option>
                        <option value="active">Talep Topluyor (Yeşil)</option>
                        <option value="completed">Tamamlandı (Gri)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Lot Sayısı</label>
                    <input name="lot_count" value={formData.lot_count} onChange={handleChange} placeholder="50-60 Lot" required className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-text-secondary">Logo</label>
                <div className="flex items-start gap-4">
                    {formData.logo_url && (
                        <div className="relative w-24 h-24 bg-white rounded-xl border border-white/10 p-2 flex-shrink-0">
                            <Image src={formData.logo_url} alt="Preview" fill className="object-contain" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, logo_url: '' })}
                                className="absolute -top-2 -right-2 bg-accent-red text-white p-1 rounded-full shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                        <div className="w-full h-24 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:bg-white/5 transition-all group">
                            <Upload className="w-6 h-6 text-text-muted group-hover:text-brand-primary" />
                            <span className="text-sm text-text-secondary">Resim Yükle</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50"
                >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
        </form>
    );
}
