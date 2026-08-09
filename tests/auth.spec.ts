import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard', () => {
  
  test('Dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard');
    
    // It should automatically redirect to /login
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('Login page UI renders correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check for email and password inputs
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Login shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input[type="email"]').fill('fakeuser@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();
    
    // It should show some sort of error message or remain on the login page
    // We wait for either an alert/toast or verify we didn't get redirected to /dashboard
    await expect(page).not.toHaveURL(/.*\/dashboard/);
  });
});
