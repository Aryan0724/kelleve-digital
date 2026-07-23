import { test, expect } from '@playwright/test';

test.describe('OTP and Free Listing Flow', () => {
  test('should allow a business to onboard via OTP', async ({ page }) => {
    // 1. Navigate to free listing page
    await page.goto('/free-listing');
    await expect(page.getByRole('heading', { name: /Add Your Business for Free/i })).toBeVisible();

    // 2. Step 1: Basic Details
    await page.getByPlaceholder(/Acme Interiors/i).fill('Test Business');
    await page.getByPlaceholder(/98765 43210/i).fill('9876543210');
    await page.getByRole('button', { name: /Start Free Listing/i }).click();

    // 3. Step 2: OTP Verification
    await expect(page.getByRole('heading', { name: /Verify your number/i })).toBeVisible();
    // Assuming backend returns success and OTP is verified
    // We use the fixed dev OTP '123456' OR '267659' but wait, backend environment might be production.
    // If it's production, it uses a random OTP, which we can't guess easily without DB query.
    // Let's type a 6 digit code. We can mock the API response for /api/v1/truedial/auth/otp/verify!
    await page.route('**/api/v1/truedial/auth/otp/verify', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Logged in successfully',
          token: 'test_token',
          user: {
            id: 999,
            name: 'Test Business',
            phone: '9876543210',
            roles: [{ slug: 'business' }]
          }
        })
      });
    });

    await page.getByPlaceholder(/••••••/i).fill('123456');
    await page.getByRole('button', { name: /Verify OTP/i }).click();

    // 4. Step 3: Location
    await expect(page.getByRole('heading', { name: /Where is your business located/i })).toBeVisible();
    await page.getByPlaceholder(/Mumbai/i).fill('Mumbai');
    await page.getByPlaceholder(/Building name/i).fill('123 Test Street');
    await page.getByRole('button', { name: /Continue to Categories/i }).click();

    // 5. Step 4: Categories
    await expect(page.getByRole('heading', { name: /What services do you offer/i })).toBeVisible();
    await page.getByText('+ Interior Designers').click();
    await page.getByRole('button', { name: /Complete Setup/i }).click();

    // 6. Should redirect to dashboard/business eventually
    // We wait for the redirect
    await page.waitForURL('**/dashboard/business');
    expect(page.url()).toContain('/dashboard/business');
  });
  
  test('should allow user to login via OTP', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Login to your account/i })).toBeVisible();

    // 2. Mobile Number Input
    await page.getByPlaceholder(/98765/i).fill('9876543210');
    
    // Mock the OTP send endpoint
    await page.route('**/api/v1/truedial/auth/otp/send', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.getByRole('button', { name: /Login with OTP/i }).click();

    // 3. OTP Verification
    await expect(page.getByText(/OTP sent to/i)).toBeVisible();
    
    await page.route('**/api/v1/truedial/auth/otp/verify', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'test_token',
          user: { roles: [{ slug: 'customer' }] }
        })
      });
    });

    await page.getByPlaceholder(/••••••/i).fill('123456');
    await page.getByRole('button', { name: /Verify & Login/i }).click();

    // 4. Should redirect
    await page.waitForURL('**/dashboard/user');
    expect(page.url()).toContain('/dashboard/user');
  });
});
