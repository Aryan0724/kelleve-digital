import { test, expect } from '@playwright/test';

test.use({ ignoreHTTPSErrors: true });

test('login on staging works', async ({ page, context }) => {
  console.log("Navigating to staging login...");
  await page.goto('http://187.127.164.142:3001/login', { waitUntil: 'domcontentloaded' });

  console.log("Page title:", await page.title());
  
  console.log("Filling out login form...");
  await page.fill('input[name="email"]', 'vendor200@truedial.test');
  await page.fill('input[name="password"]', 'password');

  console.log("Submitting login form...");
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 10000 }).catch(() => null);

  const url = page.url();
  console.log("Landed on URL:", url);

  if (url.includes('/dashboard')) {
    console.log("SUCCESS: Successfully logged into staging dashboard!");
    
    const cookies = await context.cookies();
    const authToken = cookies.find(c => c.name === 'auth_token');
    console.log("Auth token cookie found:", !!authToken);
    if (authToken) {
      console.log("Cookie details:", authToken);
    }
  } else {
    console.log("FAILED: Did not land on dashboard.");
    
    const errorMsg = await page.locator('.text-red-600').textContent().catch(() => null);
    if (errorMsg) {
      console.log("Error message displayed:", errorMsg);
    }
  }
  
  expect(url).toContain('/dashboard');
});
