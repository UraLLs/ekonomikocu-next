import { notFound } from "next/navigation";
import Link from "next/link";
import { COURSES } from "@/data/education";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { ClockIcon, UserIcon, ArrowLeftIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/server";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = COURSES.find(c => c.slug === slug);

    if (!course) {
        notFound();
    }

    // Fetch Sidebar Data
    const supabase = await createClient();
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

                        {/* Video Section */}
                        <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 border border-border-subtle relative group">
                            {/* Overlay for aesthetic */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                            <iframe
                                src={`${course.videoUrl}?autoplay=0&rel=0&showinfo=0&modestbranding=1`}
                                title={course.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${course.level === 'Başlangıç' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                            course.level === 'Orta' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                'bg-red-500/10 border-red-500/20 text-red-500'
                                        }`}>
                                        {course.level}
                                    </span>
                                    <span className="text-accent-blue text-sm font-medium">{course.category}</span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4 leading-tight">
                                    {course.title}
                                </h1>

                                <p className="text-lg text-text-secondary leading-relaxed">
                                    {course.description}
                                </p>
                            </div>

                            {/* Instructor & Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-surface border border-border-subtle rounded-2xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-blue to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                        {course.instructor.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-text-primary">{course.instructor}</div>
                                        <div className="text-xs text-text-muted">Finans Uzmanı</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-muted flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4" /> Süre
                                        </span>
                                        <span className="font-medium">{course.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-muted flex items-center gap-2">
                                            <UserIcon className="w-4 h-4" /> Öğrenci
                                        </span>
                                        <span className="font-medium">{course.students.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Curriculum */}
                            <div className="border-t border-border-subtle pt-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <PlayCircleIcon className="w-6 h-6 text-accent-green" />
                                    Ders İçeriği
                                </h3>
                                <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 space-y-3 opacity-75">
                                    {['Giriş ve Temel Kavramlar', `${course.title.split(' ')[0]} Nedir?`, 'İleri Seviye Stratejiler', 'Risk Yönetimi', 'Kapanış'].map((item, i) => (
                                        <div key={i} className="p-3 bg-bg-elevated rounded-lg flex justify-between items-center hover:bg-bg-surface-hover cursor-pointer transition-colors">
                                            <span className="font-medium text-sm text-text-secondary">{i + 1}. {item}</span>
                                            <span className="text-xs text-text-muted">15:00</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <Sidebar comments={feedData} />

                </div>
            </div>

            <Footer />
        </main>
    );
}
