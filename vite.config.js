import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      base: '/coin-counter/',
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon-180.png', 'money/**/*'],
      manifest: {
        name: 'Cash Counter',
        short_name: 'Cash Counter',
        description: 'Learn to count US money — build amounts, count bills & coins, and make change!',
        theme_color: '#1b5e20',
        background_color: '#f0f4ff',
        display: 'standalone',
        scope: '/coin-counter/',
        start_url: '/coin-counter/',
        orientation: 'portrait',
        icons: [
          { src: '/coin-counter/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/coin-counter/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/money\//,
            handler: 'CacheFirst',
            options: { cacheName: 'money-images', expiration: { maxEntries: 20 } },
          },
        ],
      },
    }),
  ],
  base: '/coin-counter/',
})
