import { test, expect, Page, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function getLangButton(page: Page): Promise<Locator> {
  const desktop = page.locator('.navbar__actions .lang-button');
  if (await desktop.isVisible()) return desktop;

  const hamburger = page.locator('.navbar__hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
  return page.locator('.navbar__mobile-controls .lang-button');
}

async function getThemeButton(page: Page): Promise<Locator> {
  const desktop = page.locator('.navbar__actions .theme-button');
  if (await desktop.isVisible()) return desktop;

  const hamburger = page.locator('.navbar__hamburger');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
  return page.locator('.navbar__mobile-controls .theme-button');
}

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

  test('interactive elements are keyboard focusable', async ({ page, isMobile }) => {
    if (isMobile) test.skip();
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('language switcher is accessible', async ({ page }) => {
    await page.goto('/');
    const langBtn = await getLangButton(page);
    await expect(langBtn).toBeVisible();
  });

  test('theme toggle is accessible', async ({ page }) => {
    await page.goto('/');
    const themeBtn = await getThemeButton(page);
    await expect(themeBtn).toBeVisible();
  });
});
