import { test, expect } from '@playwright/test';

test.describe('Analytics Tracking Flows', () => {

  test('Verify PHONE_CLICK tracking from business card', async ({ page }) => {
    // Intercept tracking requests
    let trackingRequestCount = 0;
    let trackedEventData = null;

    await page.route('**/api/v1/truedial/public/analytics/track', async (route) => {
      trackingRequestCount++;
      trackedEventData = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, json: { success: true } });
    });

    // Go to search page where business cards exist
    await page.goto('/search');

    // Wait for business cards to load
    await page.waitForSelector('text=Call');

    // Click the phone number on the first card
    const callButton = page.locator('text=Call').first();
    await callButton.click({ noWaitAfter: true });

    // Wait for the track API call
    await page.waitForTimeout(1000);

    expect(trackingRequestCount).toBeGreaterThan(0);
    expect(trackedEventData).not.toBeNull();
    expect(trackedEventData.event_type).toBe('PHONE_CLICK');
    expect(trackedEventData.entity_type).toBe('listing');
    expect(trackedEventData.metadata.source).toBe('business_card');
  });

  test('Verify tracking from business profile page', async ({ page }) => {
    // Intercept tracking requests
    let trackedEvents: any[] = [];

    await page.route('**/api/v1/truedial/public/analytics/track', async (route) => {
      trackedEvents.push(JSON.parse(route.request().postData() || '{}'));
      await route.fulfill({ status: 200, json: { success: true } });
    });

    // We need to visit a specific business page, assume we can search and click the first
    await page.goto('/search');
    await page.waitForSelector('.flex-1 h3');
    
    // Click the first business link (heading)
    const firstBusiness = page.locator('h3.font-bold').first();
    await firstBusiness.click();

    // Now on the profile page. Wait for it to load.
    await page.waitForSelector('text=About');

    // Wait for page view tracking to settle (if any, though we didn't add it in frontend yet, 
    // but maybe we track buttons).

    // Click on website link (assuming it exists, we just click any trackable link)
    const websiteBtn = page.locator('a:has-text("Website")').first();
    if (await websiteBtn.count() > 0) {
      await websiteBtn.click({ noWaitAfter: true });
      await page.waitForTimeout(1000);
      
      const websiteEvent = trackedEvents.find(e => e.event_type === 'WEBSITE_CLICK');
      expect(websiteEvent).toBeTruthy();
      expect(websiteEvent.entity_type).toBe('listing');
    }

    // Click on phone
    const phoneBtn = page.locator('a:has-text("Phone")').first();
    if (await phoneBtn.count() > 0) {
      await phoneBtn.click({ noWaitAfter: true });
      await page.waitForTimeout(1000);
      
      const phoneEvent = trackedEvents.find(e => e.event_type === 'PHONE_CLICK');
      expect(phoneEvent).toBeTruthy();
      expect(phoneEvent.entity_type).toBe('listing');
    }
  });

});
