import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const projectId = env.VITE_SANITY_PROJECT_ID || 'vko2u6kf'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5176',
          changeOrigin: true,
        },
        '/sanity': {
          target: `https://${projectId}.api.sanity.io`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sanity/, ''),
        },
      },
    },
  }
})
