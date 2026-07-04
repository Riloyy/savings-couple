-- ============================================
-- Migration v4: Allow global Reset Goal
-- ============================================

-- RPC: delete all transactions (bypasses RLS, SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.reset_all_transactions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.transactions WHERE TRUE;
END;
$$;
