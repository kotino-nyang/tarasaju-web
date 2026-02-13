-- 기존 CHECK constraint 제거 (자동 생성된 이름도 처리)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT conname
              FROM pg_constraint
              WHERE conrelid = 'public.orders'::regclass
              AND contype = 'c'
              AND conname LIKE '%status%')
    LOOP
        EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- order_status에 'confirmed'와 'cancelling' 상태 추가
ALTER TABLE public.orders ADD CONSTRAINT orders_order_status_check
  CHECK (order_status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelling', 'cancelled'));

-- payment_status에 'cancelling' 상태 추가
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'confirmed', 'completed', 'cancelling', 'cancelled'));

-- 사용자가 본인의 주문을 업데이트할 수 있는 정책 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'orders'
        AND policyname = 'Users can update their own orders'
    ) THEN
        CREATE POLICY "Users can update their own orders"
          ON public.orders
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
