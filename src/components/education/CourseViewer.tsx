'use client';

import { useState } from 'react';
import { PlayCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

interface Lesson {
    id: string;
    title: string;
    video_url: string;
    duration: string;
    order: number;
}

interface CourseViewerProps {
    course: any;
    lessons: Lesson[];
}

export default function CourseViewer({ course, lessons }: CourseViewerProps) {
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(lessons.length > 0 ? lessons[0] : null);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        let embedUrl = url;
        if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
        else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');

        // Add parameters to remove related videos and clean UI
        return `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}rel=0&modestbranding=1&showinfo=0`;
    };

    return (
        <div className="flex flex-col gap-8">
            {/* VIDEO PLAYER SECTION */}
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-border-subtle relative group">
                {activeLesson?.video_url ? (
                    <iframe
                        src={getEmbedUrl(activeLesson.video_url)}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-surface">
                        {course.thumbnail_url ? (
                            <Image
                                src={course.thumbnail_url}
                                alt={course.title}
                                fill
                                className="object-cover opacity-50"
                            />
                        ) : null}
                        <div className="relative z-10 text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10">
                            <PlayCircleIcon className="w-16 h-16 text-white/80 mx-auto mb-2" />
                            <p className="text-white font-medium">
                                {activeLesson ? 'Bu ders için video bulunamadı.' : 'Ders seçiniz.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* INFO & CURRICULUM SECTION */}
            <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${course.level === 'beginner' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                            course.level === 'intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                'bg-red-500/10 border-red-500/20 text-red-500'
                            }`}>
                            {course.level === 'beginner' ? 'Başlangıç' : course.level === 'intermediate' ? 'Orta' : 'İleri'}
                        </span>
                        <span className="text-accent-blue text-sm font-medium">Finans</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-4 leading-tight">
                        {activeLesson ? activeLesson.title : course.title}
                    </h1>

                    <p className="text-lg text-text-secondary leading-relaxed">
                        {course.description}
                    </p>
                </div>

                {/* Curriculum List */}
                <div className="border-t border-border-subtle pt-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PlayCircleIcon className="w-6 h-6 text-accent-green" />
                        Ders İçeriği
                    </h3>
                    <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 space-y-3">
                        {lessons && lessons.length > 0 ? (
                            lessons.map((lesson, i) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all border ${activeLesson?.id === lesson.id
                                            ? 'bg-accent-green/10 border-accent-green/20'
                                            : 'bg-bg-elevated border-transparent hover:bg-bg-surface-hover'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${activeLesson?.id === lesson.id
                                                ? 'bg-accent-green text-white'
                                                : 'bg-white/5 text-text-muted'
                                            }`}>
                                            {activeLesson?.id === lesson.id ? <PlayCircleIcon className="w-5 h-5" /> : i + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-medium text-sm transition-colors ${activeLesson?.id === lesson.id ? 'text-accent-green' : 'text-text-secondary'
                                                }`}>
                                                {lesson.title}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-muted">{lesson.duration || 'Video'}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-text-muted text-sm">
                                Bu kurs için henüz ders eklenmemiş.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
