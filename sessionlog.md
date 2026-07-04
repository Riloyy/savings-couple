# Session Log

## Stack
Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 + @tanstack/react-query + Supabase

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
      useTransactions.ts    — CRUD transaksi, total, userTotals, runningTotal, resetTransactions
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
      SettingsPage.tsx      — edit goal (input bg putih), Reset Goal (konfirmasi), lihat akun & device, btn Keluar merah
  lib/
    supabase.ts           — Supabase client (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
  App.tsx                 — routing state-based, QueryClient + AuthProvider
  main.tsx                — entry point
  index.css               — @import tailwindcss, @theme tokens, global styles
supabase/
  migration.sql           — SQL migration: 4 tabel + RLS + indexes
```

## Auth Flow
- **Supabase Auth** (production, bukan mock)
- Login: pilih user → PIN 6 digit → sign in ke Supabase via email mapping:
  - `rilo` → `rilo@tabungan.app`
  - `isna` → `isna@tabungan.app`
- PIN adalah password Supabase Auth (default: `123456`)
- Session persist: buka ulang app → auto login (ceking `getSession()`)
- Loading spinner saat initial session check
- AppLock: setelah login, bisa di-trigger via `lock()`
- Brute-force & device lock: belum diimplementasi

## Database (Supabase)
- **4 tabel**: users, user_devices, transactions, settings
- **RLS aktif**: users & devices → hanya data sendiri, transactions → read all / insert own, settings → read & update by authenticated
- **2 user Auth**: dibuat manual via Supabase Dashboard
- **public.users**: diisi manual via SQL dengan UUID dari Auth users
- `.env` menyimpan URL + anon key (terlindung .gitignore)

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

### Reset Goal (Settings)
- Tombol merah "Reset Goal" di card Goal Tabungan
- Klik → modal konfirmasi
- Hapus semua transaksi (resetTransactions) + reset goal ke default
- Tombol "Simpan Goal" tetap berfungsi normal (lanjutkan goal)

### TransactionForm Inputs
- Nominal & catatan: `bg-bg-primary` → `bg-white` (ngikut background biru sebelumnya)

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
5e0d64f — update sessionlog with final session changes
4768319 — add Reset Goal button with confirmation, TransactionForm inputs bg-white
fd4623e — migrate auth to Supabase (real login, session, user profile)
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

## Changes Made (Session 3) — Migrasi Transactions & Settings ke Supabase

### Migration SQL
- `supabase/migration_v2_rls.sql` — update RLS: `users` SELECT ALL, `transactions` DELETE OWN

### Hooks
- **useTransactions.ts**: rewrite total dari mock → Supabase:
  - `useQuery` fetch transactions (order by created_at DESC)
  - `useMutation` untuk insert + delete (Reset Goal)
  - Realtime subscription via `postgres_changes` channel
  - `addTransaction` jadi async (`mutateAsync`)
  - `isAdding` state exported
  - Computed tetap pakai `useMemo`: total, userTotals, runningTotal
- **useSettings.ts**: rewrite ke Supabase:
  - `useQuery` fetch settings (id=1, single row)
  - `useMutation` untuk update goal
  - `initialData` fallback: Rp50jt, "DP Rumah"
- **useAuth.tsx**: tambah `users` + `usersById` untuk UUID→name/color mapping:
  - `fetchAllUsers()` dipanggil setelah login / session restore
  - Semua component pake `usersById[uuid]` instead of `RILO`/`ISNA` constants

### Components updated
- **DashboardPage**: ambil userA/userB dari `useAuth().users` (index 0 & 1)
- **BreakdownCard**: terima `users: User[]` prop (ganti `import USERS`)
- **TransactionRow**: terima `usersById: Record<string, User>` prop
- **HistoryPage**: filter pakai `useAuth().users` + `usersById`
- **SettingsPage**: daftar akun pakai `useAuth().users`

### Cleanup
- `mock.ts`: hapus `generateMockTransactions()`, hapus unused `Transaction` import

### Removed
- Card "Device Terdaftar" dari SettingsPage
- Device lock (Edge Function) — batal, tidak jadi diimplementasi

## Changes Made (Session 4) — Brute-force Protection

### Migration SQL
- `supabase/migration_v3_bruteforce.sql` — 2 RPC functions:
  - `increment_failed_attempts(UUID)` → increment + auto-lock at 5 attempts (15 menit)
  - `reset_failed_attempts(UUID)` → reset counter on successful login
  - Keduanya `SECURITY DEFINER` (bypass RLS, bisa dipanggil sebelum login)

### useAuth.tsx
- `login()` return type jadi `LoginResult` (object, bukan boolean):
  - `{ ok: true }` → login berhasil
  - `{ ok: false, reason: 'locked', remainingMinutes }` → akun terkunci
  - `{ ok: false, reason: 'wrong_pin', remainingAttempts }` → PIN salah, sisa N
  - `{ ok: false, reason: 'not_found' }` → user tak dikenal
  - `{ ok: false, reason: 'auth_error' }` → error Supabase Auth
- Flow login baru:
  1. Cari user by name → dapat UUID
  2. Cek `locked_until` — kalau masih locked, tolak
  3. Attempt `signInWithPassword`
  4. Gagal → panggil `increment_failed_attempts` RPC
  5. Berhasil → panggil `reset_failed_attempts` RPC
- Export tipe `LoginResult` dan `LockInfo`
- Export fungsi `checkLock(shortId)` untuk pengecekan awal

### LoginScreen.tsx
- Saat pilih user → panggil `checkLock()` → langsung deteksi jika terkunci
- Locked state: tampilkan icon Lock + pesan "Coba lagi dalam X menit", PIN input disabled
- Wrong PIN: tampilkan "PIN salah. N kesempatan lagi."
- Sisa kesempatan ditampilkan di bawah judul "Masukkan PIN"

### Thresholds
- Maksimal 5 percobaan gagal
- Lock duration: 15 menit
- Reset otomatis saat lock expired + percobaan baru

## Changes Made (Session 5) — Ganti PIN + PWA + Deploy Config

### Ganti PIN (SettingsPage)
- `useAuth.tsx`: tambah `changePassword(currentPassword, newPassword)` 
  - Re-authenticate via `signInWithPassword` → `updateUser`
  - Return `{ ok, error }` object
- `SettingsPage.tsx`: Card "Ganti PIN" baru (sebelum Akun Terdaftar)
  - 3 input: PIN Lama, PIN Baru, Konfirmasi PIN Baru (numeric 6 digit)
  - Validasi: konfirmasi harus cocok, min 6 digit
  - Loading spinner, success message hijau (auto-hide 2s), error merah

### PWA
- `vite.config.ts`: tambah `VitePWA` plugin
  - registerType: autoUpdate
  - Manifest lengkap (name, short_name, icons, theme/bg color, standalone, portrait)
  - Workbox: precache JS/CSS/HTML/SVG, NetworkFirst untuk Supabase API
- `public/icon.svg`: heart icon (#FF6B81) untuk PWA
- `index.html`: apple-touch-icon, apple-mobile-web-app meta, mobile-web-app-capable
- Build: service worker generated ✅ (8 entries, 483 KiB precache)

### Deploy Config
- `vercel.json`: Vite framework preset + SPA rewrites
- `.env.example`: placeholder env vars
- `DEPLOY.md`: panduan deploy via Vercel Dashboard atau CLI

## Changes Made (Session 6) — Deploy ke Vercel

### Deploy
- Vercel project: `riloz/savings-couple`
- Domain: **https://savings-couple.vercel.app** (aliased)
- Build: sukses (PWA service worker + precache)
- Environment variables:
  - `VITE_SUPABASE_URL`: `https://jmcwusatmergvhxnigcw.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: (publishable key)
- Redeploy setelah set env vars ✅

### Service Worker terdaftar
- 8 entries precache (483 KiB)
- NetworkFirst strategy untuk Supabase API calls
- Auto-update (registerType: autoUpdate)

## Changes Made (Session 7+) — Diskusi & Perubahan Akhir

### Login — PIN sebagai identitas
- Tidak ada user selection. Langsung input PIN.
- `login(pin)` → coba ke 2 email (Rilo & Isna), yang cocok auto-login
- Gagal → increment `failed_attempts` kedua user, lock jika >= 5

### Short ID berubah
- Rilo: `rilo` → `3105`
- Isna: `isna` → `1012`
- `mock.ts`: `RILO.id`, `ISNA.id`, `USER_EMAILS` keys diupdate
- `useAuth.tsx`: `shortIdToName`, `fetchUserProfile`, `fetchAllUsers` pakai `NAME_TO_SHORT_ID`
- Card "Ganti PIN" dihapus (user atur via Supabase langsung)
- ID UUID di "Akun Terdaftar" dihapus (line "ID: ..." tidak ditampilkan)

### Greeting Card (Dashboard)
- Card putih + avatar lingkaran + "Selamat Pagi/Siang/Sore/Malam" (WIB)
- Font lebih besar: greeting `text-lg` Baloo 2, nama `text-[17px]`

### Realtime fix
- Channel name pakai `crypto.randomUUID()` biar gak clash pas StrictMode re-mount

### BreakdownCard → Progres ke Goal
- Sekarang nunjukkin `userAmount / goalAmount * 100` (bukan bagi rata)
- Bar gradient biru-pink, label "% dari goal"
- Judul card: "Progres ke Goal"

### PWA Icon
- Hapus generate-icons script & generated PNG
- User sediakan `public/icon.png` sendiri
- Manifest pake PNG + SVG, `purpose: 'any'` (bukan maskable — biar gak kotak hitam)
- `index.html`: apple-touch-icon pake PNG

### Auto-lock (privasi)
- `useAuth.tsx`: tambah `visibilitychange` listener → app ke background → auto-lock
- `unlock(pin)` jadi async: re-authenticate via `signInWithPassword` sebelum unlock
- `AppLockScreen`: panggil `await unlock(pin)`, handle error

## Changes Made — Fix Reset Goal (global)
- Migration v4: `reset_all_transactions()` RPC (SECURITY DEFINER, bypass RLS)
- Fix: tambah `WHERE TRUE` karena PostgreSQL safe update mode
- Frontend: panggil `supabase.rpc('reset_all_transactions')` bukan `.delete().neq(...)`
- Persentase goal bar: format 1 desimal (`52,3%`) pakai `toFixed(1)` + koma ala Indonesia

## Changes Made (Session 8) — Lock-on-kill via localStorage + Deploy

### useAuth.tsx
- **visibilitychange**: tambah `localStorage.setItem('app_locked', 'true')` saat app ke background
- **pagehide**: tambah listener untuk menangkap app di-kill/ditutup (lebih reliable daripada visibilitychange)
- **getSession startup**: sebelum auto-login, cek `localStorage.getItem('app_locked')` — kalau `'true'`, set `isLocked = true` dulu biar lock screen muncul
- **login success**: `localStorage.removeItem('app_locked')`
- **unlock success**: `localStorage.removeItem('app_locked')`
- **logout**: `localStorage.removeItem('app_locked')`
- ~percobaan: idle timeout 1 menit (direvert)~

### Behavior
- App di-swipe (killed) → `pagehide` fires → simpan ke localStorage → saat dibuka lagi, lock screen muncul ✅ (verified)
- App background (pindah app lain) → `visibilitychange` fires → simpan ke localStorage → balik lagi → lock screen
- Refresh halaman (jarang di PWA) → `pagehide` fires → lock screen juga (masuk PIN lagi)
- Lock screen dismiss normal (PIN) seperti biasa

### Deploy
- Deploy ulang ke Vercel (https://savings-couple.vercel.app) ✅

## Changes Made (Session 9) — Default goal kosong

- `mock.ts` `DEFAULT_SETTINGS`: `goalAmount: 0`, `goalName: ''`
- `useSettings.ts` `initialData`: `{ goalAmount: 0, goalName: '' }`
- `DashboardPage`: "Goal: ..." hanya muncul kalau `goalName` diisi
- Deploy ke Vercel ✅

## Final Status
| Fitur | Status |
|---|---|
| Auth (Supabase, PIN=identitas) | ✅ |
| Transactions (Supabase + realtime) | ✅ |
| Settings (Supabase) | ✅ |
| Floating Hearts | ✅ |
| Heart Progress SVG | ✅ |
| Brute-force protection | ✅ |
| Auto-lock on background | ✅ |
| PWA (manifest + icons + service worker) | ✅ |
| Deploy ke Vercel | ✅ |
| **GitHub + push** | **⏳ pending instruksi** |
