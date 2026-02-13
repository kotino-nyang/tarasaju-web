-- 관리자용 주문 조회 정책
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'orders'
        AND policyname = 'Admins can view all orders'
    ) THEN
        CREATE POLICY "Admins can view all orders"
          ON public.orders
          FOR SELECT
          TO authenticated
          USING (
            auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
          );
    END IF;
END $$;

-- 관리자용 주문 업데이트 정책
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'orders'
        AND policyname = 'Admins can update all orders'
    ) THEN
        CREATE POLICY "Admins can update all orders"
          ON public.orders
          FOR UPDATE
          TO authenticated
          USING (
            auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
          )
          WITH CHECK (
            auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
          );
    END IF;
END $$;
