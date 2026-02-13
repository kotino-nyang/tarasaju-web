-- Create qna table for Q&A (supports both members and non-members)
CREATE TABLE IF NOT EXISTS public.qna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Author info (supports both members and non-members)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for non-members
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(200) NOT NULL, -- For non-member notifications

  -- Password for non-members (hashed using SHA-256)
  password_hash TEXT NOT NULL, -- SHA-256 hash

  -- Q&A content
  question TEXT NOT NULL,
  answer TEXT,
  is_answered BOOLEAN DEFAULT false,

  -- Product context (optional - link to product/order)
  product_name VARCHAR(200),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Visibility
  is_public BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,

  -- Timestamps
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_qna_user_id ON public.qna(user_id);
CREATE INDEX IF NOT EXISTS idx_qna_created_at ON public.qna(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qna_is_answered ON public.qna(is_answered);
CREATE INDEX IF NOT EXISTS idx_qna_is_deleted ON public.qna(is_deleted) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_qna_author_email ON public.qna(author_email);

-- Enable Row Level Security
ALTER TABLE public.qna ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view public answered qna" ON public.qna;
DROP POLICY IF EXISTS "Anyone can view all qna" ON public.qna;
DROP POLICY IF EXISTS "Users can view own qna" ON public.qna;
DROP POLICY IF EXISTS "Anyone can create qna" ON public.qna;
DROP POLICY IF EXISTS "Admins can view all qna" ON public.qna;
DROP POLICY IF EXISTS "Admins can update all qna" ON public.qna;

-- RLS Policy: Everyone can view all non-deleted Q&A (private Q&A will show lock icon in UI)
CREATE POLICY "Anyone can view all qna"
  ON public.qna
  FOR SELECT
  TO authenticated, anon
  USING (is_deleted = false);

-- RLS Policy: Anyone can insert Q&A (member or non-member)
CREATE POLICY "Anyone can create qna"
  ON public.qna
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- RLS Policy: Admins can view all qna
CREATE POLICY "Admins can view all qna"
  ON public.qna
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com');

-- RLS Policy: Admins can update all qna
CREATE POLICY "Admins can update all qna"
  ON public.qna
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'binzzz010101@gmail.com');

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS qna_updated_at ON public.qna;
CREATE TRIGGER qna_updated_at
  BEFORE UPDATE ON public.qna
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
