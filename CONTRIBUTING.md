# Contributing

Thank you for helping out. Issues and pull requests are welcome in English or Indonesian.

## Setting up the project

```bash
npm ci
cp .env.demo .env.local   # runs frontend-only, without a backend
npm run dev
```

## Before opening a pull request

```bash
npm run typecheck
npm run lint
npm test
```

If you change templates or Page Design elements, also run the template checks (requires Playwright and axe-core):

```bash
npm i --no-save playwright@1.63.0 axe-core@4.10.3 && npx playwright install chromium
npm run templates:gen && npm run templates:check
```

CI fails when there are **new** problems (overflow on phones, JavaScript errors, accessibility violations). If your change fixes a template, update the baseline with `npm run templates:baseline` and include `scripts/templates-ci/baseline.json` in the PR.

## Style

- Interface text always goes through `src/locales/id.json` and `en.json` (fill in both).
- Code comments are written in English.
- One component per file; files over about 600 lines should be split.
- New templates: follow the patterns in `src/pages/webTemplates/templates/` and test at widths 375, 768, and 1280.

## Contribution license

By submitting a contribution, you agree that it is released under the same license as the project (AGPL-3.0; templates are also covered by `LICENSE-TEMPLATES.md`).
