'use client';

import { createClient } from '@/utils/supabase/client';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteCourseButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleDelete = async () => {
        if (!confirm('Bu kursu ve tüm derslerini silmek istediğinize emin misiniz?')) return;

        setLoading(true);
        const { error } = await supabase.from('courses').delete().eq('id', id);

        if (error) {
            alert('Silme işlemi başarısız: ' + error.message);
        } else {
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2.5 hover:bg-accent-red/20 text-accent-red rounded-lg transition-colors disabled:opacity-50"
            title="Sil"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}
