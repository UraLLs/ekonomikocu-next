import Link from "next/link";
import { ClockIcon, UserIcon, StarIcon } from "@heroicons/react/24/outline";
import { Course } from "@/data/education";

export default function CourseCard({ course }: { course: any }) {
    return (
        <Link href={`/egitim/${course.id}`} className="group block bg-bg-surface border border-border-subtle rounded-xl overflow-hidden hover:border-accent-green hover:-translate-y-1 transition-all duration-300">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-bg-elevated">
                {course.thumbnail_url ? (
                    <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                        Resim Yok
                    </div>
                )}

                {/* Level Badge */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-white/10 ${course.level === 'beginner' ? 'bg-emerald-500/80 text-white' :
                    course.level === 'intermediate' ? 'bg-yellow-500/80 text-white' :
                        'bg-red-500/80 text-white'
                    }`}>
                    {course.level === 'beginner' ? 'Başlangıç' : course.level === 'intermediate' ? 'Orta' : 'İleri'}
                </span>

                {/* Duration Badge (Static for now) */}
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {course.lessons?.[0]?.count ? `${course.lessons[0].count} Ders` : 'Eğitim'}
                </span>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-accent-green text-white flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-text-muted mb-2">
                    <span className="text-accent-blue font-medium">{course.category || 'Genel'}</span>
                    <div className="flex items-center gap-1">
                        <StarIcon className="w-3 h-3 text-yellow-500" />
                        <span>4.9</span>
                        <span className="text-text-disabled">(100+)</span>
                    </div>
                </div>

                <h3 className="text-md font-bold text-text-primary leading-tight mb-2 line-clamp-2 group-hover:text-accent-green transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-text-secondary mt-3">
                    <div className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-[9px] font-bold border border-border-subtle">
                        {course.instructor?.charAt(0) || 'E'}
                    </div>
                    <span>{course.instructor || 'Ekonomikoçu'}</span>
                </div>
            </div>
        </Link>
    );
}
