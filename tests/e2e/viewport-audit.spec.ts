import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320px Mobile', width: 320, height: 568 },
  { name: '375px Mobile', width: 375, height: 667 },
  { name: '390px Mobile', width: 390, height: 844 },
  { name: '768px Tablet', width: 768, height: 1024 },
  { name: '1024px Laptop', width: 1024, height: 768 },
  { name: '1366px Desktop', width: 1366, height: 768 },
  { name: '1920px Large Desktop', width: 1920, height: 1080 },
];

const publicRoutes = [
  '/',
  '/about',
  '/programs',
  '/facilities',
  '/teachers',
  '/events',
  '/gallery',
  '/contact',
  '/trial-classes',
  '/login',
  '/signup',
];

test.describe('Responsive Design & Overflow Audit', () => {
  for (const vp of viewports) {
    test(`Verify zero horizontal overflow on all routes at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      test.setTimeout(90000); // Allow sufficient time for Next.js on-demand compilation
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of publicRoutes) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        
        // Wait for layout stability
        await page.waitForTimeout(200);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (overflow) {
          const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          console.warn(`[OVERFLOW DETECTED] Route: ${route} at ${vp.width}px (scrollWidth: ${scrollWidth}px > innerWidth: ${vp.width}px)`);
        }

        expect(overflow, `Horizontal overflow detected on ${route} at ${vp.name} (${vp.width}px)`).toBe(false);
      }
    });
  }
});
