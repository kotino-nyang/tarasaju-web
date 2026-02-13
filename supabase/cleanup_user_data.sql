-- ============================================
-- Account Data Cleanup Fix
-- ============================================

-- Function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete from reviews first (foreign key constraint likely exists)
  DELETE FROM public.reviews WHERE user_id = OLD.id;
  
  -- Delete from orders
  -- Note: In a production app, you might want to keep these for tax records 
  -- but anonymize the user_id. For this requested "clean start" fix, we delete.
  DELETE FROM public.orders WHERE user_id = OLD.id;
  
  -- Delete from user_coupons
  DELETE FROM public.user_coupons WHERE user_id = OLD.id;
  
  -- Delete from public.users
  DELETE FROM public.users WHERE id = OLD.id;

  RETURN OLD;
END;
$$;

-- Trigger to run on DELETE
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deleted_user();
