import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Calendar, Search } from 'lucide-react';
import Image from 'next/image';

export default async function AdminIPOListPage() {
    const supabase = await createClient();

    // Fetch IPOs sorted by created_at desc
    const { data: ipos } = await supabase
        .from('ipos')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Halka Arz Yönetimi</h1>
                    <p className="text-text-secondary">Halka arzları ekleyin, düzenleyin veya silin.</p>
                </div>
                <Link
                    href="/admin/ipos/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Ekle
                </Link>
            </div>

            <div className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden">
                {/* Search / Filter Bar could go here */}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5 text-text-secondary text-sm">
                            <th className="p-4 font-medium">Şirket</th>
                            <th className="p-4 font-medium">Kod</th>
                            <th className="p-4 font-medium">Tarih</th>
                            <th className="p-4 font-medium">Durum</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {ipos && ipos.length > 0 ? (
                            ipos.map((ipo) => (
                                <tr key={ipo.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                                                {ipo.logo_url ? (
                                                    <Image src={ipo.logo_url} alt={ipo.code} width={40} height={40} className="object-contain" />
                                                ) : (
                                                    <span className="text-black font-bold text-xs">{ipo.code.substring(0, 2)}</span>
                                                )}
                                            </div>
                                            <span className="font-bold text-white">{ipo.company_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-text-primary border border-white/10">
                                            {ipo.code}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-text-secondary">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 opacity-50" />
                                            {ipo.date_range}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={ipo.status} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/ipos/${ipo.id}`}
                                                className="p-2 hover:bg-accent-blue/20 text-accent-blue rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton id={ipo.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-text-muted">
                                    Henüz halka arz kaydı bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: 'bg-accent-green/10 text-accent-green border-accent-green/20',
        upcoming: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
        completed: 'bg-white/10 text-text-secondary border-white/10',
    };

    const labels = {
        active: 'Talep Topluyor',
        upcoming: 'Onay Bekliyor',
        completed: 'Tamamlandı',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || styles.completed}`}>
            {labels[status as keyof typeof labels] || status}
        </span>
    );
}

// Separate client component for delete to handle interaction
import DeleteButton from './DeleteButton';
