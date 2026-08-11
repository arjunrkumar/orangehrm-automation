# OrangeHRM Test Automation

Automated end-to-end test suite for [OrangeHRM](https://opensource-demo.orangehrmlive.com/), a real-world open-source HR management system, built with Playwright and JavaScript.

## Tech Stack

- **Playwright** (JavaScript) — test framework
- **Page Object Model** — one page object per screen/module
- **GitHub Actions** — CI/CD, runs on every push and PR
- **Chrome** (`channel: 'chrome'`) — configured to use system-installed Chrome rather than Playwright's bundled browsers, for macOS Monterey compatibility

## Project Structure

orangehrm-automation/
├── .github/workflows/ # CI pipeline
├── pages/ # Page Object Model classes
│ ├── LoginPage.js
│ ├── PIMPage.js
│ └── AddEmployeePage.js
├── tests/ # Test specs
│ ├── login.spec.js
│ └── pim.spec.js
└── playwright.config.js


## Modules Covered

**Login**
- Valid login redirects to dashboard
- Invalid credentials show an error message
- Empty-field client-side validation

**PIM (Personnel Information Management)**
- Creates a new employee and verifies success via three checkpoints: the app's confirmation toast, the post-save URL redirect, and the employee's name rendering on their profile page
- Searches for the newly created employee and verifies they appear in the results

## Notable Engineering Decisions

- **Unique test data per run.** The demo is a shared public instance other people (and other runs of this suite) are also using. Employee names are suffixed with `Date.now()` to avoid collisions and false positives from stale data.
- **Documented locator compromise.** OrangeHRM's Employee ID field has no `id`, `name`, or accessible label — confirmed via DevTools and Playwright's own locator inspector, not assumed. Where no semantic locator exists, a positional fallback is used and explicitly commented in code, rather than left unexplained.
- **CI-specific worker configuration.** Running multiple tests in parallel against a shared Admin login caused session interference that never appeared in local runs. Workers are capped to 1 in CI (`process.env.CI`) while keeping full parallelism locally.
- **Layered assertions for diagnosability.** Rather than one broad assertion after a save action, checks are split into sequential steps (toast → URL → rendered heading) so a failure points to *where* in the flow something broke, not just *that* something broke.

## Running Locally

```bash
npm install
npx playwright install chrome
npx playwright test --project=chrome
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions. `main` is protected — merges require the test suite to pass.
