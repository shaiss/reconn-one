# ReconnOne — Claude Code Guide

## Project
Vite + React + TypeScript SPA. 4 onboarding screens + 7 CRM screens.
Reference HTML files in `docs/` — always read the relevant reference before implementing a screen.

## Key Rule: Token Translation
All `docs/` reference files use older token names. Translate using this table before writing any Tailwind classes:

| Use this (our config) | Reference file uses | Hex |
|---|---|---|
| `brand` | `primary` | `#14532D` |
| `brand-light` | `primary-container` | `#DCFCE7` |
| `brand-muted` | `inverse-primary`, `accent` | `#22C55E` |
| `surface` | `surface` | `#FFFFFF` |
| `surface-subtle` | `surface-container-low`, `background-light`, `background` | `#F8FAFC` |
| `surface-muted` | `surface-container`, `surface-dim`, `secondary-container` | `#F1F5F9` |
| `surface-strong` | `surface-container-high` | `#E2E8F0` |
| `border` | `outline`, `border-color`, `border` | `#E2E8F0` |
| `text-base` | `on-surface`, `text-main`, `text`, `on-background` | `#0F172A` |
| `text-muted` | `on-surface-variant`, `muted` | `#64748B` |
| `text-secondary` | `secondary` | `#334155` |
| `danger` | `error`, `alert` | `#B91C1C` |
| `danger-light` | `error-container` | `#FEE2E2` |
| `info` | `tertiary` | `#0369A1` |
| `score-positive-bg` | `score-good-bg` | `#F0FDF4` |
| `score-positive-text` | `score-good-text` | `#166534` |
| `score-positive-border` | `score-good-border` | `#BBF7D0` |
| `score-neutral-bg` | `score-warn-bg`, `surface-muted` | `#F1F5F9` |
| `score-neutral-text` | `score-warn-text` | `#475569` |
| `score-neutral-border` | `score-warn-border` | `#CBD5E1` |

## Fonts
- **Onboarding screens:** `font-sans` (Inter)
- **CRM screens headings:** `font-heading` (Instrument Sans, tracking-tight)
- **CRM screens body:** `font-body` (Geist)
- **CRM data/scores/IDs:** `font-mono` (JetBrains Mono)

## Border Radius
- **CRM screens:** `rounded` (2px, sharp) for most elements
- **Onboarding screens:** `rounded-lg` (8px) for cards, `rounded-xl` (12px) for large cards, `rounded-full` for pills

## Icons
Material Symbols Outlined via Google Fonts. Usage:
```html
<span className="material-symbols-outlined">icon_name</span>
```
Use `style={{ fontVariationSettings: "'FILL' 1" }}` for filled variant.

## Layouts
- `OnboardingLayout` — wraps all `/onboarding/*` routes
- `CRMLayout` — wraps Dashboard, Feed, Accounts, Deals, Settings
- `FocusedLayout` — wraps Dossier and Decision Maker Map (back-nav only)

## Routes
```
/                       → /onboarding/step-1
/onboarding/step-1      → Step1ProductContext
/onboarding/step-2      → Step2TargetPersonas
/onboarding/step-3      → Step3ICPDefinition
/onboarding/step-4      → Step4GrowthGoals
/crm/dashboard          → Dashboard
/crm/feed               → IntelligenceFeed
/crm/accounts           → AccountList
/crm/deals              → DealProgression
/crm/settings           → Settings
/crm/dossier/:accountId → DealReadyDossier
/crm/map/:accountId     → DecisionMakerMap
```
