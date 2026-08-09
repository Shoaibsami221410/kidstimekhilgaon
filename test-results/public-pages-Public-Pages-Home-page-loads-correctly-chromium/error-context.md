# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> Public Pages >> Home page loads correctly
- Location: tests\public-pages.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('nav')
Expected: visible
Error: strict mode violation: locator('nav') resolved to 2 elements:
    1) <nav class="hidden xl:flex gap-8">…</nav> aka getByText('HomeAboutProgramsFacilitiesTeachersEventsGalleryContact')
    2) <nav class="error-overlay-pagination dialog-exclude-closing-from-outside-click">…</nav> aka locator('nav').filter({ hasText: '/1' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('nav')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Kids Time Logo" [ref=e5]
      - navigation [ref=e6]:
        - link "Home" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "About" [ref=e8] [cursor=pointer]:
          - /url: /about
        - link "Programs" [ref=e9] [cursor=pointer]:
          - /url: /programs
        - link "Facilities" [ref=e10] [cursor=pointer]:
          - /url: /facilities
        - link "Teachers" [ref=e11] [cursor=pointer]:
          - /url: /teachers
        - link "Events" [ref=e12] [cursor=pointer]:
          - /url: /events
        - link "Gallery" [ref=e13] [cursor=pointer]:
          - /url: /gallery
        - link "Contact" [ref=e14] [cursor=pointer]:
          - /url: /contact
      - link [ref=e16] [cursor=pointer]:
        - /url: /programs
        - button "Trial Class" [ref=e17]
  - main [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e22]:
        - heading "Nurturing Brilliant Minds for a Brighter Future" [level=1] [ref=e23]
        - link [ref=e25] [cursor=pointer]:
          - /url: /programs
          - button "Book a Trial Class" [ref=e26]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Our Story
          - heading "About Kids Time" [level=2] [ref=e32]
          - paragraph [ref=e33]: Kids Time, launched in 2017 by Light of Hope Ltd., aims to boost children's creativity and prepare them as future leaders through engaging courses. We offer an after-school program that includes Crafting, Drawing, Spoken English, and Singapore Math. Additionally, we have a pre-school program titled Kids Time Montessori School. With over 4000 graduates, Kids Time focuses on nurturing young minds and fostering their creativity and leadership skills.
        - img "About Kids Time" [ref=e35] [cursor=pointer]
      - generic [ref=e43]:
        - generic [ref=e44]:
          - generic [ref=e45]: Our Services
          - heading "Kids Time Montessori Pre-School" [level=2] [ref=e46]
          - paragraph [ref=e47]: At Kids Time, we believe in nurturing young minds and fostering creativity and leadership among children. Kids Time is pioneering the Montessori method in Bangladesh's pre-school with its first campus in Dhanmondi. Our Montessori-inspired curriculum is designed to spark curiosity, ignite creativity, and empower children to become confident, independent learners.
          - generic [ref=e48]:
            - link [ref=e49] [cursor=pointer]:
              - /url: /montessori
              - button "Learn More" [ref=e50]
            - link [ref=e51] [cursor=pointer]:
              - /url: https://wa.me/123456789
              - button "WhatsApp" [ref=e52]
        - generic [ref=e53]:
          - img "Montessori" [ref=e54]
          - generic [ref=e55]: LIVE
      - generic [ref=e57]:
        - generic [ref=e58]:
          - generic [ref=e59]: Our Services
          - heading "Kids Time After-School Program" [level=2] [ref=e60]
          - paragraph [ref=e61]: We offer amazing courses in our after-school program, including Crafting, Drawing, Singapore Math, and Spoken English. Your child can join these courses online from anywhere in the country or abroad, right from home. Additionally, these courses are available at our Dhanmondi and Khilgaon centers.
        - generic [ref=e63]:
          - generic [ref=e64] [cursor=pointer]:
            - img "Art & Craft Masterclass" [ref=e66]
            - heading "Art & Craft Masterclass Course" [level=3] [ref=e67]
            - paragraph [ref=e68]: Unleash your child's creativity with hands-on art and craft sessions. Learn origami, painting, and sculpting.
          - generic [ref=e70] [cursor=pointer]:
            - img "Creative Writing & Storytelling" [ref=e72]
            - heading "Creative Writing & Storytelling Course" [level=3] [ref=e73]
            - paragraph [ref=e74]: Nurture the author within. Children learn to structure stories, create characters, and write beautifully.
          - generic [ref=e76] [cursor=pointer]:
            - img "Spoken English for Kids" [ref=e78]
            - heading "Spoken English for Kids Course" [level=3] [ref=e79]
            - paragraph [ref=e80]: Build confidence and fluency in English through fun interactive storytelling, debates, and group discussions.
          - generic [ref=e82] [cursor=pointer]:
            - img "Mental Math & Logic" [ref=e84]
            - heading "Mental Math & Logic Course" [level=3] [ref=e85]
            - paragraph [ref=e86]: Make math fun! Boost calculation speed and logical thinking with engaging puzzles and abacus techniques.
          - generic [ref=e88] [cursor=pointer]:
            - img "Little Scientists (STEM)" [ref=e90]
            - heading "Little Scientists (STEM) Course" [level=3] [ref=e91]
            - paragraph [ref=e92]: Exciting hands-on science experiments. Let your child discover the wonders of physics, chemistry, and biology safely.
          - generic [ref=e94] [cursor=pointer]:
            - img "Kids Coding (Scratch)" [ref=e96]
            - heading "Kids Coding (Scratch) Course" [level=3] [ref=e97]
            - paragraph [ref=e98]: Introduction to block-based programming. Kids learn logical flow and create their own mini-games and animations.
        - link [ref=e101] [cursor=pointer]:
          - /url: /programs
          - button "Explore Courses" [ref=e102]
      - generic [ref=e105]:
        - generic [ref=e106]:
          - heading "Why Kids Time?" [level=2] [ref=e107]
          - paragraph [ref=e108]: See what other parents are saying about us...
        - generic [ref=e109]:
          - generic [ref=e111]:
            - generic [ref=e112]:
              - paragraph [ref=e113]: "\"Kids Time কে অনেক ধন্যবাদ অনলাইন ক্লাসের এই উদ্যোগের জন্য। ক্লাসগুলো করার পর থেকে ফারহানের ইলেক্ট্রিক ডিভাইসের প্রতি আগ্রহ একদমই নেই! ফারহান এখন প্রতি সপ্তাহে অপেক্ষা করে Kids Time এর ক্লাসগুলোর জন্য!\""
              - generic [ref=e114]:
                - img "Kazi Iffat Ara" [ref=e115]
                - generic [ref=e116]:
                  - heading "Kazi Iffat Ara" [level=4] [ref=e117]
                  - paragraph [ref=e118]: Parent
            - generic [ref=e119]:
              - paragraph [ref=e120]: "\"খুব চমৎকার একটা উদ্যোগ। আমার মেয়ে ড্রয়িং ক্লাসে অনেক মজা করে। টিচাররা খুব যত্ন সহকারে শেখান।\""
              - generic [ref=e121]:
                - img "Farhana Rahman" [ref=e122]
                - generic [ref=e123]:
                  - heading "Farhana Rahman" [level=4] [ref=e124]
                  - paragraph [ref=e125]: Parent
            - generic [ref=e126]:
              - paragraph [ref=e127]: "\"My son loves the Singapore Math course. The way they teach makes it very easy to understand complex problems. Highly recommended!\""
              - generic [ref=e128]:
                - img "Rafiqul Islam" [ref=e129]
                - generic [ref=e130]:
                  - heading "Rafiqul Islam" [level=4] [ref=e131]
                  - paragraph [ref=e132]: Parent
          - generic [ref=e137]:
            - heading "Kids Time Parent Community" [level=3] [ref=e144]
            - paragraph [ref=e145]: Parents are regularly sharing their thoughts, child's activity, their creative task etc. in the Facebook community group.
            - link [ref=e146] [cursor=pointer]:
              - /url: https://facebook.com/groups/kidstime
              - button "Explore" [ref=e147]
  - contentinfo [ref=e148]:
    - generic [ref=e153]:
      - generic [ref=e154]:
        - generic [ref=e155]:
          - img "Kids Time Logo" [ref=e156]
          - paragraph [ref=e157]: A brand of Light of Hope Ltd.
        - paragraph [ref=e158]: Bangladesh's largest creative school — building confident, creative, and future-ready children since 2017.
        - generic [ref=e159]:
          - link [ref=e160] [cursor=pointer]:
            - /url: "#"
          - link [ref=e163] [cursor=pointer]:
            - /url: "#"
          - link [ref=e167] [cursor=pointer]:
            - /url: "#"
      - generic [ref=e171]:
        - heading "Company" [level=4] [ref=e172]
        - list [ref=e173]:
          - listitem [ref=e174]:
            - link "About Us" [ref=e175] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e176]:
            - link "Contact Us" [ref=e177] [cursor=pointer]:
              - /url: /contact
          - listitem [ref=e178]:
            - link "Our Teachers" [ref=e179] [cursor=pointer]:
              - /url: /teachers
          - listitem [ref=e180]:
            - link "Gallery" [ref=e181] [cursor=pointer]:
              - /url: /gallery
          - listitem [ref=e182]:
            - link "Articles" [ref=e183] [cursor=pointer]:
              - /url: /articles
      - generic [ref=e184]:
        - heading "Our Branches" [level=4] [ref=e185]
        - generic [ref=e186]:
          - generic [ref=e192]:
            - heading "Dhanmondi Branch" [level=5] [ref=e193]
            - paragraph [ref=e194]: Level 5, House 6/1A, Rezina Garden, Road 5A, Dhanmondi, Dhaka-1209
          - generic [ref=e200]:
            - heading "Khilgaon Branch" [level=5] [ref=e201]
            - paragraph [ref=e202]: Academia School, Holding 891, Block C, Malibagh Chowdhurypara Road, Khilgaon, Dhaka-1219
  - generic [ref=e207] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e208]
    - generic [ref=e212]:
      - button "Open issues overlay" [ref=e213]:
        - generic [ref=e214]:
          - generic [ref=e215]: "0"
          - generic [ref=e216]: "1"
        - generic [ref=e217]: Issue
      - button "Collapse issues badge" [ref=e218]
  - alert [ref=e221]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Public Pages', () => {
  4  |   
  5  |   test('Home page loads correctly', async ({ page }) => {
  6  |     await page.goto('/');
  7  |     
  8  |     // Check for the main hero heading
  9  |     await expect(page.locator('h1')).toBeVisible();
  10 |     
  11 |     // Check if the Navbar is visible
> 12 |     await expect(page.locator('nav')).toBeVisible();
     |                                       ^ Error: expect(locator).toBeVisible() failed
  13 |     
  14 |     // Ensure the footer is rendered
  15 |     await expect(page.locator('footer')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('About page loads correctly', async ({ page }) => {
  19 |     await page.goto('/about');
  20 |     await expect(page.locator('h1')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('Programs page loads correctly', async ({ page }) => {
  24 |     await page.goto('/programs');
  25 |     await expect(page.locator('h1')).toBeVisible();
  26 |   });
  27 | 
  28 |   test('Events page loads and shows events or empty state', async ({ page }) => {
  29 |     await page.goto('/events');
  30 |     await expect(page.locator('h1')).toBeVisible();
  31 |     // Check that at least one section is rendered
  32 |     await expect(page.locator('section').first()).toBeVisible();
  33 |   });
  34 | 
  35 |   test('Teachers page loads correctly', async ({ page }) => {
  36 |     await page.goto('/teachers');
  37 |     await expect(page.locator('h1')).toBeVisible();
  38 |   });
  39 | 
  40 |   test('Contact form page renders', async ({ page }) => {
  41 |     await page.goto('/contact');
  42 |     await expect(page.locator('h1')).toBeVisible();
  43 |     
  44 |     // Form should exist
  45 |     await expect(page.locator('form')).toBeVisible();
  46 |     await expect(page.locator('input[id="firstName"]')).toBeVisible();
  47 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  48 |   });
  49 |   
  50 |   test('Contact form shows validation errors on empty submit', async ({ page }) => {
  51 |     await page.goto('/contact');
  52 |     
  53 |     // Try to submit without filling
  54 |     await page.locator('button[type="submit"]').click();
  55 |     
  56 |     // Should still be on the contact page (not redirected to success)
  57 |     await expect(page).toHaveURL(/.*\/contact/);
  58 |   });
  59 | });
  60 | 
```