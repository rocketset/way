-- Add display settings columns to gallery_photos
ALTER TABLE public.gallery_photos
ADD COLUMN object_fit TEXT DEFAULT 'cover',
ADD COLUMN object_position TEXT DEFAULT 'center',
ADD COLUMN row_span INTEGER DEFAULT 1;

-- Add check constraint for valid values
ALTER TABLE public.gallery_photos
ADD CONSTRAINT gallery_photos_object_fit_check CHECK (object_fit IN ('cover', 'contain', 'fill')),
ADD CONSTRAINT gallery_photos_object_position_check CHECK (object_position IN ('top', 'center', 'bottom')),
ADD CONSTRAINT gallery_photos_row_span_check CHECK (row_span >= 1 AND row_span <= 3);