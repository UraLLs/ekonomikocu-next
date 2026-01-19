'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markLessonComplete(lessonId: string, courseId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Giriş yapmanız gerekiyor' };
    }

    const { error } = await supabase
        .from('lesson_progress')
        .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            course_id: courseId,
            completed_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,lesson_id'
        });

    if (error) {
        console.error('Error marking lesson complete:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/egitim/${courseId}`);
    return { success: true };
}

export async function markLessonIncomplete(lessonId: string, courseId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Giriş yapmanız gerekiyor' };
    }

    const { error } = await supabase
        .from('lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);

    if (error) {
        console.error('Error unmarking lesson:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/egitim/${courseId}`);
    return { success: true };
}

export async function getCourseProgress(courseId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { completedLessons: [], progress: 0 };
    }

    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

    const completedLessons = progress?.map(p => p.lesson_id) || [];

    return { completedLessons };
}
