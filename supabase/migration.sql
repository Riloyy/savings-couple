-- ============================================
-- Migration: Tabungan Bersama - Initial Schema
-- ============================================

-- 1. TABLES

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#5B8DEF',
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ
);

CREATE TABLE public.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  device_token_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.settings (
  id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  goal_amount BIGINT NOT NULL DEFAULT 0,
  goal_name TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.settings (id, goal_amount, goal_name) VALUES (1, 50000000, 'DP Rumah');

-- 2. INDEXES

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_user_devices_user_id ON public.user_devices(user_id);

-- 3. ROW LEVEL SECURITY

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Users: hanya bisa baca & update data sendiri
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Devices: baca device sendiri, insert device sendiri
CREATE POLICY "devices_select_own" ON public.user_devices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "devices_insert_own" ON public.user_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: baca semua, insert milik sendiri
CREATE POLICY "transactions_select_all" ON public.transactions
  FOR SELECT USING (true);
CREATE POLICY "transactions_insert_own" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Settings: baca & update oleh siapapun yg terautentikasi
CREATE POLICY "settings_select_all" ON public.settings
  FOR SELECT USING (true);
CREATE POLICY "settings_update_all" ON public.settings
  FOR UPDATE USING (true);
