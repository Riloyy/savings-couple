# PLAN.md — Tabungan Bersama (Couple Savings PWA)

Dokumen ini rangkuman rencana teknis & fitur, hasil diskusi awal. Jadi acuan bareng `DESIGN.md` (yang khusus soal visual/UI).

---

## 1. Ringkasan Produk

Web app PWA privat untuk 2 orang (pasangan) mencatat & tracking tabungan bersama. Tidak ada user luar yang bisa daftar/masuk. Diakses lewat "Add to Home Screen" di iPhone, terasa seperti app native.

---

## 2. Stack Teknologi

| Bagian | Pilihan | Alasan |
|---|---|---|
| Frontend | Vite + React + TypeScript + Tailwind CSS | Ringan, cepat build & load, tanpa overhead SSR yang gak perlu (app privat, tanpa SEO) |
| PWA | `vite-plugin-pwa` | Add to Home Screen, offline cache asset statis |
| Backend | Supabase (Postgres + Auth + Realtime) | Free tier cukup untuk 2 user, RLS built-in, realtime built-in |
| Data fetching | `@tanstack/react-query` + Supabase Realtime channel | Cache pintar + auto update saat pasangan nambah transaksi |
| Hosting | Vercel (static hosting) | Gratis, auto HTTPS, deploy dari Git |

Sengaja tidak pakai Next.js, custom auth server, atau state management library tambahan (Redux dll) — dianggap overkill untuk app 2 user ini.

---

## 3. Autentikasi & Keamanan

**Login**: ID (nama singkat, misal "A"/"B") + PIN 4-6 digit.
- Di belakang layar dipetakan ke Supabase Auth (email dummy internal + password = PIN), supaya tetap dapat session/JWT/RLS gratis dari Supabase tanpa bikin sistem auth sendiri.

**Device Lock**:
- Saat login pertama di sebuah HP, sistem generate device token unik → disimpan di HP (localStorage/IndexedDB) & hash-nya disimpan di tabel `user_devices` terikat ke user.
- Login berikutnya di HP yang sama → device token dicek dulu (lewat Edge Function `verify-device`) sebelum sign-in diproses.
- Login dari HP/browser lain yang belum terdaftar → ditolak, muncul pesan device tidak dikenali.
- **Reset device** (HP hilang/ganti HP): manual lewat Supabase dashboard oleh pemilik project — tidak ada fitur reset otomatis di app (sesuai keputusan, biar simpel & aman).

**App Lock**:
- Setiap app dibuka dari background/tertutup → layar kunci minta PIN lagi (status "unlocked" tidak persisten).
- PIN diverifikasi ke server tiap kali (RPC kecil), tidak disimpan mentah di HP.

**RLS (Row Level Security)**: semua tabel Supabase dibatasi hanya bisa diakses oleh 2 `auth.uid()` yang terdaftar.

**Proteksi Brute-force PIN**:
- Setelah 5x salah PIN berturut-turut (baik saat login maupun app lock) → akun dikunci sementara 5 menit.
- Dicek via kolom `failed_attempts` + `locked_until` di tabel `users`, divalidasi di RPC/Edge Function, bukan di client.

**Lupa PIN**: tidak ada fitur self-service di app. Reset manual via Supabase dashboard oleh pemilik project (sama seperti reset device).

---

## 4. Skema Database

```sql
users            (id, name, avatar_color, failed_attempts, locked_until)
user_devices     (id, user_id, device_token_hash, created_at)
transactions     (id, user_id, amount, type: 'in' | 'out', note, created_at)
settings         (id, goal_amount, goal_name, updated_at)
```

- `transactions.type = 'in'` → nabung/masuk, `'out'` → tarik/keluar.
- `settings` menyimpan goal tabungan (nominal target + nama goal, misal "DP Rumah").
- `users.failed_attempts` & `users.locked_until` → dipakai untuk proteksi brute-force PIN (lihat bagian 3).

**Format & default lokal**:
- Mata uang: Rupiah (IDR), format `Rp1.234.567` (titik sebagai pemisah ribuan).
- Timezone: WIB (Asia/Jakarta) untuk semua timestamp.
- Setup awal: 2 akun (nama & PIN awal) dibuat manual sekali via Supabase dashboard/seed script, bukan lewat form registrasi (karena memang tidak ada fitur daftar akun baru — cuma 2 user tetap).

---

## 5. Fitur

1. **Login** — ID + PIN, dengan device lock & app lock (lihat bagian 3).
2. **Dashboard**
   - Total tabungan gabungan (angka besar).
   - Progress ke goal (nominal target vs terkumpul) — pakai "Heart Progress" (lihat `DESIGN.md`).
   - Breakdown kontribusi: persentase gabungan dari total + persentase masing-masing orang dari total.
3. **Tambah transaksi** — nominal, tipe (nabung/tarik), catatan opsional. Realtime: langsung muncul di HP pasangan tanpa refresh.
4. **Tabel riwayat** — list transaksi, filter by user/tanggal, running total.
5. **Settings** — atur/ubah goal tabungan, ubah PIN, lihat device yang terdaftar (read-only, reset manual via dashboard).
6. **PWA** — installable di iPhone (Add to Home Screen), offline-capable untuk *melihat* data yang sudah ter-cache. Tombol "Tambah Transaksi" dinonaktifkan otomatis saat tidak ada koneksi internet (tidak ada offline-write/sync-queue, biar tetap simpel).

---

## 6. Roadmap Build (bertahap, biar gampang direview)

1. **Setup project** — struktur Vite+React+TS+Tailwind, PWA config, design system dari `DESIGN.md` (warna, font, komponen dasar).
2. **Schema Supabase** — SQL migration untuk 4 tabel di atas + RLS policy.
3. **Auth flow** — login ID+PIN, device lock (Edge Function `verify-device`), app lock screen.
4. **Dashboard + transaksi** — heart progress, breakdown persentase, form tambah transaksi, realtime sync.
5. **Tabel riwayat + settings** — filter tabel, halaman settings (goal, PIN).

---

## 7. Yang Sudah Diputuskan (jangan diubah tanpa diskusi ulang)

- Device lock: aktif (device + app lock, keduanya).
- Login: ID + PIN (bukan email/password biasa).
- Persentase: gabungan dari total + per-orang dari total.
- Goal tabungan: ada, dengan progress bar/visual.
- Reset device: manual via Supabase dashboard, bukan fitur di app.
- Realtime sync: aktif.
- Brute-force protection: aktif (lock 5 menit setelah 5x salah PIN).
- Lupa PIN & reset device: manual via Supabase dashboard (bukan fitur self-service di app).
- Offline: hanya bisa lihat data ter-cache, tombol tambah transaksi nonaktif saat offline (tanpa sync-queue).
- Mata uang: Rupiah, timezone: WIB.
