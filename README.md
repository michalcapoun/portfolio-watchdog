# portfolio-watchdog

Automated E2E tests for [michalcapoun.cz](https://michalcapoun.cz). Triggered after every portfolio deployment to catch regressions.

## Stack

- **[Playwright](https://playwright.dev)** + TypeScript — E2E testing
- **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)** — automated accessibility checks (WCAG 2.0/2.1)
- **GitHub Actions** — CI/CD, runs tests after every portfolio deploy

## What's tested

| File | Coverage |
|------|----------|
| `tests/smoke.spec.ts` | HTTP 200, page load, section visibility, failed requests, console errors |
| `tests/accessibility.spec.ts` | axe-core WCAG analysis, image alt texts, keyboard focus |
| `tests/navigation.spec.ts` | Navbar, language switcher, theme toggle, carousel, flip card, hamburger menu, external links |

## Browsers

Tests run across:

- Desktop: Chromium, Firefox, WebKit (Safari)
- Mobile: Pixel 7 (Chrome), iPhone 14 (Safari)

## Running locally

```bash
# Install dependencies
npm install
npx playwright install --with-deps

# Run all tests (headless)
npm test

# Run with visible browser
npm run test:headed

# Interactive UI — action timeline, screenshots, run tests individually
npm run test:ui

# Show HTML report from last run
npm run report
```

## CI/CD

Watchdog runs automatically in three ways:

1. **After every portfolio deploy** — portfolio repo sends a `repository_dispatch` event after a successful GitHub Pages deployment
2. **Daily at 07:00 UTC** — fallback health check
3. **Manually** — Actions → Portfolio Watchdog → Run workflow

Results and Playwright reports are available in the **Actions** tab, retained for 14 days.

## Playwright MCP

For local test development, a [Playwright MCP server](https://github.com/microsoft/playwright-mcp) is configured (`.mcp.json`). When the project is open in Claude Code, Claude can directly control the browser — navigate, click, read the DOM — to help write or debug tests.

## Structure

```
tests/
  smoke.spec.ts         # Basic health check
  accessibility.spec.ts # Accessibility
  navigation.spec.ts    # Interactivity and navigation
playwright.config.ts    # Browser and environment config
.github/
  workflows/
    watchdog.yml        # GitHub Actions workflow
.mcp.json               # Playwright MCP for Claude Code
```
