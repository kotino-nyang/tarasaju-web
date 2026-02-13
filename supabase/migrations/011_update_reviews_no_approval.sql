-- Add image_url column to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Change is_approved default to true (no approval needed)
ALTER TABLE public.reviews ALTER COLUMN is_approved SET DEFAULT true;

-- Drop old RLS policies
DROP POLICY IF EXISTS "Users can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Create new RLS policy: Everyone can view all reviews (no approval check)
CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Update existing reviews to be approved
UPDATE public.reviews SET is_approved = true WHERE is_approved = false;
