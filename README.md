# armin_robotics_portfolio

This repository contains a Vite + React portfolio site (Armin Mehrvar). Below are concise instructions for deploying the site to GitHub Pages.

---

## Quick deploy to GitHub Pages (root site: `arminrobotics.github.io`)

1) Prepare your website files

- For a static site: ensure `index.html` and all assets (CSS/JS/images/fonts) are present.
- For a Vite/React project: build the production assets with:

```bash
pnpm install
pnpm build
```

The build output folder is `dist/` by default.

2) Upload to your GitHub repo (`arminrobotics.github.io`)

Option A — Upload built site files directly (simple, fast):
- If you want the repo to *serve the static files directly*, upload the contents of `dist/` into the repo root.
- Steps (manual via web UI):
  - Go to `https://github.com/arminrobotics/arminrobotics.github.io`
  - Click **Add file → Upload files**
  - Drag & drop the contents of `dist/` (not the `dist/` folder itself). Add `.nojekyll` at the root.
  - Commit changes.

Option B — Push source and let GitHub build (recommended for source-driven workflow):
- Keep `dist/` in `.gitignore`.
- Push your source to `main` and enable a GitHub Action to build & publish to Pages.

3) Enable GitHub Pages

- On GitHub, go to the repo **Settings → Pages** (or `Settings → Pages` in the new UI).
- Under **Source**, choose:
  - **Code** → **Deploy from a branch**
  - Branch: `main`
  - Folder: `/` (root)
- Click **Save**. GitHub will process the deployment (a few seconds to a minute).

4) Visit your live site

- URL: `https://arminrobotics.github.io`

---

## Notes & tips

- Keep `pnpm-lock.yaml` committed for reproducible installs.
- If you use Option A, add a file named `.nojekyll` at root before committing (prevents Jekyll processing of files).
- If you do not have SSH configured, use the HTTPS remote URL for pushes: `https://github.com/arminrobotics/arminrobotics.github.io.git`.
- Do not `git init` inside `~/` (your home) — that makes your entire home a repo. Use a dedicated folder (e.g., `~/projects/arminrobotics.github.io`) or clone the empty repo and copy files into it.

---

## How I integrated the animated background

- Component: `client/src/components/AnimatedBackground.tsx` (Canvas + requestAnimationFrame)
- CSS: `client/src/index.css` (grid overlay + vignette)
- Mounted globally in: `client/src/App.tsx`
- Pages changed to `bg-transparent` so the background shows through: `client/src/pages/Home.tsx`, `client/src/pages/NotFound.tsx`

If you want, I can perform the safe source import into `~/projects/arminrobotics.github.io` and push to your remote — or I can just walk you through the exact commands step-by-step.
