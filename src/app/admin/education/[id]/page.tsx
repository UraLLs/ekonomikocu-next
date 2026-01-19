import { createClient } from '@/utils/supabase/server';
import CourseForm from '../_components/CourseForm';
import LessonManager from '../_components/LessonManager';
import Link from 'next/link';
import { ArrowLeft, Eye, ExternalLink } from 'lucide-react';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch course and its lessons
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order', { ascending: true });

    if (!course) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-red/20 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Kurs Bulunamadı</h3>
                    <p className="text-text-muted mb-6">Aranan ID: <code className="bg-white/10 px-2 py-0.5 rounded text-xs">{id}</code></p>
                    <Link
                        href="/admin/education"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Listeye Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 -mx-8 -mt-8 px-8 py-4 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/education"
                            className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.is_published
                                    ? 'bg-accent-green/20 text-accent-green'
                                    : 'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {course.is_published ? 'Yayında' : 'Taslak'}
                                </span>
                                <span className="text-xs text-text-muted">{course.category}</span>
                            </div>
                            <h1 className="text-xl font-black text-white">{course.title}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/egitim/${course.id}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Önizle
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Col: Course Info */}
                    <div className="xl:col-span-5">
                        <CourseForm initialData={course} mode="edit" />
                    </div>

                    {/* Right Col: Lessons */}
                    <div className="xl:col-span-7">
                        <LessonManager courseId={course.id} lessons={lessons || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
