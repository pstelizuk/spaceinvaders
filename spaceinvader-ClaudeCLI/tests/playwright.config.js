// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 30000,
  workers: 1,
  fullyParallel: false,
  reporter: 'line',
  use: {
    headless: false,
    channel: 'chrome',
    viewport: { width: 1000, height: 900 },
    baseURL: 'http://localhost:8765',
  },
});
