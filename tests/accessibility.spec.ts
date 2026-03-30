import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('no critical a11y violations on load', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `img[${i}] is missing alt attribute`).not.toBeNull();
    }
  });

  test('interactive elements are keyboard focusable', async ({ page }) => {
    await page.goto('/');
    // Tab through the page and verify focus is visible on interactive elements
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('language switcher is accessible', async ({ page }) => {
    await page.goto('/');
    const langBtn = page.locator('[data-lang], .lang-btn, button:has-text("CS"), button:has-text("EN")').first();
    await expect(langBtn).toBeVisible();
  });

  test('theme toggle is accessible', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('.theme-button').first();
    await expect(themeBtn).toBeVisible();
  });
});
