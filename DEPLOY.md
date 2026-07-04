# Deploy ke Vercel

## Prasyarat
- Akun Vercel (vercel.com)
- Vercel CLI (`npm i -g vercel`) atau hubungkan via vercel.com dashboard
- Semua perubahan sudah di-commit ke git

## Langkah-langkah

### Via Vercel Dashboard (recommended)
1. Push repo ke GitHub
2. Buka https://vercel.com/new
3. Import repositori GitHub
4. Framework preset: Vite (otomatis terdeteksi)
5. Environment Variables:
   - `VITE_SUPABASE_URL`: https://jmcwusatmergvhxnigcw.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: (isi dengan key dari .env)
6. Deploy

### Via CLI
```bash
vercel login
vercel --prod
```

Setelah deploy, Vercel akan memberikan URL (misal: tabungan-bersama.vercel.app).
