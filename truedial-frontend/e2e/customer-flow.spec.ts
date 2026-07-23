import { test, expect } from '@playwright/test';

test.describe('Customer Flow', () => {
  test('should search for interior designers and view a profile', async ({ page }) => {
    await page.goto('/');

    // Assume there is a search input
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('Truedial');
    
    // We wait for autocomplete or press enter
    await page.keyboard.press('Enter');

    // Should navigate to search results
    await page.waitForURL('**/search**');
    await expect(page.locator('text=Truedial').first()).toBeVisible();

    // Click on the first result
    const firstBusiness = page.locator('a[href*="/businesses/"]').first();
    await firstBusiness.click();

    // Should view business profile
    await page.waitForURL('**/businesses/**');
    await expect(page.locator('text=About').first()).toBeVisible();
  });
});
