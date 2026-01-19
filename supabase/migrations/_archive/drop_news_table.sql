-- Drop the news table created for the module
DROP TABLE IF EXISTS public.news CASCADE;

-- Optional: Cleanup posts table if anything from RSS remained (though previous cleanup might have handled it)
-- DELETE FROM public.posts WHERE ... -- Skipping as we assume revert handles code mostly.
