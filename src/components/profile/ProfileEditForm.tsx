'use client';

import { useState } from 'react';
import { updateProfile } from '@/actions/profile';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileEditFormProps {
    user: {
        id: string;
        email?: string;
    };
    profile: {
        username?: string;
        full_name?: string;
        avatar_url?: string;
    };
}

export default function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const [username, setUsername] = useState(profile?.username || '');
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

    // For file upload
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRandomAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(7);
        const randomUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        setAvatarUrl(randomUrl); // This will be saved as string
        setPreviewUrl(randomUrl); // Show preview
        setAvatarFile(null); // Clear file if random is chosen
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            let finalAvatarUrl = avatarUrl;

            // 1. Upload Image if a file is selected
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalAvatarUrl = publicUrl;
            }

            // 2. Update Profile Data via Server Action
            const formData = new FormData();
            formData.append('username', username);
            formData.append('full_name', fullName);
            formData.append('avatar_url', finalAvatarUrl);

            const result = await updateProfile(formData);

            if (result.success) {
                setMessage({ text: 'Profiliniz başarıyla güncellendi!', type: 'success' });
                router.refresh();
                setTimeout(() => router.push('/profil'), 1500);
            } else {
                setMessage({ text: result.message, type: 'error' });
            }

        } catch (error: any) {
            console.error('Update Error:', error);
            setMessage({ text: 'Bir hata oluştu: ' + error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 p-6 bg-bg-surface border border-border-subtle rounded-xl">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-bg-elevated shadow-lg bg-bg-secondary">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Avatar"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 text-accent-blue">
                            {username?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                </div>

                <div className="flex gap-3">
                    <label className="px-4 py-2 bg-bg-elevated hover:bg-bg-surface-hover border border-border-subtle rounded-lg text-sm font-medium cursor-pointer transition-colors">
                        Fotoğraf Yükle
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={handleRandomAvatar}
                        className="px-4 py-2 bg-bg-elevated hover:bg-bg-surface-hover border border-border-subtle rounded-lg text-sm font-medium transition-colors"
                    >
                        🎲 Rastgele
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-bg-surface border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
                        placeholder="Kullanıcı adınız"
                        minLength={3}
                        required
                    />
                    <p className="text-xs text-text-muted mt-1">Platformda görünecek benzersiz isminiz.</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Ad Soyad (İsteğe Bağlı)</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-bg-surface border border-border-subtle rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-colors"
                        placeholder="Mehmet Yılmaz"
                    />
                </div>
            </div>

            {/* Message & Submit */}
            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4 border-t border-border-subtle">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 text-text-secondary hover:text-text-primary font-medium transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-accent-green hover:bg-accent-green-hover text-white rounded-lg font-bold shadow-lg hover:shadow-accent-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
        </form>
    );
}
