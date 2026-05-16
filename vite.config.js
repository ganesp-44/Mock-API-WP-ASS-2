// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  // 🔑 THIS IS THE KEY FIX:
  // Must match your GitHub repo name exactly (case-sensitive)
  base: '/Mock-API-WP-ASS-2/',
})