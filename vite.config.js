// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow all ngrok subdomains (recommended for hackathon)
    allowedHosts: [
      '.ngrok-free.dev',      // allows any *.ngrok-free.dev
      'localhost',            // keep local access working
      '127.0.0.1'
    ],
    // Optional: if you want even more permissive (not needed)
    // host: '0.0.0.0',     // allows access from any IP on your network
  }
})