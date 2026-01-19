-- Revert all news to draft so user can test the "AI Publish" flow
UPDATE public.news SET status = 'draft';
