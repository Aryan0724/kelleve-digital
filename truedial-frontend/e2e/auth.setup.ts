import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate vendor', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /Login with Email & Password/i }).click();
  await page.fill('input[type="email"]', 'vendor@truedial.in');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard**');
  await expect(page.locator('text=Dashboard').first()).toBeVisible();

  await page.context().storageState({ path: authFile });
});
