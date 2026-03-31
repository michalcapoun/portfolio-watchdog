import { test, expect, Page } from '@playwright/test';

/**
 * On mobile, lang/theme buttons are hidden inside the hamburger menu.
 * getByRole('button', { name: 'Otevřít menu' }) is semantic — relies on aria-label,
 * not the CSS class .navbar__hamburger.
 */
async function openMobileMenuIfNeeded(page: Page) {
  const hamburger = page.getByRole('button', { name: 'Otevřít menu' });
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await page.waitForTimeout(300);
  }
}

test.describe('Mobile navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- Mobile hamburger menu ---
  // getByRole('button', { name: 'Otevřít menu' }) — semantic selector.
  // Verifying via aria-expanded="true" is better than checking CSS class or div visibility —
  // it's the accessibility state that signals the menu is open.
  test('mobile hamburger opens nav menu', async ({ page }) => {
    const hamburger = page.getByRole('button', { name: 'Otevřít menu' });
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await page.waitForTimeout(300);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });
});
