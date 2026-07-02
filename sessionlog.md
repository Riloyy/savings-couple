# Session Log

## Stack
Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 + @tanstack/react-query

## Design System
- **Bg**: `#EAF4FB` (biru muda)
- **Surface**: `#FFFFFF`
- **Accent**: `#5B8DEF` (blue), `#FF6B81` (love-pink)
- **Text**: `#1F3350` (primary), `#5C7191` (secondary)
- **Positive**: `#7FB77E` | **Negative**: `#E4572E`
- **Font**: `Baloo 2` (display/judul), `Plus Jakarta Sans` (body)
- **Radius**: 20px (card), 999px (pill button)
- **Shadow**: `0 4px 20px rgba(31,51,80,0.06)`
- **Spacing**: 4/8/12/16/24/32px
- **Safe-area**: `env(safe-area-inset-top/bottom)` untuk iPhone

## Project Structure
```
src/
  types/index.ts          — User, Transaction, Settings, Page
  data/mock.ts            — RILO, ISNA users, mock transaksi (12 item), formatIDR()
  hooks/
    useAuth.tsx           — AuthProvider + useAuth (login/logout/lock/unlock)
    useTransactions.ts    — CRUD transaksi, total, userTotals, runningTotal
    useSettings.ts        — goalAmount, goalName
  components/
    ui/
      Button.tsx          — variant: primary | ghost | danger
      Card.tsx            — wrapper rounded-2xl + shadow
      Numpad.tsx          — 3x3 numpad untuk PIN
      FloatingHearts.tsx  — 7 partikel hati melayang naik (CSS keyframes)
    layout/
      AppShell.tsx        — wrapper safe-area + title header
      BottomNav.tsx       — 3 tab: Tabungan, Riwayat, Setting (iOS-style blur)
    auth/
      LoginScreen.tsx     — Pilih user → PIN 6 digit (mock: 123456)
      AppLockScreen.tsx   — PIN re-entry saat app terkunci
    dashboard/
      HeartProgress.tsx   — 2 SVG hati overlap, fill clip-path based on %
      TotalBalance.tsx    — angka besar 40px, pulse animasi saat berubah
      BreakdownCard.tsx   — kontribusi per orang + bar + goal progress
      DashboardPage.tsx   — gabungan + FAB tombol tambah transaksi
    transactions/
      TransactionForm.tsx — bottom sheet: nominal, tipe (nabung/tarik), catatan
      TransactionRow.tsx  — row: ikon ↑↓, nominal warna, tanggal, user, running total
      HistoryPage.tsx     — full list + filter by user
    settings/
      SettingsPage.tsx    — edit goal, lihat akun & device, logout
  App.tsx                 — routing state-based (no react-router), QueryClient + AuthProvider
  main.tsx                — entry point
  index.css               — @import tailwindcss, @theme tokens, global styles
```

## Auth Flow
- Mock PIN: `123456` untuk Rilo & Isna
- Login: pilih user → masukin PIN 6 digit → auto-submit
- AppLock: setelah login, bisa di-trigger via `lock()`
- Brute-force & device lock: belum diimplementasi (mock dulu)

## Current State
- Semua fitur berjalan dengan mock data (no Supabase)
- Floating hearts: 7 partikel, ukuran 14-24px, opacity 0.2-0.35, siklus 10-18 detik, linear
- Background biru muda, hearts melayang di atas bg tapi di belakang konten
- HeartProgress: SVG custom, 2 hati overlap, fill clip-path, pulse saat goal tercapai
- BreakdownCard: ada section "Gabungan" (progress % terhadap goal) + per-orang (% dari total)

## Git Checkpoint
```
2b0e408 — checkpoint before floating hearts animation
0d04ffe — add subtle floating hearts animation (option 1)
00342a5 — add combined progress (Gabungan) section to BreakdownCard
```

## To Revert Floating Hearts
```
git revert 0d04ffe
```

## Next Steps (when ready)
1. Setup Supabase project → ganti mock data dengan real DB
2. Implementasi device lock (Edge Function verify-device)
3. Implementasi brute-force protection (failed_attempts, locked_until)
4. PWA: configure vite-plugin-pwa dengan service worker
5. Deploy ke Vercel
6. **[PENDING — wait for instruction]** Setup GitHub repo + push (amankan .env, .gitignore sebelum push)
