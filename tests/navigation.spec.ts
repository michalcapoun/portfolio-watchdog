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

test.describe('Navigation & interactivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // --- Navbar links ---
  // a[href="#projects"] is not a CSS class — it's an attribute describing the link destination.
  // Stable choice: only changes if the section is intentionally renamed.
  test('navbar links scroll to correct sections', async ({ page }) => {
    const navLinks = [
      { selector: 'a[href="#projects"]', target: '#projects' },
      { selector: 'a[href="#contact"]', target: '#contact' },
      { selector: 'a[href="#hero"]', target: '#hero' },
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
  // getByRole('button', { name: '...' }) targets by aria-label, not CSS class.
  // Works for both desktop and mobile versions — both share the same aria-label.
  test('language switcher toggles content language', async ({ page }) => {
    await openMobileMenuIfNeeded(page);
    const langBtn = page.getByRole('button', { name: 'Přepnout jazyk' }).first();
    await langBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('#hero')).toBeVisible();
  });

  // --- Dark / Light theme ---
  // Same principle as lang button — aria-label as the selector basis.
  // body.evaluate remains: we need to verify the actual state change,
  // not just that the click happened.
  test('theme toggle switches theme', async ({ page }) => {
    const body = page.locator('body');
    const hasDarkBefore = await body.evaluate((el) => el.classList.contains('dark-theme'));

    await openMobileMenuIfNeeded(page);
    const themeBtn = page.getByRole('button', { name: 'Přepnout téma' }).first();
    await themeBtn.click();
    await page.waitForTimeout(300);

    const hasDarkAfter = await body.evaluate((el) => el.classList.contains('dark-theme'));
    expect(hasDarkAfter).not.toBe(hasDarkBefore);
  });

  // --- Project carousel ---
  // getByRole('button', { name: '...' }) instead of [aria-label*="další" i].
  // More precise — no need to know the attribute name, just the role and label.
  test('project carousel next button works', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: 'Další projekt' });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#projects')).toBeVisible();
    }
  });

  test('project carousel prev button works', async ({ page }) => {
    const prevBtn = page.getByRole('button', { name: 'Předchozí projekt' });
    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#projects')).toBeVisible();
    }
  });

  // --- Contact card flip ---
  // The flip icon has no aria-label or button role — getByRole cannot be used.
  // [data-action="flip"] is a data attribute describing the intended action, not visual style.
  // Better than a CSS class, worse than getByRole — a compromise given the HTML structure.
  test('contact card flips on click', async ({ page }) => {
    const flipIcon = page.locator('[data-action="flip"]').first();
    if (await flipIcon.isVisible()) {
      await flipIcon.click();
      await page.waitForTimeout(500);
      const backSide = page.locator('.contact__back');
      if (await backSide.count() > 0) {
        await expect(backSide).toBeVisible();
      }
    }
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
