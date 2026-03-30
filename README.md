# portfolio-watchdog

Automatizované E2E testy pro [michalcapoun.cz](https://michalcapoun.cz). Spouštějí se po každém deployi portfolia a hlídají, že se nic nerozbilo.

## Stack

- **[Playwright](https://playwright.dev)** + TypeScript — E2E testování
- **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)** — automatická kontrola přístupnosti (WCAG 2.0/2.1)
- **GitHub Actions** — CI/CD, spouštění testů po každém deployi portfolia

## Co se testuje

| Soubor | Co pokrývá |
|--------|------------|
| `tests/smoke.spec.ts` | HTTP 200, načtení stránky, viditelnost sekcí, chybějící requesty, console errory |
| `tests/accessibility.spec.ts` | axe-core WCAG analýza, alt texty obrázků, keyboard focus |
| `tests/navigation.spec.ts` | Navbar, language switcher, theme toggle, carousel, flip karta, hamburger menu, external linky |

## Browsery

Testy běží napříč:

- Desktop: Chromium, Firefox, WebKit (Safari)
- Mobil: Pixel 7 (Chrome), iPhone 14 (Safari)

## Spuštění

```bash
# Instalace závislostí
npm install
npx playwright install --with-deps

# Spustit všechny testy (headless)
npm test

# Spustit s viditelným browserem
npm run test:headed

# Interaktivní UI — vidíš timeline akcí, screenshoty, můžeš spouštět testy jednotlivě
npm run test:ui

# Zobrazit HTML report z posledního runu
npm run report
```

## CI/CD

Watchdog se spouští automaticky třemi způsoby:

1. **Po každém deployi portfolia** — portfolio repo odešle `repository_dispatch` event po úspěšném nasazení na GitHub Pages
2. **Každý den v 7:00 UTC** — fallback health check
3. **Ručně** — Actions → Portfolio Watchdog → Run workflow

Výsledky a Playwright reporty jsou dostupné v záložce **Actions** na GitHubu, uchovávají se 14 dní.

## Playwright MCP

Pro lokální vývoj testů je nakonfigurovaný [Playwright MCP server](https://github.com/microsoft/playwright-mcp) (`.mcp.json`). Po otevření projektu v Claude Code může Claude přímo ovládat browser — navigovat, klikat, číst DOM — a pomáhat psát nebo debugovat testy.

## Struktura

```
tests/
  smoke.spec.ts         # Základní health check
  accessibility.spec.ts # Přístupnost
  navigation.spec.ts    # Interaktivita a proklikání
playwright.config.ts    # Konfigurace browserů a prostředí
.github/
  workflows/
    watchdog.yml        # GitHub Actions workflow
.mcp.json               # Playwright MCP pro Claude Code
```
