# Deploying the demo mode (GitHub Pages / Vercel)

Demo mode is the frontend without a backend (`VITE_API_BASE_URL=off`): no accounts, credits, or plans; every template comes from the frontend's built-in catalog and all of them are free; only tools that run in the browser are available. The build output is a static site, so it can be hosted for free on GitHub Pages or Vercel.

This guide assumes the contents of the `fe/` folder are the repository root (`package.json` is at the root).

## Local build

```bash
npm ci
npm run build:demo      # uses .env.demo → dist/
npm run preview         # check at http://localhost:4173
```

## Vercel

1. Create a **new Vercel project** just for the demo: Add New → Project → choose the repository. If `package.json` is in a subfolder, set **Root Directory** to `fe`.
2. Under **Environment Variables**, add `VITE_API_BASE_URL` = `off`.
3. Click Deploy. `vercel.json` already configures the build, the SPA rewrite (every route to `index.html`), and the service worker cache headers.

Note: do not change the Build Command in the dashboard, because the `buildCommand` in `vercel.json` is used. Demo mode is set by the environment variable in step 2. The production site keeps using a separate Vercel project, with `VITE_API_BASE_URL` set to the backend URL.

## GitHub Pages

The workflow is already in `.github/workflows/deploy-pages.yml`.

1. Push the code to GitHub.
2. Open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Open **Actions → deploy-demo-pages → Run workflow**. When it finishes, the site is at `https://<name>.github.io/<repo>/`.

The workflow runs `npm test`, then `npm run build:demo`. The path prefix (`/<repo>/`) is filled in automatically from GitHub. Because GitHub Pages has no rewrites, the workflow copies `index.html` to `404.html` so that addresses such as `/<repo>/id/page-maker` still load when opened directly or refreshed.

Optional settings (Settings → Secrets and variables → Actions → Variables):

| Variable | Purpose |
|---|---|
| `DEMO_PAGES_AUTO` = `true` | Deploy automatically on every push to `main`/`master`. Without it, deploys only run through "Run workflow". |
| `DEMO_BASE_PATH` | Overrides the path prefix, for example `/` for a custom domain. |

If `package.json` is in an `fe/` subfolder, move the workflow to `.github/workflows/` at the repository root, then add `defaults: run: working-directory: fe` to the `build` job and change `path: dist` to `path: fe/dist`.

## Other hosts

Any other static host works too (Netlify, Cloudflare Pages, Nginx): run `npm run build:demo` and serve `dist/` with an SPA fallback to `index.html`. If the site is not at the domain root, set `VITE_BASE_PATH=/subfolder/` at build time.

## After templates change

When the template catalog grows or template content changes, run `npm run gen:demo` and commit the output (`src/demo/*.generated.ts`). The `src/demo/tests/demo.test.ts` test fails if you forget.
