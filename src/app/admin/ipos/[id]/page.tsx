import { createClient } from '@/utils/supabase/server';
import IPOForm from '../_components/IPOForm';

export default async function EditIPOPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // params.id'yi await etmenize gerek yok, statik/dinamik route parametresi
    const { data: ipo } = await supabase
        .from('ipos')
        .select('*')
        .eq('id', id)
        .single();

    if (!ipo) {
        return <div>Kayıt bulunamadı.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-brand-primary rounded-full"></div>
                <h1 className="text-3xl font-black text-white">Düzenle: {ipo.company_name}</h1>
            </div>
            <IPOForm initialData={ipo} />
        </div>
    );
}
