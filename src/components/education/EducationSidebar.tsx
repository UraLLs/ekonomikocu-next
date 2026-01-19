import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { GraduationCap, BookOpen, TrendingUp, Clock } from 'lucide-react';

interface Category {
    name: string;
    count: number;
    icon: string;
}

export default async function EducationSidebar() {
    const supabase = await createClient();

    // Fetch courses to calculate categories
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title, category, thumbnail_url, lessons(count)')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    // Calculate category counts from courses
    const categoryMap: Record<string, number> = {};
    const categoryIcons: Record<string, string> = {
        'Borsa': '📈',
        'Kripto': '₿',
        'Teknik Analiz': '📊',
        'Temel Analiz': '📑',
        'Yatırım Fonları': '💼',
        'default': '📚'
    };

    courses?.forEach(course => {
        const cat = course.category || 'Diğer';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories: Category[] = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count,
        icon: categoryIcons[name] || categoryIcons.default
    }));

    // Get a few popular/recent courses for the sidebar
    const popularCourses = courses?.slice(0, 3) || [];

    // Total stats
    const totalCourses = courses?.length || 0;
    const totalLessons = courses?.reduce((acc, c) => acc + (c.lessons?.[0]?.count || 0), 0) || 0;

    return (
        <aside className="w-full lg:w-[320px] bg-black/40 backdrop-blur-xl border-l border-white/5 h-full min-h-screen sticky top-0 flex flex-col gap-6 p-6">

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs text-text-muted">Kurslar</span>
                    </div>
                    <div className="text-xl font-black text-white">{totalCourses}</div>
                </div>
                <div className="bg-gradient-to-br from-accent-blue/10 to-transparent border border-accent-blue/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-accent-blue" />
                        <span className="text-xs text-text-muted">Dersler</span>
                    </div>
                    <div className="text-xl font-black text-white">{totalLessons}</div>
                </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-100">Kategoriler</h3>
                    </div>
                    <div className="p-2">
                        <nav className="flex flex-col gap-1">
                            {categories.map((cat, i) => (
                                <Link
                                    href={`/egitim?category=${encodeURIComponent(cat.name)}`}
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl transition-all group hover:bg-white/5 text-gray-400 hover:text-white border border-transparent"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{cat.icon}</span>
                                        <span className="font-medium text-sm">{cat.name}</span>
                                    </div>
                                    <span className="text-[10px] py-0.5 px-2 rounded-full border bg-white/5 border-white/10">
                                        {cat.count}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Popular Courses */}
            {popularCourses.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-bold text-gray-100 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-accent-orange" />
                            Öne Çıkan Eğitimler
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {popularCourses.map((course: any) => (
                            <Link
                                key={course.id}
                                href={`/egitim/${course.id}`}
                                className="p-3 hover:bg-white/5 cursor-pointer flex gap-3 group block"
                            >
                                <div className="w-16 h-10 bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0">
                                    {course.thumbnail_url ? (
                                        <Image
                                            src={course.thumbnail_url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                                        {course.title}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {course.lessons?.[0]?.count || 0} ders
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Call to Action */}
            <div className="rounded-2xl border border-accent-green/20 bg-gradient-to-br from-accent-green/5 to-transparent p-5">
                <h3 className="font-bold text-accent-green mb-2 flex items-center gap-2">
                    🎯 Yatırımda Ustalaş
                </h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    Profesyonel eğitmenlerden borsa ve yatırım stratejilerini öğren.
                </p>
                <Link
                    href="/egitim"
                    className="block w-full py-2.5 bg-accent-green/20 hover:bg-accent-green/30 text-accent-green text-center font-bold rounded-xl text-sm transition-colors"
                >
                    Tüm Eğitimleri Gör
                </Link>
            </div>

        </aside>
    );
}
