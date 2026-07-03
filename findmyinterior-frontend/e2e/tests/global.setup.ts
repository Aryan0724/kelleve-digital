import { test as setup, expect } from '@playwright/test';

setup('wipe and seed database', async ({ request }) => {
  setup.setTimeout(120000); // 120 seconds for DB reset
  console.log('Wiping and reseeding the database for E2E tests via CLI...');
  const { execSync } = require('child_process');
  try {
    execSync('php artisan migrate:fresh --seed --seeder=E2ESeeder', {
      cwd: '../findmyinterior-backend',
      stdio: 'inherit'
    });
    console.log('Database reset successfully.');
  } catch (err) {
    console.error('Failed to reset DB:', err);
    throw err;
  }
});
