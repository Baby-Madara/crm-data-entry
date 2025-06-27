import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/crm-data-entry/',  // This is required for correct routing on GitHub Pages
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'CRM Data Entry',
      short_name: 'CRM',
      start_url: '.',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#3B82F6',
      icons: [
        {
          src: 'crm-data-entry/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'crm-data-entry/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'crm-data-entry/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
