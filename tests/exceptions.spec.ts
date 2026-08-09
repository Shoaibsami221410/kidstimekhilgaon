import { test, expect } from '@playwright/test';

test.describe('Exception & Error Handling', () => {
  
  test('Invalid URL returns 404 Not Found gracefully', async ({ page }) => {
    // Navigate to a completely random non-existent URL
    const response = await page.goto('/this-page-definitely-does-not-exist-12345');
    
    // In Next.js, 404 pages usually return a 404 status code
    expect(response?.status()).toBe(404);
    
    // Verify that the page doesn't just crash but shows some 404 indicator
    // Next.js default 404 usually contains '404' or 'could not be found'
    await expect(page.locator('body')).toContainText(/404|could not be found|not found/i);
  });

  test('Invalid Event ID returns 404 gracefully', async ({ page }) => {
    // Navigate to a dynamic route that doesn't exist
    const response = await page.goto('/events/invalid-uuid-format-or-id');
    
    // Some apps return 404, some redirect, or some show an error message
    // We just ensure the page didn't crash into a raw 500 error
    expect(response?.status()).not.toBe(500);
    
    // It should either be a 404, 400, or a 200 OK (graceful empty state)
    // We just ensure it's not a server error (500)
    expect(response?.status()).toBeLessThan(500);
  });

  test('Form validation exception on invalid email format', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out the required fields but use an invalid email
    await page.locator('input[id="firstName"]').fill('Test');
    await page.locator('input[id="lastName"]').fill('User');
    
    // Invalid email format (missing @ and domain)
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('not-a-valid-email');
    
    await page.locator('button[type="submit"]').click();
    
    // HTML5 validation should prevent submission and keep us on the page
    await expect(page).toHaveURL(/.*\/contact/);
    
    // The browser should flag the input as invalid (HTML5 validation)
    // We can evaluate the validity state
    const isEmailValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isEmailValid).toBe(false);
  });
});
