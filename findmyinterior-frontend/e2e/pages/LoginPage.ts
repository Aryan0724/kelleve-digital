import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string = 'password') {
    await this.goto();
    // Fill the login form
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    // Click the login button
    await this.page.click('button[type="submit"].bg-orange-600');
    
    // Wait for the URL to change (e.g. redirect to dashboard or home)
    await this.page.waitForURL(url => !url.toString().includes('/login'));
  }

  async logout() {
    // Assuming there is a user menu dropdown or a logout button
    // It depends on the UI implementation.
    // We can directly hit the API or look for the UI element.
    await this.page.goto('/');
    // Check if a logout button is visible.
    const logoutBtn = this.page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await this.page.waitForURL('/login');
    } else {
        // if in a dropdown menu
        const userMenu = this.page.locator('.user-menu-button, [aria-label="User menu"]');
        if (await userMenu.isVisible()) {
            await userMenu.click();
            await this.page.click('button:has-text("Logout"), a:has-text("Logout")');
            await this.page.waitForURL('/login');
        }
    }
  }
}
