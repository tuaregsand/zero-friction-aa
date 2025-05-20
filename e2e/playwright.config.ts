import { defineConfig } from '@playwright/test';
import { execSync } from 'child_process';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  webServer: {
    command: 'docker compose -f docker-compose.prod.yml up -d',
    timeout: 120000,
    reuseExistingServer: true,
  },
  globalTeardown: './teardown.js',
});
