import { test, expect } from '@playwright/test';

test.describe('Vendor Flow', () => {
  test('should allow vendor to view dashboard', async ({ page }) => {
    await page.goto('/dashboard/business');
    await expect(page.locator('text=Business Dashboard').first()).toBeVisible();
    await expect(page.locator('text=Business Profile').first()).toBeVisible();
  });

  // More complex flows to be added:
  // - Create Listing
  // - Upload Cover
  // - Add Product
  // - Publish Offer
});
