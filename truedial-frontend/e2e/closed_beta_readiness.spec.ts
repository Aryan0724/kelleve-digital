import { test, expect } from '@playwright/test';

test.describe('TrueDial Closed Beta Readiness - Public & Vendor Pages', () => {
  const publicRoutes = [
    { path: '/', title: 'truedial' },
    { path: '/search', title: '' },
    { path: '/offers', title: '' },
    { path: '/consulting', title: '' },
    { path: '/free-listing', title: '' },
    { path: '/register', title: '' },
  ];

  for (const route of publicRoutes) {
    test(`Public route ${route.path} loads with HTTP 200 and renders UI`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBeLessThan(400);
      
      // Verify body is visible and no Unhandled Runtime Error exists
      await expect(page.locator('body')).toBeVisible();
      const errorText = await page.content();
      expect(errorText).not.toContain('Unhandled Runtime Error');
    });
  }

  const vendorRoutes = [
    '/dashboard/vendor',
    '/dashboard/vendor/offers',
    '/dashboard/vendor/leads',
    '/dashboard/vendor/marketing',
  ];

  for (const route of vendorRoutes) {
    test(`Vendor Dashboard route ${route} renders without crashing`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500); // 200 or auth redirect
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
