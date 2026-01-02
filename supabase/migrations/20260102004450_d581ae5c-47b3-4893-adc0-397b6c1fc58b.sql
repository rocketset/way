-- Remove the check constraint that restricts object_position values
ALTER TABLE public.gallery_photos DROP CONSTRAINT IF EXISTS gallery_photos_object_position_check;