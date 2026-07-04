import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = env.VITE_SUPABASE_URL || ''
  const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'icon.png'],
        manifest: {
          name: 'Tabungan Bersama',
          short_name: 'Tabungan',
          description: 'Aplikasi tabungan bersama untuk pasangan',
          theme_color: '#87CEFA',
          background_color: '#87CEFA',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['finance', 'lifestyle'],
          icons: [
            {
              src: '/icon.png',
              sizes: 'any',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,png}'],
          runtimeCaching: supabaseHost ? [
            {
              urlPattern: new RegExp(`^https?://${supabaseHost}/.*`, 'i'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
                networkTimeoutSeconds: 10,
              },
            },
          ] : [],
        },
      }),
    ],
  }
})
