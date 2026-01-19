-- Delete RSS items from posts table (identified by the source link pattern)
DELETE FROM public.posts 
WHERE content LIKE '%[Kaynak Haberi Oku]%';

-- Publish all draft news in the news table (so they appear on public site)
UPDATE public.news 
SET status = 'published' 
WHERE status = 'draft';
