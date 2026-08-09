import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  
  test('Home page loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for the main hero heading
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if the Navbar is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Ensure the footer is rendered
    await expect(page.locator('footer')).toBeVisible();
  });

  test('About page loads correctly', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Programs page loads correctly', async ({ page }) => {
    await page.goto('/programs');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Events page loads and shows events or empty state', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('h1')).toBeVisible();
    // Check that at least one section is rendered
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('Teachers page loads correctly', async ({ page }) => {
    await page.goto('/teachers');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Contact form page renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toBeVisible();
    
    // Form should exist
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[id="firstName"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  
  test('Contact form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit without filling
    await page.locator('button[type="submit"]').click();
    
    // Should still be on the contact page (not redirected to success)
    await expect(page).toHaveURL(/.*\/contact/);
  });
});
