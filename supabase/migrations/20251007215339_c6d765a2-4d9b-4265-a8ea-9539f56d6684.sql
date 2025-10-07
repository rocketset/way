-- Add destaque column to posts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'destaque'
  ) THEN
    ALTER TABLE public.posts ADD COLUMN destaque BOOLEAN DEFAULT false;
  END IF;
END $$;