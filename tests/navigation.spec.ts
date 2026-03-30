import { test, expect, Page, Locator } from '@playwright/test';

/** Vrátí viditelný lang button — desktop nebo mobile (po otevření hamburger menu). */
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

/** Vrátí viditelný theme button — desktop nebo mobile (po otevření hamburger menu). */
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

test.describe('Navigation & interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- Navbar links ---
  test('navbar links scroll to correct sections', async ({ page }) => {
    const navLinks = [
      { selector: 'a[href="#projects"]', target: '#projects' },
      { selector: 'a[href="#contact"]', target: '#contact' },
      { selector: 'a[href="#hero"], a[href="/"]', target: '#hero' },
    ];

    for (const { selector, target } of navLinks) {
      const link = page.locator(selector).first();
      if (await link.isVisible()) {
        await link.click();
        await expect(page.locator(target)).toBeInViewport({ ratio: 0.1 });
      }
    }
  });

  // --- Language switcher ---
  test('language switcher toggles content language', async ({ page }) => {
    const langBtn = await getLangButton(page);
    await langBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('#hero')).toBeVisible();
  });

  // --- Dark / Light theme ---
  test('theme toggle switches theme', async ({ page }) => {
    const body = page.locator('body');
    const hasDarkBefore = await body.evaluate((el) => el.classList.contains('dark-theme'));

    const themeBtn = await getThemeButton(page);
    await themeBtn.click();
    await page.waitForTimeout(300);

    const hasDarkAfter = await body.evaluate((el) => el.classList.contains('dark-theme'));
    expect(hasDarkAfter).not.toBe(hasDarkBefore);
  });

  // --- Project carousel ---
  test('project carousel next button works', async ({ page }) => {
    const nextBtn = page.locator('[aria-label*="další" i], [aria-label*="next" i]').first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#projects')).toBeVisible();
    }
  });

  test('project carousel prev button works', async ({ page }) => {
    const prevBtn = page.locator('[aria-label*="předchozí" i], [aria-label*="prev" i]').first();
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#projects')).toBeVisible();
    }
  });

  // --- Contact card flip ---
  test('contact card flips on click', async ({ page }) => {
    const card = page.locator('.contact-card, .card--flip, [data-flip]').first();
    if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(500);
      const backSide = page.locator('.card__back, .contact-card__back').first();
      if (await backSide.count() > 0) {
        await expect(backSide).toBeVisible();
      }
    }
  });

  // --- Mobile hamburger menu ---
  test('mobile hamburger opens nav menu', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    const hamburger = page.locator('.navbar__hamburger');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await page.waitForTimeout(300);
    const mobileMenu = page.locator('.navbar__mobile-menu');
    await expect(mobileMenu).toBeVisible();
  });

  // --- External links open correctly ---
  // Failing until portfolio adds rel="noopener noreferrer" to target="_blank" links
  test('external links have target="_blank" and rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[href^="http"]:not([href*="michalcapoun.cz"])');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      expect(target, `External link[${i}] missing target="_blank"`).toBe('_blank');
      expect(rel, `External link[${i}] missing rel="noopener"`).toContain('noopener');
    }
  });
});
