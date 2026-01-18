import { createClient } from '@/utils/supabase/server';
import CourseForm from '../_components/CourseForm';
import LessonManager from '../_components/LessonManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
            <div className="p-8 text-center text-text-muted">
                <h3 className="text-xl font-bold text-white mb-2">Kayıt Bulunamadı</h3>
                <p>Aranan ID: <code className="bg-white/10 p-1 rounded">{id}</code></p>
                <p className="text-xs mt-4">Lütfen URL'yi kontrol edin veya listeye geri dönün.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 p-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/education" className="p-2 hover:bg-white/5 rounded-lg text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex-1">
                    <div className="bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded text-xs font-bold inline-block mb-1">
                        DÜZENLE
                    </div>
                    <h1 className="text-3xl font-black text-white">{course.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Col: Course Info */}
                <div className="xl:col-span-4">
                    <CourseForm initialData={course} mode="edit" />
                </div>

                {/* Right Col: Lessons */}
                <div className="xl:col-span-8">
                    <LessonManager courseId={course.id} lessons={lessons || []} />
                </div>
            </div>
        </div>
    );
}
