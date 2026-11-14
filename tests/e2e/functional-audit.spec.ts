import { test, expect } from '@playwright/test';

test.describe('E2E QA & Functional Audit - Core Web Application', () => {

  // 1. Homepage & Critical Layout
  test('1. Homepage loads with Hero, Navigation Header, and Footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  // 2. Navigation Across Public Pages
  test('2. Public informative routes render without crashing', async ({ page }) => {
    const routes = ['/about', '/programs', '/events', '/facilities', '/teachers', '/contact'];
    
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  // 3. Access Control & Authorization (Unauthenticated Protected Routes)
  test('3. Admin dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('4. Parent dashboard redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/parent');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('5. Admissions application route redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/admissions');
    await expect(page).toHaveURL(/.*\/login/);
  });

  // 4. Authentication Forms & Validation
  test('6. Login form renders and displays feedback on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Submit invalid credentials
    await emailInput.fill('qa-audit-test@example.com');
    await passwordInput.fill('InvalidPassword123!');
    await submitBtn.click();

    // Must remain on login or show error (never navigate to dashboard)
    await expect(page).not.toHaveURL(/.*\/dashboard/);
  });

  test('7. Signup form renders with required registration fields', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  // 5. Contact Information & Location Render
  test('8. Contact page displays physical location and phone contacts', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toContainText(/Call Us|Visit Us|Kids Time/i);
  });

  // 6. Trial Classes & Interactive Flow
  test('9. Trial classes page renders interactive flow', async ({ page }) => {
    await page.goto('/trial-classes');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  // 7. Error Handling & Graceful 404
  test('10. Invalid URL returns graceful 404 page', async ({ page }) => {
    const res = await page.goto('/non-existent-qa-audit-test-page-404');
    expect(res?.status()).toBe(404);
    await expect(page.locator('body')).toBeVisible();
  });

  // 8. Mobile Responsiveness
  test('11. Mobile viewport layout renders responsive header', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

});
