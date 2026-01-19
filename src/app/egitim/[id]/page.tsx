import { notFound } from "next/navigation";
import Link from "next/link";
import { COURSES } from "@/data/education";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EducationSidebar from '@/components/education/EducationSidebar';
import CourseViewer from '@/components/education/CourseViewer';
import { ClockIcon, UserIcon, ArrowLeftIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/server";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createClient();

    // Fetch Course & Lessons
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
        notFound();
    }

    // Fetch Sidebar Data (Comments)
    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

    let feedData: any[] = [];
    if (comments && comments.length > 0) {
        const userIds = Array.from(new Set(comments.map(c => c.user_id)));
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', userIds);

        const profileMap = (profiles || []).reduce<Record<string, any>>((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
        }, {});

        feedData = comments.map(c => ({
            ...c,
            profiles: profileMap[c.user_id]
        }));
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
                <div className="flex flex-col xl:flex-row gap-8">

                    {/* LEFT CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Back Link */}
                        <Link href="/egitim" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-green mb-6 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>Akademi'ye Dön</span>
                        </Link>

                        <CourseViewer course={course} lessons={lessons || []} />

                        {/* Instructor & Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-surface border border-border-subtle rounded-2xl p-6 mt-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-blue to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                    {course.instructor?.charAt(0) || 'E'}
                                </div>
                                <div>
                                    <div className="font-bold text-text-primary">{course.instructor || 'Ekonomikoçu'}</div>
                                    <div className="text-xs text-text-muted">Finans Uzmanı</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" /> Ders Sayısı
                                    </span>
                                    <span className="font-medium">{lessons?.length || 0} Video</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" /> Katılım
                                    </span>
                                    <span className="font-medium">100+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <EducationSidebar />
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
