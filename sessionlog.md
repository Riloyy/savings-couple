# Session Log

## Stack
Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 + @tanstack/react-query

## Design System
- **Bg**: `#87CEFA` (biru langit lembut)
- **Surface**: `#FFFFFF`
- **Accent**: `#5B8DEF` (blue), `#FF6B81` (love-pink)
- **Text di atas bg biru**: `#FFFFFF` (primary), `white/70` (secondary)
- **Text di dalam card putih**: `#1F3350` (primary), `#5C7191` (secondary)
- **Positive**: `#7FB77E` | **Negative**: `#E4572E`
- **Font**: `Baloo 2` (display/judul), `Plus Jakarta Sans` (body)
- **Radius**: 20px (card), 999px (pill button)
- **Shadow**: `0 4px 20px rgba(31,51,80,0.06)`
- **Spacing**: 4/8/12/16/24/32px
- **Safe-area**: `env(safe-area-inset-top/bottom)` untuk iPhone

## Project Structure
```
src/
  types/index.ts            — User, Transaction, Settings, Page
  data/mock.ts              — RILO, ISNA users, mock transaksi (12 item), formatIDR()
  hooks/
    useAuth.tsx             — AuthProvider + useAuth (login/logout/lock/unlock)
    useTransactions.ts      — CRUD transaksi, total, userTotals, runningTotal
    useSettings.ts          — goalAmount, goalName
  components/
    ui/
      Button.tsx            — variant: primary | ghost | danger
      Card.tsx              — wrapper rounded-2xl + shadow
      PinInput.tsx          — hidden input + native keypad + dot indicator (light mode)
      FloatingHearts.tsx    — 7 partikel hati melayang naik (CSS keyframes, linear)
    layout/
      AppShell.tsx          — wrapper safe-area + title header (text-white)
      BottomNav.tsx         — 3 tab: Tabungan, Riwayat, Setting (iOS blur, stroke-only active)
    auth/
      LoginScreen.tsx       — Pilih user → PIN via native keypad (text white on blue bg)
      AppLockScreen.tsx     — PIN re-entry via native keypad (text white on blue bg)
    dashboard/
      HeartProgress.tsx     — 2 SVG hati overlap, fill clip-path based on %
      TotalBalance.tsx      — text putih, angka besar 40px, pulse saat berubah
      BreakdownCard.tsx     — kontribusi per orang (bar + % dari total), tanpa Goal line
      DashboardPage.tsx     — goal progress bar dengan % di dalam bar (gradient)
    transactions/
      TransactionForm.tsx   — bottom sheet: nominal, tipe (nabung/tarik), catatan
      TransactionRow.tsx    — row: ikon ↑↓, nominal warna, tanggal, user, running total
      HistoryPage.tsx       — full list + filter by user (title text-white)
    settings/
      SettingsPage.tsx      — edit goal (input bg putih), lihat akun & device, btn Keluar merah
  App.tsx                   — routing state-based, QueryClient + AuthProvider
  main.tsx                  — entry point
  index.css                 — @import tailwindcss, @theme tokens, global styles
```

## Auth Flow
- Mock PIN: `123456` untuk Rilo & Isna
- Login: pilih user → **native keypad HP muncul otomatis/ketuk area dot** → PIN 6 digit auto-submit
- AppLock: setelah login, bisa di-trigger via `lock()`
- Brute-force & device lock: belum diimplementasi (mock dulu)
- Custom numpad sudah dihapus, ganti PinInput dengan hidden input + native keypad

## Changes Made (Session 2)

### Floating Hearts (Option 1 — Subtle)
- 7 partikel hati, ukuran 14-24px, opacity 0.2-0.35
- Melayang naik dari bawah ke atas, siklus 10-18 detik, linear
- pointer-events-none, z-belakang konten
- Terlihat di atas bg biru, di belakang konten

### Background Color
- Awal: `#EAF4FB` → ganti `#2196F3` → final `#87CEFA` (biru langit)
- theme-color meta tag ikut berubah

### Text Color on Blue Background
Semua teks yg langsung di atas `#87CEFA` diubah jadi putih:
- AppShell title (Tabungan Bersama, Riwayat, Pengaturan)
- TotalBalance label + nominal
- LoginScreen title + deskripsi + "Siapa kamu?"
- PIN screen "Masukkan PIN", hint "Ketuk untuk memasukkan PIN"
- AppLockScreen "Terkunci", "Masukkan PIN untuk membuka"
- HistoryPage title "Riwayat Transaksi"
- SettingsPage title "Pengaturan"

### Input Fields (Settings)
- `bg-bg-primary` → `bg-white` supaya teks navy terbaca

### PIN Input (Major Change)
- Custom Numpad dihapus
- Diganti PinInput: hidden input `inputMode="numeric"`, native keypad HP
- Tap area dot indicator → fokus input → keypad muncul
- Auto-submit saat 6 digit terisi
- Props `light` untuk mode teks putih di atas bg biru

### Bottom Nav
- Icon active: dulu `fill="love-pink"` nutup detail → sekarang stroke-only (text-love-pink)

### Goal Progress Bar
- Persentase `goalPct%` ada di dalam bar gradient, ujung kanan fill
- Ikut bergerak saat bar bertambah/berkurang
- Bar ada di kartu HeartProgress (atas)

### BreakdownCard
- Baris "Goal Rp... / Rp0" dihapus

### "Kembali" Button (Login)
- Dulu: underline polos
- Sekarang: pill button bg putih/90, teks blue-accent, icon chevron

### "Keluar" Button (Settings)
- Dulu: ghost button tanpa wadah
- Sekarang: danger variant (merah), standalone

## Git Log
```
2b0e408 — checkpoint before floating hearts animation
0d04ffe — add subtle floating hearts animation (option 1)
af5caba — add sessionlog.md
00342a5 — add combined progress (Gabungan) section to BreakdownCard
626edf1 — revert combined progress (Gabungan) section
04259aa — percentage text inside goal progress bar, follows bar growth
ea5c2b8 — add pending note: GitHub setup (wait for instruction)
0d85c8a — replace custom Numpad with native keypad (PinInput), prettier Kembali button
982bd1a — remove Goal line in BreakdownCard, standalone Keluar button
```

## To Revert Specific Changes
```bash
# Revert floating hearts
git revert 0d04ffe
# Revert PinInput + Kembali button
git revert 0d85c8a
# Revert Goal line removal + Keluar button
git revert 982bd1a
```

## Next Steps (when ready)
1. Setup Supabase project → ganti mock data dengan real DB
2. Implementasi device lock (Edge Function verify-device)
3. Implementasi brute-force protection (failed_attempts, locked_until)
4. PWA: configure vite-plugin-pwa dengan service worker
5. Deploy ke Vercel
6. **[PENDING — wait for instruction]** Setup GitHub repo + push (amankan .env, .gitignore sebelum push)
