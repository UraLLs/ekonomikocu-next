-- Create lesson_progress table for tracking user progress
create table if not exists public.lesson_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    lesson_id uuid not null references public.lessons(id) on delete cascade,
    course_id uuid not null references public.courses(id) on delete cascade,
    completed_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    
    -- Each user can only complete a lesson once
    unique(user_id, lesson_id)
);

-- Enable RLS
alter table public.lesson_progress enable row level security;

-- RLS Policies
create policy "Users can view their own progress"
    on public.lesson_progress for select
    using (auth.uid() = user_id);

create policy "Users can insert their own progress"
    on public.lesson_progress for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
    on public.lesson_progress for delete
    using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists idx_lesson_progress_user_course 
    on public.lesson_progress(user_id, course_id);
