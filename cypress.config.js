import { defineConfig } from 'cypress';

export default defineConfig({
  includeShadowDom: true,
  retries: 1,
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  fixturesFolder: 'test/cypress/fixtures',
  downloadsFolder: 'test/cypress/downloads',
  component: {
    devServer: {
      framework: 'vite',
      bundler: 'vite',
      viteConfig: {
        server: { open: false }
      }
    },
    specPattern: 'test/cypress/component/**/*.cy.{js,ts}',
    supportFile: 'test/cypress/support/component.js',
    indexHtmlFile: 'test/cypress/support/component-index.html'
  },
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://localhost:8080/exist/apps',
    specPattern: 'test/cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'test/cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0
    }
  }
});
