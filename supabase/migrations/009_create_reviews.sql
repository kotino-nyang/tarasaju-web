-- Create reviews table for customer product reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to order (reviews are tied to completed orders)
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for deleted users

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,

  -- Admin management
  is_approved BOOLEAN DEFAULT false,
  admin_reply TEXT,
  admin_replied_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON public.reviews(is_approved) WHERE is_approved = true;

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for own completed orders" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own unapproved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

-- RLS Policy: Users can view approved reviews
CREATE POLICY "Users can view approved reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated, anon
  USING (is_approved = true);

-- RLS Policy: Users can view their own reviews (even if not approved)
CREATE POLICY "Users can view own reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create reviews for their completed orders (one review per order)
CREATE POLICY "Users can create reviews for own completed orders"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_id
      AND orders.user_id = auth.uid()
      AND orders.order_status = 'completed'
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.reviews
      WHERE reviews.order_id = reviews.order_id
    )
  );

-- RLS Policy: Users can update their own unapproved reviews
CREATE POLICY "Users can update own unapproved reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false)
  WITH CHECK (auth.uid() = user_id AND is_approved = false);

-- RLS Policy: Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com');

-- RLS Policy: Admins can update all reviews
CREATE POLICY "Admins can update all reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com');

-- RLS Policy: Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com');

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS reviews_updated_at ON public.reviews;
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
