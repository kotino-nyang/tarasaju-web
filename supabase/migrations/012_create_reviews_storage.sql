-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public)
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload review images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view review images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own review images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete any review images" ON storage.objects;

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'reviews');

-- Allow everyone to view review images (public bucket)
CREATE POLICY "Anyone can view review images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'reviews');

-- Allow users to delete their own review images
CREATE POLICY "Users can delete own review images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'reviews' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to delete any review images
CREATE POLICY "Admins can delete any review images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'reviews'
  AND auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
);
