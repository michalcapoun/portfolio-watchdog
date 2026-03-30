import { test, expect } from '@playwright/test';

test.describe('Smoke – page load', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/michalcapoun\.cz/i);
  });

  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('projects section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#projects')).toBeVisible();
  });

  test('contact section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    expect(errors).toHaveLength(0);
  });

  test('no failed network requests', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (req) => failed.push(req.url()));
    await page.goto('/');
    // Allow Google Analytics failures (e.g. in ad-blocking CI environments)
    const critical = failed.filter((url) => !url.includes('google') && !url.includes('gtag'));
    expect(critical).toHaveLength(0);
  });
});
