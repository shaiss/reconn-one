# ReconnOne

A **Vite + React + TypeScript** starter for a **multi-step sales funnel** and the **downstream workspace** sellers use after qualification: one app, two layout systems, and a small set of reusable UI primitives you can re-skin for any industry.

The demo copy and sample data are placeholders. **Swap routes, fields, and API modules** for your vertical— the structure is the reusable part.

## What you get (framework, not content)

| Layer | Purpose |
|-------|---------|
| **Onboarding funnel** | Linear `step-1` → `step-4` flow under a dedicated layout—ideal for ICP capture, qualification questions, and handoff into the “logged-in” experience. |
| **CRM-style workspace** | Shared shell with navigation: overview, signal stream, account list, pipeline, settings, plus **focused** routes (detail views with minimal chrome). |
| **Three layouts** | `OnboardingLayout` (wizard), `CRMLayout` (persistent app chrome), `FocusedLayout` (single-task / back-nav only). |
| **Routing** | `react-router-dom` with nested routes; easy to rename paths or add stages without changing layout code. |
| **Design system** | Tailwind CSS with semantic tokens (brand, surface, text, scores). Swap tokens to rebrand for another industry in one pass. |
| **UI primitives** | Radix-based **tabs**, **accordion**, **switch** under `src/components/ui/`; app-level building blocks such as **PageHeader**, **SectionPanel**, **StatCard**, **ScoreBadge**, **SignalBadge**, **Badge**, **Logo**. |
| **Persistence pattern** | In-browser **SQLite (sql.js)** illustrates local-first or demo persistence—replace with your API or auth-backed store when you go beyond prototypes. |
| **Data integrations (optional)** | `src/lib/api/` holds typed HTTP clients. Use them as a pattern for your own endpoints; keys and providers live in `.env` / `.env.example` (see there—nothing industry-specific is required to run the shell). |

## Requirements

- **Node.js** 20+ (LTS recommended)  
- **npm** 10+

## Quick start

```bash
git clone <repository-url>
cd reconn-one
cp .env.example .env   # optional: only if you enable external APIs
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**After `git pull`:** run `npm install` again whenever `package.json` / the lockfile change (for example a merged PR that adds a dependency). Otherwise Vite may fail to resolve new imports.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (watch) |
| `npm run test:run` | Vitest once (CI-friendly) |

## Project layout

| Path | Role |
|------|------|
| `src/App.tsx` | Route table—funnel steps vs workspace routes |
| `src/layouts/` | Onboarding, CRM, and focused shells |
| `src/features/onboarding/` | Step screens (replace content; keep step flow) |
| `src/features/crm/` | Workspace screens (lists, feeds, detail views) |
| `src/components/` | Shared presentation components + `ui/` primitives |
| `src/lib/` | App DB helper, optional API clients, shared types |

## Customizing for another industry

1. **Rename routes** in `App.tsx` and adjust layouts if you add/remove funnel stages.  
2. **Replace copy and mock data** inside `src/features/**`—components are mostly presentational.  
3. **Retheme** via Tailwind theme tokens / `index.css` (keep the semantic names for less churn).  
4. **Wire your stack**: swap `src/lib/api/` for your CRM, enrichment, or scoring services; use env vars only for secrets (prefer a backend proxy in production).

## Deployment (Vercel)

Production: **[reconn-one.vercel.app](https://reconn-one.vercel.app)**  
Repo: **[github.com/shaiss/reconn-one](https://github.com/shaiss/reconn-one)**

```bash
vercel link --yes --project reconn-one --scope <your-team-slug>
vercel deploy --prod --yes --scope <your-team-slug>
vercel git connect --yes --scope <your-team-slug>   # if Git is not connected yet
```

Set any **`VITE_*`** variables your integrations need under **Vercel → Project → Settings → Environment Variables** (mirror `.env.example`).

## Contributing

1. Branch from your default branch (`main` or `master`).  
2. Run `npm run lint` and `npm run test:run` before opening a PR.  
3. Do not commit `.env` or secrets.

## License

Private / all rights reserved unless otherwise specified by the repository owner.
