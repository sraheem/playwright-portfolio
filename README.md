# Playwright TypeScript Portfolio

End-to-end UI and API test automation in **Playwright + TypeScript**, run in **GitHub Actions**, with a Claude-powered failure-triage agent and MCP server (in progress — see [PLAN.md](PLAN.md)).

<!-- Badge: replace OWNER/REPO after the first push -->
<!-- ![Playwright tests](https://github.com/OWNER/REPO/actions/workflows/playwright.yml/badge.svg) -->

## What's covered

| Suite | Target | Tests |
| --- | --- | --- |
| UI (`tests/ui`) | [Sauce Demo](https://www.saucedemo.com) | Login (happy path, locked-out, data-driven negatives, auth guard), cart add/remove, price sorting, end-to-end checkout, checkout validation |
| API (`tests/api`) | [Restful Booker](https://restful-booker.herokuapp.com) | Health check, create/read, full CRUD with token auth, unauthorized update, bad credentials |

## Design

```
src/
  pages/        Page Object Model — one class per screen, locators by data-test id
  api/          Typed API client + test-data builder
  data/         Users and shopper data (public demo credentials)
  fixtures.ts   Custom fixtures: page objects injected into tests, `loggedIn` precondition
tests/
  ui/           Browser tests (project: ui-chromium)
  api/          API tests, no browser (project: api)
```

- **Page objects + fixtures** keep tests readable: `test('...', async ({ loggedIn, cartPage }) => ...)`.
- **Locators** use `getByTestId` / `getByRole`, not CSS chains, for resilience.
- **Data-driven negatives** are generated from a table, so new cases are one line.
- **API tests own their data**: each creates its own booking, so runs don't collide on a shared public API.
- **CI** runs UI and API as a matrix, retries twice, keeps traces on first retry, and uploads the HTML report.
- **JSON reporter** output (`test-results/results.json`) is the input for the triage agent.

## Run locally

```bash
npm ci
npx playwright install chromium
npm test              # everything
npm run test:ui       # UI only
npm run test:api      # API only
npm run test:smoke    # @smoke tagged
npm run report        # open the HTML report
```

Base URLs can be overridden with `UI_BASE_URL` and `API_BASE_URL`.
