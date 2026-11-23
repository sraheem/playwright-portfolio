# Project plan: Playwright + AI agent portfolio

Kickoff Mon Nov 23, 2026 · target finish Fri Dec 18, 2026 (4 weeks, ~8–10 hrs/week)

## Objectives

1. **Show a production-grade Playwright TypeScript framework.** Page Object Model, typed fixtures, UI and API layers, data-driven tests, and clean config a hiring manager can read in five minutes.
2. **Show CI/CD ownership.** Tests run in GitHub Actions on every push and nightly, with HTML reports, traces and a green status badge on the README.
3. **Close the AI-agent gap.** A Claude-powered agent reads failed CI runs, classifies each failure (product bug, test bug, flaky, environment) and flags flaky tests from run history.
4. **Close the MCP gap.** Expose the triage agent's tools as an MCP server, so Claude Code or Claude Desktop can ask "why did last night's run fail?"
5. **Make it interview-ready.** A README that tells the story (problem, design decisions, trade-offs), plus a 2-minute demo GIF and talking points tied to QA Lead postings.

## Success criteria

- 25+ meaningful tests across UI, API and accessibility; full suite under 2 minutes in CI.
- Nightly CI green, with any flaky test caught by the agent rather than by hand.
- Agent output: a Markdown triage summary posted to the GitHub Actions job summary.
- MCP server usable from Claude Code with a one-line config.
- Repo public on GitHub, pinned on profile, linked from LinkedIn and resume.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI target | Sauce Demo (saucedemo.com) | Stable public demo, login/cart/checkout flows, `data-test` ids |
| API target | Restful Booker | Public CRUD API with token auth |
| Framework | Playwright Test 1.63 + TypeScript | Matches current SDET postings |
| CI | GitHub Actions | Free for public repos, artifacts for reports/traces |
| Agent | Claude API (TypeScript SDK) | Failure triage and flaky-test detection |
| MCP | `@modelcontextprotocol/sdk` | Exposes triage tools to Claude Code/Desktop |

## Weekly plan

### Week 1 (Nov 23–29): Framework foundation
- [x] Scaffold project: TypeScript, Playwright config with `ui-chromium` and `api` projects
- [x] Page objects: Login, Inventory, Cart, Checkout; custom fixtures (`loggedIn`)
- [x] UI tests: login (positive, locked-out, data-driven negatives, auth guard), cart, sorting, checkout end to end
- [x] API tests: typed `BookingClient`, create/read, full CRUD with auth, negative auth cases
- [x] GitHub Actions workflow (matrix per project, nightly schedule, report/trace artifacts)
- [x] Create public GitHub repo and push
- [x] Confirm first green CI run (Nov 23)
- [x] Add README status badge

### Week 2 (Nov 30–Dec 6): Depth and polish
- [ ] Accessibility checks with `@axe-core/playwright` (fits AODA/WCAG background)
- [ ] Visual regression snapshot for inventory page
- [ ] Network mocking example (`page.route`) for an error state
- [ ] Auth state reuse via `storageState` setup project
- [ ] Firefox + WebKit projects; mobile viewport project
- [ ] ESLint + Prettier, `npm run lint` in CI
- [ ] Optional: publish HTML report to GitHub Pages

### Week 3 (Dec 7–13): Claude failure-triage agent
- [ ] `agent/` package: parse `test-results/results.json` + error-context files
- [ ] Prompt Claude to classify each failure and suggest a fix; structured JSON output
- [ ] Flaky detection: tests that passed on retry, plus pass/fail history across runs
- [ ] CI step: run agent only on failure, write summary to `$GITHUB_STEP_SUMMARY`
- [ ] `ANTHROPIC_API_KEY` as a GitHub secret; cap spend with small model and token limits
- [ ] Seed a deliberately flaky test branch to demo the agent

### Week 4 (Dec 14–18): MCP server and launch
- [ ] `mcp-server/`: tools `list_runs`, `get_failures`, `triage_failure`, `flaky_report`
- [ ] Document Claude Code config (`claude mcp add ...`) and record demo GIF
- [ ] README: architecture diagram, design decisions, how to run, what I would do at scale
- [ ] Pin repo on GitHub; add to LinkedIn Featured and resume (Track A)
- [ ] Write 5 interview talking points from the project

## Risks

| Risk | Mitigation |
| --- | --- |
| Public demo sites go down or change | Env-configurable base URLs; nightly run catches it; agent should classify as "environment" |
| Restful Booker is shared, data can be mutated by others | Each test creates its own booking; unique last names |
| Claude API cost | Run agent only on failure; small model; token limit |
| Scope creep | Weeks 1, 3 and 4 are the must-haves; Week 2 items are optional polish |
