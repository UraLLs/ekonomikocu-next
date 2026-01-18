import CourseForm from '../_components/CourseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCoursePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/education" className="p-2 hover:bg-white/5 rounded-lg text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-black text-white">Yeni Kurs Oluştur</h1>
            </div>
            <CourseForm mode="create" />
        </div>
    );
}
