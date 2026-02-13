-- 주문 테이블 생성
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL,

  -- 상품 정보
  product_name VARCHAR(200) NOT NULL,
  option VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,

  -- 주문자 정보
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,

  -- 사주 정보
  gender VARCHAR(10) NOT NULL,
  birth_date DATE NOT NULL,
  birth_time VARCHAR(20) NOT NULL,
  calendar_type VARCHAR(10) NOT NULL,
  is_leap_month BOOLEAN DEFAULT FALSE,

  -- 주문 상태
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'completed', 'cancelled')),

  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- RLS 정책 활성화
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;

-- 사용자는 본인의 주문만 조회 가능
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 사용자는 본인의 주문만 생성 가능
CREATE POLICY "Users can create their own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orders_updated_at();

-- 주문 번호 생성 함수
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  date_prefix TEXT;
  random_suffix TEXT;
BEGIN
  -- 날짜 프리픽스 생성 (YYYYMMDD)
  date_prefix := TO_CHAR(NOW(), 'YYYYMMDD');

  -- 랜덤 6자리 숫자 생성
  random_suffix := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');

  -- 주문 번호 조합
  new_order_number := 'TS' || date_prefix || random_suffix;

  -- 중복 체크 및 재생성
  WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_order_number) LOOP
    random_suffix := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    new_order_number := 'TS' || date_prefix || random_suffix;
  END LOOP;

  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;
