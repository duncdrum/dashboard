import { defineConfig } from 'vite';

const isCypress = !!process.env.CYPRESS;

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: isCypress ? false : '/demo/admin.html',
    cors: true,
    proxy: {
      '/exist': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: isCypress
    ? {
        entries: ['test/cypress/support/component-index.html'],
        noDiscovery: true
      }
    : {}
});
