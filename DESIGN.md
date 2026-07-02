# DESIGN.md — Tabungan Bersama (Couple Savings PWA)

Dokumen ini adalah acuan desain tunggal untuk seluruh pengembangan app. Semua komponen UI harus mengikuti token & aturan di sini agar konsisten dari tahap ke tahap.

---

## 1. Konsep & Signature Element

**Tema**: "biru cinta" — dominan biru muda yang tenang & terpercaya (cocok untuk uang/tabungan), dipadu aksen pink/love yang hangat untuk elemen personal (kontribusi, kasih sayang, kebersamaan).

**Signature element — "Dua Hati Saling Mengisi"**
Alih-alih progress bar horizontal biasa, dashboard utama menampilkan dua bentuk hati bertumpuk (overlapping hearts), masing-masing merepresentasikan satu pasangan. Tinggi isian tiap hati = persentase kontribusi orang tersebut terhadap total tabungan. Saat goal tabungan tercapai, kedua hati "berdetak" pelan secara bersamaan (subtle pulse, ±2% scale, 1x saja saat goal baru tercapai — bukan looping terus-menerus).

Ini satu-satunya elemen yang "berani"; elemen lain di sekitarnya dibuat tenang & disiplin.

---

## 2. Color Tokens

| Token | Hex | Fungsi |
|---|---|---|
| `--bg-primary` | `#EAF4FB` | Background utama (biru langit sangat muda) |
| `--bg-surface` | `#FFFFFF` | Card/surface di atas background |
| `--blue-accent` | `#5B8DEF` | Tombol utama, link, elemen interaktif |
| `--blue-accent-dark` | `#3E6FD9` | Hover/pressed state |
| `--love-pink` | `#FF6B81` | Heart icon, highlight kontribusi, elemen "cinta" |
| `--love-pink-soft` | `#FFE1E6` | Background lembut untuk badge/chip love |
| `--text-primary` | `#1F3350` | Teks utama (navy tua) |
| `--text-secondary` | `#5C7191` | Teks sekunder/caption |
| `--positive` | `#7FB77E` | Transaksi nabung (masuk) |
| `--negative` | `#E4572E` | Transaksi tarik (keluar) |
| `--border` | `#D8E6F2` | Border tipis antar elemen |

Kontras teks utama di atas background sudah dicek memenuhi AA (navy `#1F3350` di atas `#EAF4FB`/`#FFFFFF`).

---

## 3. Typography

- **Display / Angka besar / Judul**: `Baloo 2` (rounded, hangat, personal) — dipakai untuk total saldo, nama goal, heading halaman. Gunakan secukupnya, jangan untuk body text panjang.
- **Body / UI text**: `Plus Jakarta Sans` — untuk label, deskripsi, isi tabel, form.
- **Angka nominal di tabel**: `Plus Jakarta Sans` dengan `font-variant-numeric: tabular-nums` biar rapi sejajar.

Scale (mobile-first):
- Display XL (total saldo): 40px / bold
- H1 (judul halaman): 24px / semibold
- Body: 15px / regular
- Caption: 13px / regular, `--text-secondary`

---

## 4. Layout & iPhone 15 Fit

- Target viewport utama: 390×844pt (iPhone 15), breakpoint naik bertahap untuk tablet/desktop tapi tetap single-column-first.
- Gunakan `env(safe-area-inset-top/bottom)` — padding atas untuk area dynamic island, padding bawah untuk home indicator.
- Bottom navigation bar ala iOS (fixed, blur/frosted background `backdrop-filter`), bukan sidebar.
- Tap target minimal 44×44pt untuk semua tombol/ikon interaktif.
- Card: `border-radius: 20px`, shadow lembut (`0 4px 20px rgba(31,51,80,0.06)`), padding internal 16-20px.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 (px).

---

## 5. Komponen Kunci

**Tombol utama**: pill-shaped (`border-radius: 999px`), `--blue-accent` background, teks putih, sedikit scale-down (0.97) saat ditekan.

**Heart Progress (signature)**: SVG custom, 2 hati overlap, fill pakai clip-path/mask sesuai persentase, transisi fill `ease-out 600ms` saat data berubah.

**Transaction row**: ikon bulat kecil (hijau untuk masuk, oranye-merah untuk keluar), nominal rata kanan tabular, nama & waktu di kiri.

**Lock screen (PIN)**: numpad besar rounded, dot indicator progress PIN pakai `--love-pink` saat terisi.

**Empty state**: ilustrasi hati sederhana + copy singkat, contoh: "Belum ada tabungan. Mulai catat yang pertama, yuk." (bukan generik "No data found").

---

## 6. Animasi (tipis-tipis, jangan berlebihan)

- Total saldo: pulse halus (±1.5% scale, 300ms) saat nilai berubah — **hanya sekali**, bukan loop.
- Tambah transaksi: 1-2 partikel heart kecil melayang naik lalu fade, durasi ±800ms.
- Heart Progress fill: animasi smooth saat data update, easing `ease-out`.
- Page/card transition: fade+slide 200ms, hormati `prefers-reduced-motion` (matikan animasi non-esensial jika user set itu).
- **Aturan umum**: tidak ada animasi looping terus-menerus, tidak ada confetti besar — biar tetap terasa tenang & premium, bukan ramai.

---

## 7. Voice & Copy

- Bahasa Indonesia santai, orang kedua ("kamu"), aktif.
- Error jelas & actionable, bukan generik. Contoh: "PIN salah, coba lagi" bukan "Error 401".
- Tombol pakai kata kerja aktif: "Simpan", "Tambah Tabungan" — konsisten dengan hasil aksinya (toast setelah simpan: "Tersimpan").

---

## 8. Accessibility

- Semua interactive element punya visible focus state (`outline: 2px solid var(--blue-accent)`).
- Kontras teks minimal AA.
- `prefers-reduced-motion` dihormati di semua animasi non-esensial.
