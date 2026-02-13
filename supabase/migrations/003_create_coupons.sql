-- Check if orders table exists and add cancelling status if needed
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Only proceed if orders table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        -- Drop existing status constraints
        FOR r IN (SELECT conname
                  FROM pg_constraint
                  WHERE conrelid = 'public.orders'::regclass
                  AND contype = 'c'
                  AND conname LIKE '%status%')
        LOOP
            EXECUTE 'ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
        END LOOP;
        
        -- Add updated constraints with cancelling status
        ALTER TABLE public.orders ADD CONSTRAINT orders_order_status_check
          CHECK (order_status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelling', 'cancelled'));
        
        ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check
          CHECK (payment_status IN ('pending', 'confirmed', 'completed', 'cancelling', 'cancelled'));
          
        RAISE NOTICE 'Successfully updated orders table constraints with cancelling status';
    ELSE
        RAISE NOTICE 'Orders table does not exist. Please run migration 004 first.';
    END IF;
END $$;
