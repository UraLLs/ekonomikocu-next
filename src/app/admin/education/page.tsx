import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, GraduationCap, BookOpen, Users, Eye, Search, LayoutGrid, List, Filter } from 'lucide-react';
import Image from 'next/image';
import DeleteCourseButton from './DeleteCourseButton';

export default async function AdminEducationListPage({
    searchParams
}: {
    searchParams: Promise<{ view?: string; search?: string; status?: string }>
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const viewMode = params.view || 'grid';
    const searchQuery = params.search || '';
    const statusFilter = params.status || 'all';

    // Fetch Courses with lesson count
    let query = supabase
        .from('courses')
        .select('*, lessons(count)')
        .order('created_at', { ascending: false });

    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
    }

    if (statusFilter === 'active') {
        query = query.eq('is_published', true);
    } else if (statusFilter === 'draft') {
        query = query.eq('is_published', false);
    }

    const { data: courses } = await query;

    // Calculate stats
    const totalCourses = courses?.length || 0;
    const activeCourses = courses?.filter(c => c.is_published).length || 0;
    const totalLessons = courses?.reduce((acc, c) => acc + (c.lessons[0]?.count || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Eğitim Yönetimi</h1>
                    <p className="text-text-secondary">Kursları ve ders içeriklerini yönetin</p>
                </div>
                <Link
                    href="/admin/education/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kurs
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-brand-primary/20 text-brand-primary">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{totalCourses}</div>
                            <div className="text-sm text-text-secondary">Toplam Kurs</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-accent-green/10 to-transparent border border-accent-green/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-accent-green/20 text-accent-green">
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{activeCourses}</div>
                            <div className="text-sm text-text-secondary">Yayında</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-accent-blue/10 to-transparent border border-accent-blue/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-accent-blue/20 text-accent-blue">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{totalLessons}</div>
                            <div className="text-sm text-text-secondary">Toplam Ders</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <form className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            name="search"
                            defaultValue={searchQuery}
                            placeholder="Kurs ara..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
                        />
                    </form>

                    <div className="flex items-center gap-3">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                            <Link
                                href={`/admin/education?view=${viewMode}&status=all`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-brand-primary text-white' : 'text-text-secondary hover:text-white'}`}
                            >
                                Tümü
                            </Link>
                            <Link
                                href={`/admin/education?view=${viewMode}&status=active`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'active' ? 'bg-accent-green text-white' : 'text-text-secondary hover:text-white'}`}
                            >
                                Yayında
                            </Link>
                            <Link
                                href={`/admin/education?view=${viewMode}&status=draft`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'draft' ? 'bg-yellow-500 text-black' : 'text-text-secondary hover:text-white'}`}
                            >
                                Taslak
                            </Link>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                            <Link
                                href={`/admin/education?view=grid&status=${statusFilter}`}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </Link>
                            <Link
                                href={`/admin/education?view=list&status=${statusFilter}`}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {courses && courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <EmptyState searchQuery={searchQuery} />
                    )}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Kurs</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Kategori</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Seviye</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Dersler</th>
                                <th className="text-left p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Durum</th>
                                <th className="text-right p-4 text-xs font-bold text-text-muted uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {courses && courses.length > 0 ? (
                                courses.map((course) => (
                                    <CourseRow key={course.id} course={course} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-text-muted">
                                        {searchQuery ? `"${searchQuery}" için sonuç bulunamadı` : 'Henüz kurs eklenmemiş'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function CourseCard({ course }: { course: any }) {
    return (
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col">
            {/* Thumbnail */}
            <div className="relative h-40 bg-white/5">
                {course.thumbnail_url ? (
                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                        <GraduationCap className="w-16 h-16" />
                    </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md ${course.is_published
                        ? 'bg-accent-green/80 text-white'
                        : 'bg-yellow-500/80 text-black'
                        }`}>
                        {course.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {course.level === 'beginner' ? 'Başlangıç' : course.level === 'intermediate' ? 'Orta' : 'İleri'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-brand-primary font-bold mb-2">{course.category}</div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">{course.description}</p>

                <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons[0]?.count || 0} Ders</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{course.instructor}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <Link
                        href={`/admin/education/${course.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-primary/20 hover:bg-brand-primary/30 rounded-xl text-sm font-bold text-brand-primary transition-colors"
                    >
                        Düzenle
                    </Link>
                    <Link
                        href={`/egitim/${course.id}`}
                        target="_blank"
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <DeleteCourseButton id={course.id} />
                </div>
            </div>
        </div>
    );
}

function CourseRow({ course }: { course: any }) {
    return (
        <tr className="hover:bg-white/[0.02] transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-10 rounded-lg bg-white/5 overflow-hidden relative flex-shrink-0">
                        {course.thumbnail_url ? (
                            <Image src={course.thumbnail_url} alt="" fill className="object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-white">{course.title}</div>
                        <div className="text-xs text-text-muted">{course.instructor}</div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className="text-sm text-text-secondary">{course.category}</span>
            </td>
            <td className="p-4">
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-text-secondary">
                    {course.level === 'beginner' ? 'Başlangıç' : course.level === 'intermediate' ? 'Orta' : 'İleri'}
                </span>
            </td>
            <td className="p-4">
                <span className="text-sm text-white font-medium">{course.lessons[0]?.count || 0}</span>
            </td>
            <td className="p-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${course.is_published
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                    {course.is_published ? 'Yayında' : 'Taslak'}
                </span>
            </td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/admin/education/${course.id}`}
                        className="px-3 py-1.5 bg-brand-primary/20 hover:bg-brand-primary/30 rounded-lg text-xs font-bold text-brand-primary transition-colors"
                    >
                        Düzenle
                    </Link>
                    <Link
                        href={`/egitim/${course.id}`}
                        target="_blank"
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <DeleteCourseButton id={course.id} />
                </div>
            </td>
        </tr>
    );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <div className="col-span-full text-center py-16 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl border border-white/5">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg font-bold text-white mb-2">
                {searchQuery ? 'Sonuç Bulunamadı' : 'Henüz Kurs Yok'}
            </h3>
            <p className="text-text-muted text-sm mb-6">
                {searchQuery
                    ? `"${searchQuery}" için eşleşen kurs bulunamadı`
                    : 'İlk kursunuzu ekleyerek başlayın'
                }
            </p>
            {!searchQuery && (
                <Link
                    href="/admin/education/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Yeni Kurs Ekle
                </Link>
            )}
        </div>
    );
}
