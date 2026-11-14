import { test } from '@playwright/test';

test('take screenshots', async ({ page }) => {
  console.log('Taking Landing Page screenshot...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for images
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/landing_page.png', fullPage: true });

  console.log('Taking Course Catalog screenshot...');
  await page.goto('http://localhost:3000/courses', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/course_catalog.png', fullPage: true });
  
  console.log('Taking Login screenshot...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/login_page.png', fullPage: true });

  console.log('Logging in as Admin...');
  await page.fill('input[type="email"]', 'admin2@kidstime.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 10000 });
  await page.waitForTimeout(3000); // Wait for dashboard data to load

  console.log('Taking Admin Dashboard screenshot...');
  await page.screenshot({ path: 'C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/admin_dashboard.png', fullPage: true });

  console.log('All screenshots taken successfully!');
});
