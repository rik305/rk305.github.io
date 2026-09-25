import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://formspree.io https://api.web3forms.com",
  "form-action 'self' https://formspree.io https://api.web3forms.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': contentSecurityPolicy,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(three|@react-three|postprocessing)\//.test(id)) return 'three'
          if (/node_modules\/(react-dom|react|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(zustand|lucide-react)\//.test(id)) return 'ui'
        },
      },
    },
  },
  server: {
    headers: {
      ...securityHeaders,
      'Content-Security-Policy': contentSecurityPolicy.replace(
        "script-src 'self'",
        "script-src 'self' 'unsafe-inline'",
      ),
    },
  },
  preview: { headers: securityHeaders },
})
