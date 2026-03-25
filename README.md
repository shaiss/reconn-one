# ReconnOne

ReconnOne is a **Vite + React + TypeScript** single-page app: a short **onboarding** flow plus **CRM-style** screens (dashboard, intelligence feed, accounts, deals, settings, and focused views such as deal-ready dossier and decision-maker map).

## Requirements

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

## Quick start

```bash
git clone <repository-url>
cd reconn-one
cp .env.example .env
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Environment variables

Copy `.env.example` to `.env` and set optional keys:

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_NREL_API_KEY` | No* | NREL Developer Network — AFDC stations, utility rates, PVWatts (*needed for those features in the browser) |
| `VITE_ZAI_API_KEY` | No | Z.AI web search for unstructured signals (optional; exposed in the client bundle — use a backend proxy in production) |

Public federal/state APIs (EPA, FHWA, HUD, NY Open Data, etc.) need no key. See `.env.example` for notes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run (CI-friendly) |

## Project layout

| Path | Role |
|------|------|
| `src/features/onboarding/` | Onboarding steps |
| `src/features/crm/` | CRM screens (dashboard, feed, accounts, deals, dossier, map, settings) |
| `src/layouts/` | `OnboardingLayout`, `CRMLayout`, `FocusedLayout` |
| `src/lib/api/` | HTTP clients for external data sources |
| `src/lib/appDb.ts` | In-browser SQLite (sql.js) for demo persistence |

## Deployment (Vercel)

Production site: **[reconn-one.vercel.app](https://reconn-one.vercel.app)**

The project is linked to **[github.com/shaiss/reconn-one](https://github.com/shaiss/reconn-one)**. Pushes to the default branch trigger new production deployments when the Git integration is enabled in the Vercel dashboard.

**CLI (from this repo):**

```bash
vercel link --yes --project reconn-one --scope <your-team-slug>
vercel deploy --prod --yes --scope <your-team-slug>
vercel git connect --yes --scope <your-team-slug>   # if Git is not connected yet
```

Add **`VITE_NREL_API_KEY`** and **`VITE_ZAI_API_KEY`** under the project’s **Settings → Environment Variables** in [Vercel](https://vercel.com/) if you want those features in production (same names as in `.env.example`).

## Contributing

1. Create a branch from `main` (or `master`, depending on your default branch).
2. Run `npm run lint` and `npm run test:run` before opening a PR.
3. Do not commit `.env` or secrets.

## License

Private / all rights reserved unless otherwise specified by the repository owner.
