# CRM Screens Design — 2026-03-25

## Context

7 CRM screens need to be implemented from reference HTML files in `docs/`. All screens are currently stubs. The project uses Vite + React + TypeScript + Tailwind v3 with a custom design token system (see CLAUDE.md for token translation table).

## Decisions

- **Interactivity:** Lightly interactive — static hardcoded data, working UI state (filters, toggles, panel open/close, canvas pan)
- **Component library:** shadcn/ui — installed and configured before screen work begins
- **Build strategy:** Shared components extracted first, then all 7 screens built in parallel via dispatched agents
- **Decision Maker Map:** Pannable canvas (mouse-drag to pan), no node drag-and-drop, click node to open right-side detail panel

## Phase 1 — shadcn/ui Setup

Install and configure shadcn/ui for the project. Map our design tokens to shadcn CSS variables. Install the specific components needed: `Badge`, `Card`, `Table`, `Tabs`, `Switch`, `Accordion`.

## Phase 2 — Shared Components

Build before any screens. Located in `src/components/`.

| Component | Props | Used In |
|---|---|---|
| `StatCard` | `label`, `value`, `trend?` | Dashboard, Deal Progression |
| `PageHeader` | `title`, `subtitle?`, `children?` (action slot) | All 5 CRMLayout screens |
| `SignalBadge` | `type` (enum of signal types) | Dashboard, Feed, Account List, Dossier |
| `SectionPanel` | `title?`, `action?`, `children` | Dashboard, Account List, Settings, Dossier |
| `ToggleSwitch` | wraps shadcn `Switch` with label | Settings |

Existing: `ScoreBadge`, `Badge`, `Logo`, `ProTipCallout` — reused as-is.

## Phase 3 — CRM Screens (parallel)

### Dashboard — Pipeline Pulse (`/crm/dashboard`)
- **Layout:** `PageHeader` + 3-col `StatCard` grid + `SectionPanel` with search-filtered `Table`
- **State:** `searchQuery` string filters table rows by account name
- **shadcn:** `Table`, `Badge`
- **Ref:** `docs/4 missing screens/dashboard_pipeline_pulse/code.html`

### Intelligence Feed (`/crm/feed`)
- **Layout:** `PageHeader` + 640px centered column + `Tabs` filter + list of feed cards
- **State:** `activeTab` filters signal type (All / Regulatory / Exec / Fleet / Financial)
- **shadcn:** `Tabs`, `Badge`
- **Ref:** `docs/4 missing screens/intelligence_feed/code.html`

### Account List (`/crm/accounts`)
- **Layout:** `PageHeader` + `SectionPanel` with `Table` + two bento cards below
- **State:** Row click navigates to `/crm/dossier/:accountId`
- **shadcn:** `Table`, `Badge`, `Card`
- **Ref:** `docs/account_list_portfolio/code.html`

### Deal Progression (`/crm/deals`)
- **Layout:** `PageHeader` + 4-col stats bar + horizontal-scroll kanban board
- **State:** None (visual only)
- **shadcn:** `Badge`, `Card`
- **Ref:** `docs/deal_progression_tracker/code.html`

### Settings & Integrations (`/crm/settings`)
- **Layout:** `PageHeader` + 2-col grid (main content + right sidebar)
- **State:** Each integration `Switch` has independent `enabled` boolean
- **shadcn:** `Card`, `Switch`, `Badge`
- **Ref:** `docs/settings_integrations/code.html`

### Deal-Ready Dossier (`/crm/dossier/:accountId`) — FocusedLayout
- **Layout:** 3-column masonry (25% / 50% / 25%)
- **State:** `selectedStakeholder` for highlight; `Accordion` for talk track sections
- **shadcn:** `Card`, `Badge`, `Accordion`
- **Ref:** `docs/4 missing screens/deal_ready_dossier/code.html`

### Decision Maker Map (`/crm/map/:accountId`) — FocusedLayout
- **Layout:** Full-height pannable canvas with CSS grid background + absolute node cards + SVG connectors + right detail panel
- **State:** `panOffset {x, y}` (mouse drag), `selectedNodeId` (click to open panel)
- **Canvas interaction:** `onMouseDown` → set `isDragging`, `onMouseMove` → update `panOffset`, `onMouseUp` → clear drag
- **shadcn:** `Card`, `Badge`
- **Ref:** `docs/4 missing screens/decision_maker_map/code.html`

## Token Translation

All reference files use old token names. Always translate per CLAUDE.md table before writing any Tailwind class. Key examples:
- `primary` → `brand`
- `background-light` / `surface-container-low` → `surface-subtle`
- `on-surface` / `text-main` → `text-base`
- `muted` / `on-surface-variant` → `text-muted`
- `outline` / `border-color` → `border`

## Font Rules (CRM screens)
- Headings: `font-heading` (Instrument Sans, `tracking-tight`)
- Body: `font-body` (Geist)
- Data/scores/IDs/amounts: `font-mono` (JetBrains Mono)

## Border Radius
- All CRM elements: `rounded` (2px, sharp/flat design)
