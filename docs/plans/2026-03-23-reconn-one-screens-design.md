# ReconnOne — Full Screen Build Design
**Date:** 2026-03-23
**Status:** Approved
**Scope:** Onboarding flow (4 screens) + CRM screens (7 screens)

---

## 1. Tech Stack

| Concern | Choice |
|---|---|
| Build tool | Vite |
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 (PostCSS, not CDN) |
| Icons | Material Symbols Outlined (Google Fonts) |
| Fonts — Onboarding | Inter (variable, 100–900) |
| Fonts — CRM | Instrument Sans + Geist + JetBrains Mono |
| Language | TypeScript |

---

## 2. File Structure

```
reconn-one/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── CLAUDE.md
├── src/
│   ├── main.tsx
│   ├── App.tsx                        # router setup, redirect / → /onboarding/step-1
│   ├── index.css                      # @tailwind directives + font imports + base
│   ├── assets/
│   │   └── logo.svg                   # ReconnOne radar-arc SVG mark
│   ├── components/
│   │   ├── Logo.tsx                   # mark + wordmark, size prop (sm | md)
│   │   ├── ScoreBadge.tsx             # monospace chip, color-coded ≥80 / <80
│   │   ├── Badge.tsx                  # generic status pill
│   │   └── ProTipCallout.tsx          # gray card with rotated bg icon (onboarding)
│   ├── layouts/
│   │   ├── OnboardingLayout.tsx       # step sidebar + topnav
│   │   ├── CRMLayout.tsx              # full nav sidebar + topnav
│   │   └── FocusedLayout.tsx          # back-strip only (dossier, map)
│   └── features/
│       ├── onboarding/
│       │   ├── Step1ProductContext.tsx
│       │   ├── Step2TargetPersonas.tsx
│       │   ├── Step3ICPDefinition.tsx
│       │   └── Step4GrowthGoals.tsx
│       └── crm/
│           ├── Dashboard.tsx
│           ├── IntelligenceFeed.tsx
│           ├── AccountList.tsx
│           ├── DealProgression.tsx
│           ├── DealReadyDossier.tsx
│           ├── DecisionMakerMap.tsx
│           └── Settings.tsx
```

---

## 3. Routing

```
/                          → redirect → /onboarding/step-1

/onboarding/step-1         → Step1ProductContext     [OnboardingLayout]
/onboarding/step-2         → Step2TargetPersonas     [OnboardingLayout]
/onboarding/step-3         → Step3ICPDefinition      [OnboardingLayout]
/onboarding/step-4         → Step4GrowthGoals        [OnboardingLayout]

/crm/dashboard             → Dashboard              [CRMLayout]
/crm/feed                  → IntelligenceFeed       [CRMLayout]
/crm/accounts              → AccountList            [CRMLayout]
/crm/deals                 → DealProgression        [CRMLayout]
/crm/settings              → Settings               [CRMLayout]

/crm/dossier/:accountId    → DealReadyDossier       [FocusedLayout]
/crm/map/:accountId        → DecisionMakerMap       [FocusedLayout]
```

---

## 4. Branding

**App name:** ReconnOne / RECONN.ONE
**Domain:** reconn.one
**Brand mark:** Minimal SVG radar/signal arc — two concentric quarter-circle arcs from a center dot, bottom-left origin pointing top-right. Renders at 20px (topnav) and 32px (sidebar). Forest green `#14532D` on white; white on dark.

---

## 5. Tailwind Token Map

All tokens use simplified conventional names. Reference HTML in `docs/` uses MD3 names — translate using this table.

| Token (our config) | MD3 name in docs | Hex |
|---|---|---|
| `brand` | `primary` | `#14532D` |
| `brand-light` | `primary-container` | `#DCFCE7` |
| `brand-muted` | `inverse-primary` / `accent` | `#22C55E` |
| `surface` | `surface` | `#FFFFFF` |
| `surface-subtle` | `surface-container-low` / `background-light` | `#F8FAFC` |
| `surface-muted` | `surface-container` / `surface-dim` | `#F1F5F9` |
| `surface-strong` | `surface-container-high` | `#E2E8F0` |
| `border` | `outline` / `border-color` / `border` | `#E2E8F0` |
| `text-base` | `on-surface` / `text-main` / `text` | `#0F172A` |
| `text-muted` | `on-surface-variant` / `muted` | `#64748B` |
| `text-secondary` | `secondary` | `#334155` |
| `danger` | `error` / `alert` | `#B91C1C` |
| `danger-light` | `error-container` | `#FEE2E2` |
| `info` | `tertiary` | `#0369A1` |
| `score-positive-bg` | `score-good-bg` | `#F0FDF4` |
| `score-positive-text` | `score-good-text` | `#166534` |
| `score-positive-border` | `score-good-border` | `#BBF7D0` |
| `score-neutral-bg` | `score-warn-bg` | `#F1F5F9` |
| `score-neutral-text` | `score-warn-text` | `#475569` |
| `score-neutral-border` | `score-warn-border` | `#CBD5E1` |

**Border radius:** CRM screens use `2px` sharp corners. Onboarding uses softer `4px–12px`. Both configured in `tailwind.config.ts`.

---

## 6. Layouts

### OnboardingLayout
- Fixed topnav `h-16`: Logo left, help icon + avatar right, `bg-white border-b border-border`
- Fixed sidebar `w-72 bg-surface-subtle border-r border-border`: "ONBOARDING / Setup Phase" label, 4 step nav items (active = white card + shadow), "Save Progress" CTA pinned bottom
- Main canvas `ml-72 bg-surface-subtle`: scrollable, `max-w-4xl mx-auto p-12`
- Active step derived from `useLocation()` — no prop drilling

### CRMLayout
- Fixed topnav `h-16`: Logo left, search bar, notifications + avatar right, `bg-white border-b border-border`
- Fixed sidebar `w-64 bg-surface-subtle border-r border-border`: "RECONN ONE / EV Division" label, 7 nav items, active = `bg-brand text-white`
- Main canvas `ml-64`: full width, each page manages own padding

### FocusedLayout
- Slim header `h-12 bg-white border-b border-border`: back arrow + breadcrumb (e.g. "← Acme Corp / Decision Maker Map")
- Full remaining height for canvas/content

---

## 7. Shared Components

| Component | Props | Notes |
|---|---|---|
| `Logo` | `size: 'sm' \| 'md'`, `variant: 'dark' \| 'light'` | SVG mark + "RECONN.ONE" text |
| `ScoreBadge` | `score: number` | ≥80 = positive tokens, <80 = neutral tokens, JetBrains Mono |
| `Badge` | `label: string`, `variant: string` | On Track / Delayed / High Risk / Funded etc. |
| `ProTipCallout` | `title: string`, `body: string`, `icon: string` | Onboarding only — gray card + rotated bg icon |

---

## 8. Font Strategy

**Onboarding screens** — Inter (variable, all weights)
**CRM screens** — Instrument Sans (headings, tracking -0.02em) + Geist (body, 14px) + JetBrains Mono (data, scores, IDs)

Both loaded via Google Fonts in `index.css`. Tailwind `fontFamily` config exposes `font-heading`, `font-body`, `font-mono`.

---

## 9. Build Phases

| Phase | Screens | Layout |
|---|---|---|
| 1 | Step 1–4 (Onboarding) | OnboardingLayout |
| 2 | Dashboard, Accounts, Deals, Feed, Settings | CRMLayout |
| 2 | Dossier, Decision Maker Map | FocusedLayout |
