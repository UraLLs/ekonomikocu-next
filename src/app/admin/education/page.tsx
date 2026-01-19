import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Pencil, Trash2, GraduationCap, Clock, BookOpen } from 'lucide-react';
import Image from 'next/image';

export default async function AdminEducationListPage() {
    const supabase = await createClient();

    // Fetch Courses with lesson count
    const { data: courses } = await supabase
        .from('courses')
        .select('*, lessons(count)')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Eğitim Yönetimi</h1>
                    <p className="text-text-secondary">Kursları ve ders içeriklerini yönetin.</p>
                </div>
                <Link
                    href="/admin/education/new"
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kurs
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses && courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="bg-bg-surface border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col">
                            {/* Thumbnail */}
                            <div className="relative h-48 bg-white/5">
                                {course.thumbnail_url ? (
                                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                        <GraduationCap className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {!course.is_published && (
                                        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-gray-400 uppercase border border-white/10">
                                            PASİF
                                        </div>
                                    )}
                                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white uppercase border border-white/10">
                                        {course.level}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                                <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">{course.description}</p>

                                <div className="flex items-center gap-4 text-xs text-text-secondary mb-6">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{course.lessons[0]?.count || 0} Ders</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-brand-primary">{course.price}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-auto">
                                    <Link
                                        href={`/admin/education/${course.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold text-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Düzenle & Dersler
                                    </Link>
                                    <DeleteCourseButton id={course.id} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-20 text-text-muted bg-bg-surface rounded-2xl border border-white/5">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        Henüz hiç kurs eklenmemiş.
                    </div>
                )}
            </div>
        </div>
    );
}

// Client Component for Delete
import DeleteCourseButton from './DeleteCourseButton';
