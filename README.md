# OrangeHRM Test Automation

Automated end-to-end test suite for [OrangeHRM](https://opensource-demo.orangehrmlive.com/), a real-world open-source HR management system, built with Playwright and JavaScript.

## Tech Stack

- **Playwright** (JavaScript) — test framework
- **Page Object Model** — one page object per screen/module
- **GitHub Actions** — CI/CD, runs on every push and PR
- **Chrome** (`channel: 'chrome'`) — configured to use system-installed Chrome rather than Playwright's bundled browsers, for macOS Monterey compatibility

## Project Structure

orangehrm-automation/
├── .github/workflows/     # CI pipeline
├── pages/                 # Page Object Model classes
│   ├── LoginPage.js
│   ├── PIMPage.js
│   ├── AddEmployeePage.js
│   └── LeavePage.js
├── tests/                 # Test specs
│   ├── login.spec.js
│   ├── pim.spec.js
│   └── leave.spec.js
└── playwright.config.js

## Modules Covered

**Login**
- Valid login redirects to dashboard
- Invalid credentials show an error message
- Empty-field client-side validation

**PIM (Personnel Information Management)**
- Creates a new employee and verifies success via three checkpoints: the app's confirmation toast, the post-save URL redirect, and the employee's name rendering on their profile page
- Searches for the newly created employee and verifies they appear in the results

**Leave**
- Applies for full-day leave with a dynamically computed date range
- Verifies the request was submitted via the app's confirmation toast
- Verifies the new request appears in My Leave, matched by leave type rather than exact date text (see engineering notes below)

## Notable Engineering Decisions

- **Unique test data per run.** The demo is a shared public instance other people (and other runs of this suite) are also using. Employee names are suffixed with `Date.now()`; leave requests use a pseudo-randomised date offset derived from `Date.now()`, since dates can't take a timestamp suffix the way names can.
- **Documented locator compromises.** Where no semantic locator exists (e.g. PIM's Employee Id field has no `id`, `name`, or accessible label — confirmed via DevTools and Playwright's locator inspector, not assumed), a positional fallback is used and explicitly commented in code, rather than left unexplained.
- **Scoped locators over ambiguous ones.** Playwright's `strict` mode rejects locators that match more than one element rather than silently picking the first — e.g. `getByRole('link', { name: 'Leave' })` matches four different nav links once inside the Leave module ("Leave", "My Leave", "Leave List", "Assign Leave"). Fixed with `exact: true` and, elsewhere, by scoping locators to a parent element via `hasText`.
- **A real app bug, worked around deliberately.** OrangeHRM's Apply Leave date fields inconsistently swap the day and month segments of entered dates — confirmed independently three ways: manual typing in the browser, the field's own validation error text, and the saved record's display in My Leave. Rather than fight this with more date-string patching, the Leave test asserts on the presence of a new request by leave type instead of exact date text, since that's what the test actually needs to prove and doesn't depend on OrangeHRM's own rendering bug.
- **CI-specific worker configuration.** Running multiple tests in parallel against a shared Admin login caused session interference that never appeared in local runs. Workers are capped to 1 in CI (`process.env.CI`) while keeping full parallelism locally.
- **Retries for a shared, uncontrolled environment.** Tests occasionally fail due to the public demo's availability or response time, not the automation itself. CI runs with 2 retries (`process.env.CI`) to absorb transient network/environment flakiness, while local runs stay retry-free so real bugs aren't masked during development.
- **Layered assertions for diagnosability.** Rather than one broad assertion after an action, checks are split into sequential steps (e.g. toast → URL → rendered heading for PIM) so a failure points to *where* in the flow something broke, not just *that* something broke.

## Running Locally

```bash
npm install
npx playwright install chrome
npx playwright test --project=chrome
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. `main` is protected — merges require the test suite to pass.
