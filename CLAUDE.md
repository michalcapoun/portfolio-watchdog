# Portfolio Watchdog

E2E a API testy pro michalcapoun.cz.

## Stack

- **Playwright** + TypeScript — E2E testy
- **@axe-core/playwright** — accessibility kontroly
- **Playwright MCP** — lokální browser pro Claude Code (`.mcp.json`)

## Struktura testů

```
tests/
  smoke.spec.ts        # Načtení stránky, HTTP 200, chybějící requesty
  accessibility.spec.ts # axe-core WCAG 2.0/2.1, alt texty, focus
  navigation.spec.ts   # Navbar, carousel, theme toggle, lang switch, flip karta, hamburger
```

## Spuštění

```bash
npm install
npx playwright install --with-deps

npm test                # všechny browsery
npm run test:headed     # s viditelným browserem
npm run test:ui         # interaktivní UI
```

## Browsery

Chromium, Firefox, WebKit (Safari), Pixel 7 (mobile Chrome), iPhone 14 (mobile Safari).

## CI/CD – napojení na portfolio repo

Watchdog se spouští automaticky po deployi portfolia přes `repository_dispatch`.

### Postup nastavení

1. Vytvoř **PAT token** na GitHubu: Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Repository access: `michalcapoun/portfolio-watchdog`
   - Permissions: Actions → Read and write

2. Přidej token do **portfolio repa** jako secret: Settings → Secrets → `WATCHDOG_TOKEN`

3. Přidej tento krok na konec `.github/workflows/deploy.yml` v portfolio repu (za "Deploy to GitHub Pages"):

```yaml
      - name: Trigger watchdog
        if: success()
        run: |
          curl -X POST \
            -H "Authorization: token ${{ secrets.WATCHDOG_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/michalcapoun/portfolio-watchdog/dispatches \
            -d '{"event_type":"portfolio-deployed"}'
```

## Budoucí API testy

Přidat `tests/api.spec.ts` pro Cloudflare BE endpointy.
Doporučená struktura:

```typescript
import { test, expect, request } from '@playwright/test';

const API_BASE = process.env.API_BASE ?? 'https://api.michalcapoun.cz';

test('GET /health returns 200', async ({ request }) => {
  const res = await request.get(`${API_BASE}/health`);
  expect(res.status()).toBe(200);
});
```
