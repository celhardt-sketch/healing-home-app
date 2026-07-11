import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'apple-touch-icon-180x180.png',
      ],
      manifest: {
        name: 'The Healing Home Approach',
        short_name: 'Healing Home',
        description:
          'A trauma-informed psychoeducational support tool for foster and adoptive caregivers. By Elhardt Family Wellness.',
        id: '/',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#2A4B84',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },

        ],
      },
      workbox: {
        // Precache ALL built assets (JS, CSS, HTML, images, fonts)
        // This ensures the entire app shell + all page content loads offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        // Force new service worker to activate immediately on deploy
        skipWaiting: true,
        clientsClaim: true,
        // Cache Google Fonts (Playfair Display + Inter) at runtime
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // In-the-moment content (First Aid cards + Scripts): a caregiver mid-
          // meltdown may have bad signal. StaleWhileRevalidate serves the cached
          // copy instantly (and offline once seen) while refreshing in the
          // background. Matches the content API on any origin (VITE_API_URL).
          {
            urlPattern: /\/api\/content\/(first_aid_cards|scripts)(\?.*)?$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'in-the-moment-content',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        // SPA: navigate to index.html for all routes, EXCEPT API calls and
        // real static files (e.g. /printables/*.pdf). Without the file-extension
        // denylist, the SW would answer a PDF download with index.html.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/printables\//, /\.[a-zA-Z0-9]+$/],
      },
    }),
  ],
})
