-- ============================================
-- Migration v2: Update RLS policies for couples app
-- ============================================

-- Users: allow reading all users (needed for UUID→name/color mapping)
DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

-- Transactions: allow delete own (for Reset Goal)
CREATE POLICY "transactions_delete_own" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);
