# ReconnOne Screens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the full ReconnOne app — 4 onboarding screens + 7 CRM screens — as a Vite + React + TypeScript + Tailwind CSS SPA with React Router v6.

**Architecture:** Domain-grouped features (`features/onboarding/`, `features/crm/`) share three layout shells (`OnboardingLayout`, `CRMLayout`, `FocusedLayout`). All screens are pixel-faithful ports of reference HTML files in `docs/`, translated to use the unified token names documented in `CLAUDE.md`.

**Tech Stack:** Vite 5, React 18, TypeScript, React Router v6, Tailwind CSS v3 (PostCSS), Vitest, @testing-library/react, Material Symbols Outlined (Google Fonts), Inter + Instrument Sans + Geist + JetBrains Mono.

**Reference files:** Every screen has a reference HTML file in `docs/`. Always open the reference file for the screen you are building before writing a line of code. Token translation table is in `CLAUDE.md`.

---

## Phase 0 — Project Setup

### Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`

**Step 1: Scaffold**

```bash
cd "C:\Users\Shai\Documents\Code Workspaces\reconn-one"
npm create vite@latest . -- --template react-ts
```
Select: React → TypeScript. Overwrite existing files when prompted.

**Step 2: Install runtime deps**

```bash
npm install react-router-dom
```

**Step 3: Install dev deps**

```bash
npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/forms vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Step 4: Init Tailwind**

```bash
npx tailwindcss init -p
```
This creates `tailwind.config.js` and `postcss.config.js`. We'll rename/replace both next.

**Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server at `http://localhost:5173`. Kill with Ctrl+C.

**Step 6: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold vite react ts project"
```

---

### Task 2: Configure Tailwind, PostCSS, and Vitest

**Files:**
- Create: `tailwind.config.ts` (replaces `.js`)
- Modify: `postcss.config.js`
- Modify: `vite.config.ts`
- Delete: `tailwind.config.js`

**Step 1: Delete the generated JS config**

```bash
rm tailwind.config.js
```

**Step 2: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#14532D',
        'brand-light': '#DCFCE7',
        'brand-muted': '#22C55E',
        surface: '#FFFFFF',
        'surface-subtle': '#F8FAFC',
        'surface-muted': '#F1F5F9',
        'surface-strong': '#E2E8F0',
        border: '#E2E8F0',
        'text-base': '#0F172A',
        'text-muted': '#64748B',
        'text-secondary': '#334155',
        danger: '#B91C1C',
        'danger-light': '#FEE2E2',
        info: '#0369A1',
        'score-positive-bg': '#F0FDF4',
        'score-positive-text': '#166534',
        'score-positive-border': '#BBF7D0',
        'score-neutral-bg': '#F1F5F9',
        'score-neutral-text': '#475569',
        'score-neutral-border': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Instrument Sans"', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [forms],
} satisfies Config
```

**Step 3: Verify `postcss.config.js`** — should already contain:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 4: Update `vite.config.ts` to add Vitest**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

**Step 5: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

**Step 6: Add test script to `package.json`** — in the `"scripts"` section add:

```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: configure tailwind, postcss, vitest"
```

---

### Task 3: Base CSS, fonts, and Logo SVG

**Files:**
- Modify: `src/index.css`
- Create: `src/assets/logo.svg`
- Modify: `index.html`

**Step 1: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Instrument+Sans:wght@500;600&family=Geist:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

@layer base {
  body {
    @apply bg-surface-subtle text-text-base antialiased;
  }
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
}
```

**Step 2: Create `src/assets/logo.svg`**

```svg
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="3" cy="21" r="1.5" fill="currentColor"/>
  <path d="M 10 21 A 7 7 0 0 0 3 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M 16 21 A 13 13 0 0 0 3 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
</svg>
```

**Step 3: Update `index.html` title and remove default Vite meta**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/assets/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReconnOne</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: add base css, google fonts, logo svg"
```

---

### Task 4: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

**Step 1: Create `CLAUDE.md`**

```markdown
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
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with token map and project conventions"
```

---

## Phase 1 — Foundation

### Task 5: Shared components

**Files:**
- Create: `src/components/Logo.tsx`
- Create: `src/components/ScoreBadge.tsx`
- Create: `src/components/Badge.tsx`
- Create: `src/components/ProTipCallout.tsx`
- Create: `src/components/__tests__/Logo.test.tsx`
- Create: `src/components/__tests__/ScoreBadge.test.tsx`

**Step 1: Write failing tests**

`src/components/__tests__/Logo.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Logo } from '../Logo'

test('renders wordmark text', () => {
  render(<Logo />)
  expect(screen.getByText('RECONN.ONE')).toBeInTheDocument()
})

test('renders svg mark', () => {
  const { container } = render(<Logo />)
  expect(container.querySelector('svg')).toBeInTheDocument()
})
```

`src/components/__tests__/ScoreBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ScoreBadge } from '../ScoreBadge'

test('renders score value', () => {
  render(<ScoreBadge score={92} />)
  expect(screen.getByText('92')).toBeInTheDocument()
})

test('applies positive classes for score >= 80', () => {
  const { container } = render(<ScoreBadge score={85} />)
  const el = container.firstChild as HTMLElement
  expect(el.className).toContain('score-positive')
})

test('applies neutral classes for score < 80', () => {
  const { container } = render(<ScoreBadge score={67} />)
  const el = container.firstChild as HTMLElement
  expect(el.className).toContain('score-neutral')
})
```

**Step 2: Run tests — expect FAIL**

```bash
npm run test:run
```
Expected: FAIL — cannot find module `../Logo`, `../ScoreBadge`

**Step 3: Create `src/components/Logo.tsx`**

```tsx
import logoSvg from '../assets/logo.svg'

interface LogoProps {
  size?: 'sm' | 'md'
  variant?: 'dark' | 'light'
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'
  const textSize = size === 'sm' ? 'text-sm' : 'text-lg'
  const color = variant === 'light' ? 'text-white' : 'text-brand'

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <img src={logoSvg} alt="" className={`${iconSize} [filter:_brightness(0)_saturate(100%)_invert(16%)_sepia(60%)_saturate(800%)_hue-rotate(115deg)_brightness(90%)]`} />
      <span className={`${textSize} font-black tracking-tighter uppercase font-sans`}>
        RECONN.ONE
      </span>
    </div>
  )
}
```

> Note: The CSS filter converts the SVG to brand green. For `variant='light'` we need a white version — add a conditional filter or use two separate SVG imports. For now, dark variant is sufficient for Phase 1.

**Step 4: Create `src/components/ScoreBadge.tsx`**

```tsx
interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const isPositive = score >= 80
  const classes = isPositive
    ? 'bg-score-positive-bg text-score-positive-text border-score-positive-border'
    : 'bg-score-neutral-bg text-score-neutral-text border-score-neutral-border'

  return (
    <span
      className={`inline-flex items-center justify-center font-mono text-[11px] font-medium px-2 py-1 rounded border w-[48px] ${classes}`}
    >
      {score}
    </span>
  )
}
```

**Step 5: Create `src/components/Badge.tsx`**

```tsx
interface BadgeProps {
  label: string
  variant?: 'positive' | 'neutral' | 'danger' | 'funded' | 'muted'
}

const variantClasses: Record<string, string> = {
  positive: 'bg-brand-light text-brand border-brand-light',
  neutral: 'bg-surface-strong text-text-base border-surface-strong',
  danger: 'bg-danger text-white border-danger',
  funded: 'bg-brand text-white border-brand',
  muted: 'bg-surface-muted text-text-muted border-border',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border rounded ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}
```

**Step 6: Create `src/components/ProTipCallout.tsx`**

```tsx
interface ProTipCalloutProps {
  title?: string
  body: string
  icon?: string
}

export function ProTipCallout({ title = 'Pro Tip', body, icon = 'lightbulb' }: ProTipCalloutProps) {
  return (
    <div className="bg-surface-muted rounded-xl p-6 relative overflow-hidden border border-border">
      <span
        className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-200 rotate-12 select-none"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">{title}</p>
        <p className="text-sm text-text-muted leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
```

**Step 7: Run tests — expect PASS**

```bash
npm run test:run
```
Expected: PASS — all 5 assertions green.

**Step 8: Commit**

```bash
git add src/components
git commit -m "feat: add shared components Logo, ScoreBadge, Badge, ProTipCallout"
```

---

### Task 6: Three layouts

**Files:**
- Create: `src/layouts/OnboardingLayout.tsx`
- Create: `src/layouts/CRMLayout.tsx`
- Create: `src/layouts/FocusedLayout.tsx`
- Create: `src/layouts/__tests__/OnboardingLayout.test.tsx`
- Create: `src/layouts/__tests__/CRMLayout.test.tsx`

**Step 1: Write failing layout tests**

`src/layouts/__tests__/OnboardingLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OnboardingLayout } from '../OnboardingLayout'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/onboarding/step-1']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route path="step-1" element={<div>Step 1 Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

test('renders RECONN.ONE wordmark', () => {
  render(<Wrapper />)
  expect(screen.getAllByText('RECONN.ONE').length).toBeGreaterThan(0)
})

test('renders all 4 onboarding nav items', () => {
  render(<Wrapper />)
  expect(screen.getByText('Product Context')).toBeInTheDocument()
  expect(screen.getByText('Target Personas')).toBeInTheDocument()
  expect(screen.getByText('ICP Definition')).toBeInTheDocument()
  expect(screen.getByText('Growth Goals')).toBeInTheDocument()
})

test('renders child route content via Outlet', () => {
  render(<Wrapper />)
  expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
})
```

`src/layouts/__tests__/CRMLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CRMLayout } from '../CRMLayout'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/crm/dashboard']}>
      <Routes>
        <Route path="/crm" element={<CRMLayout />}>
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

test('renders RECONN.ONE wordmark', () => {
  render(<Wrapper />)
  expect(screen.getAllByText('RECONN.ONE').length).toBeGreaterThan(0)
})

test('renders all CRM nav items', () => {
  render(<Wrapper />)
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
  expect(screen.getByText('Accounts')).toBeInTheDocument()
  expect(screen.getByText('Deals')).toBeInTheDocument()
})

test('renders child route content via Outlet', () => {
  render(<Wrapper />)
  expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
})
```

**Step 2: Run tests — expect FAIL**

```bash
npm run test:run
```
Expected: FAIL — cannot find module `../OnboardingLayout`, `../CRMLayout`

**Step 3: Create `src/layouts/OnboardingLayout.tsx`**

Reference: `docs/onboarding_product_context_step_1/code.html` — study the sidebar and topnav structure.

```tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

const steps = [
  { path: '/onboarding/step-1', label: 'Product Context', icon: 'analytics' },
  { path: '/onboarding/step-2', label: 'Target Personas', icon: 'group' },
  { path: '/onboarding/step-3', label: 'ICP Definition', icon: 'target' },
  { path: '/onboarding/step-4', label: 'Growth Goals', icon: 'trending_up' },
]

export function OnboardingLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Topnav */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-border shadow-sm">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-text-muted hover:text-brand cursor-pointer">help</span>
          <span className="material-symbols-outlined text-text-muted hover:text-brand cursor-pointer">notifications</span>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-xs font-bold text-text-secondary">
            AE
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-surface-subtle border-r border-border hidden lg:flex flex-col p-6 gap-y-4">
          <div className="mb-6">
            <div className="text-xs font-black tracking-[0.2em] text-brand uppercase mb-1">Onboarding</div>
            <div className="text-sm text-text-muted font-medium">Setup Phase</div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {steps.map((step) => (
              <NavLink
                key={step.path}
                to={step.path}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 px-4 py-3 bg-white text-brand rounded-lg shadow-sm border border-border font-semibold text-sm uppercase tracking-wide'
                    : 'flex items-center gap-3 px-4 py-3 text-text-muted hover:text-brand hover:bg-surface-muted rounded-lg transition-colors font-semibold text-sm uppercase tracking-wide'
                }
              >
                <span className="material-symbols-outlined text-xl">{step.icon}</span>
                <span>{step.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-border">
            <button className="w-full py-3 bg-brand text-white rounded-lg font-bold shadow-lg hover:bg-emerald-800 transition-all">
              Save Progress
            </button>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-4rem)] p-8 lg:p-12 bg-surface-subtle">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
```

**Step 4: Create `src/layouts/CRMLayout.tsx`**

Reference: `docs/account_list_portfolio/code.html` and `docs/deal_progression_tracker/code.html` — study sidebar nav items.

```tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

const navItems = [
  { path: '/crm/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/crm/dossier/acme', label: 'Dossier', icon: 'description' },
  { path: '/crm/map/acme', label: 'Decision Map', icon: 'account_tree' },
  { path: '/crm/feed', label: 'Intelligence', icon: 'sensors' },
  { path: '/crm/accounts', label: 'Accounts', icon: 'analytics' },
  { path: '/crm/deals', label: 'Deals', icon: 'handshake' },
  { path: '/crm/settings', label: 'Integrations', icon: 'settings_input_component' },
]

export function CRMLayout() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface-subtle border-r border-border w-64">
        <div className="p-6">
          <Logo size="sm" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mt-2">EV Charging Division</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 bg-brand text-white px-4 py-3 text-xs uppercase tracking-widest font-bold'
                  : 'flex items-center gap-3 text-text-secondary px-4 py-3 hover:bg-surface-strong transition-all text-xs uppercase tracking-widest font-bold'
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded bg-brand-light flex items-center justify-center text-brand font-bold text-xs">
              JD
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-base truncate">John Doe</p>
              <p className="text-[9px] text-text-muted">Admin Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 min-h-screen">
        {/* Topnav */}
        <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold tracking-tight text-brand font-heading md:hidden">RECONN.ONE</span>
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
              <input
                className="pl-10 pr-4 py-1.5 bg-surface-subtle border border-border rounded text-sm focus:ring-1 focus:ring-brand focus:border-brand w-72 outline-none"
                placeholder="Search accounts, deals..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-text-muted hover:bg-surface-subtle transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-text-muted hover:bg-surface-subtle transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs border border-border">
              JD
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}
```

**Step 5: Create `src/layouts/FocusedLayout.tsx`**

Reference: `docs/4 missing screens/deal_ready_dossier/code.html` header section.

```tsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export function FocusedLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive breadcrumb from path: /crm/dossier/acme-corp → "Acme Corp / Dossier"
  const pathParts = location.pathname.split('/').filter(Boolean)
  const screenLabel = pathParts[1] === 'dossier' ? 'Deal-Ready Dossier' : 'Decision Maker Map'
  const accountId = pathParts[2] ?? ''
  const accountLabel = accountId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <header className="h-12 bg-white border-b border-border flex items-center px-4 shrink-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-base transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="h-4 w-px bg-border mx-4" />
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-text-base text-sm">{accountLabel}</span>
          <span className="text-text-muted text-sm">/</span>
          <span className="text-text-base text-sm font-medium">{screenLabel}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
```

**Step 6: Run tests — expect PASS**

```bash
npm run test:run
```
Expected: PASS — all layout tests green.

**Step 7: Commit**

```bash
git add src/layouts
git commit -m "feat: add OnboardingLayout, CRMLayout, FocusedLayout"
```

---

### Task 7: App routing

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Replace `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 2: Replace `src/App.tsx`**

```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { OnboardingLayout } from './layouts/OnboardingLayout'
import { CRMLayout } from './layouts/CRMLayout'
import { FocusedLayout } from './layouts/FocusedLayout'
import { Step1ProductContext } from './features/onboarding/Step1ProductContext'
import { Step2TargetPersonas } from './features/onboarding/Step2TargetPersonas'
import { Step3ICPDefinition } from './features/onboarding/Step3ICPDefinition'
import { Step4GrowthGoals } from './features/onboarding/Step4GrowthGoals'
import { Dashboard } from './features/crm/Dashboard'
import { IntelligenceFeed } from './features/crm/IntelligenceFeed'
import { AccountList } from './features/crm/AccountList'
import { DealProgression } from './features/crm/DealProgression'
import { Settings } from './features/crm/Settings'
import { DealReadyDossier } from './features/crm/DealReadyDossier'
import { DecisionMakerMap } from './features/crm/DecisionMakerMap'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/step-1" replace />} />

      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route path="step-1" element={<Step1ProductContext />} />
        <Route path="step-2" element={<Step2TargetPersonas />} />
        <Route path="step-3" element={<Step3ICPDefinition />} />
        <Route path="step-4" element={<Step4GrowthGoals />} />
      </Route>

      <Route path="/crm" element={<CRMLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="feed" element={<IntelligenceFeed />} />
        <Route path="accounts" element={<AccountList />} />
        <Route path="deals" element={<DealProgression />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/crm" element={<FocusedLayout />}>
        <Route path="dossier/:accountId" element={<DealReadyDossier />} />
        <Route path="map/:accountId" element={<DecisionMakerMap />} />
      </Route>
    </Routes>
  )
}
```

**Step 3: Create placeholder components so App compiles**

Run this shell script to create all placeholder files at once:

```bash
mkdir -p src/features/onboarding src/features/crm

for name in Step1ProductContext Step2TargetPersonas Step3ICPDefinition Step4GrowthGoals; do
cat > "src/features/onboarding/${name}.tsx" << EOF
export function ${name}() {
  return <div className="p-8 text-text-base">${name} — coming soon</div>
}
EOF
done

for name in Dashboard IntelligenceFeed AccountList DealProgression Settings DealReadyDossier DecisionMakerMap; do
cat > "src/features/crm/${name}.tsx" << EOF
export function ${name}() {
  return <div className="p-8 text-text-base">${name} — coming soon</div>
}
EOF
done
```

**Step 4: Verify app compiles and routes work**

```bash
npm run dev
```
Navigate to `http://localhost:5173` — should redirect to `/onboarding/step-1` and show "Step1ProductContext — coming soon" inside the OnboardingLayout.

Navigate to `http://localhost:5173/crm/dashboard` — should show CRMLayout with "Dashboard — coming soon".

**Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx src/features
git commit -m "feat: wire up react router with all routes and placeholder screens"
```

---

## Phase 2 — Onboarding Screens

> **Before each screen:** Open its reference file in `docs/` and keep it visible while coding. Translate token names using `CLAUDE.md`. Use `font-sans` (Inter) throughout onboarding screens.

### Task 8: Step 1 — Product Context

**Reference:** `docs/onboarding_product_context_step_1/code.html`

**Files:**
- Modify: `src/features/onboarding/Step1ProductContext.tsx`
- Create: `src/features/onboarding/__tests__/Step1ProductContext.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step1ProductContext } from '../Step1ProductContext'

test('renders step heading', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Product Context')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
})

test('renders all product type options', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Hardware (Chargers, Connectors)')).toBeInTheDocument()
  expect(screen.getByText('Software (OCPP, Network Mgmt)')).toBeInTheDocument()
  expect(screen.getByText('Capital / Financing')).toBeInTheDocument()
})

test('renders continue button', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText(/Continue to Personas/i)).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

```bash
npm run test:run -- src/features/onboarding/__tests__/Step1ProductContext.test.tsx
```

**Step 3: Implement `Step1ProductContext.tsx`**

Port faithfully from the reference HTML. Key structure:
- Step badge: `"Step 1 of 4"` pill in `bg-brand-light text-brand rounded-full`
- H1: `"Product Context"` — `text-4xl font-extrabold tracking-tight`
- Subtitle paragraph
- White card with radio group (5 options: Hardware, Software, EPC, Maintenance, Capital)
  - Each option: white card with `border-2`, checked state uses `border-brand bg-brand-light/10`
  - Icon in `bg-surface-subtle` tile, radio dot top-right
- ProTipCallout below the card
- Footer: Back button (ghost) + Continue button (primary `bg-brand`)
- Continue navigates to `/onboarding/step-2` using `useNavigate`

Use `useState` for the selected radio value. Default: `'hardware'`.

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProTipCallout } from '../../components/ProTipCallout'

const options = [
  { id: 'hardware', icon: 'ev_charger', label: 'Hardware (Chargers, Connectors)', desc: 'Physical infrastructure deployment including Level 2 and DC Fast Charging units and auxiliary components.' },
  { id: 'software', icon: 'developer_board', label: 'Software (OCPP, Network Mgmt)', desc: 'Cloud-based platforms for charger monitoring, load balancing, and automated billing protocols.' },
  { id: 'epc', icon: 'construction', label: 'EPC / Installation Services', desc: 'End-to-end Engineering, Procurement, and Construction for utility-scale or commercial EV sites.' },
  { id: 'maintenance', icon: 'build', label: 'Service & Maintenance', desc: 'Ongoing operational support, preventive maintenance, and rapid response hardware repair.' },
  { id: 'financing', icon: 'account_balance', label: 'Capital / Financing', desc: 'Asset financing, leasing programs, and capital expenditure planning for fleet electrification.', wide: true },
]

export function Step1ProductContext() {
  const [selected, setSelected] = useState('hardware')
  const navigate = useNavigate()

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 1 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">Product Context</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          Define your core commercial offering to align our intelligence engine with your business model.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-border">
        <h2 className="text-xl font-bold text-text-base mb-8 flex items-center gap-2 font-sans">
          <span className="w-2 h-8 bg-brand rounded-full" />
          What do you sell?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`block cursor-pointer p-6 bg-white border-2 rounded-xl transition-all hover:border-brand-light ${
                opt.wide ? 'md:col-span-2 flex items-center gap-6' : ''
              } ${selected === opt.id ? 'border-brand bg-brand-light/10' : 'border-border'}`}
            >
              <input
                type="radio"
                name="product_type"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="hidden"
              />
              <div className={`p-3 bg-surface-subtle rounded-lg shrink-0 ${opt.wide ? '' : 'mb-4'}`}>
                <span className="material-symbols-outlined text-2xl text-text-muted">{opt.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-base mb-2 font-sans">{opt.label}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-sans">{opt.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                opt.wide ? '' : 'absolute top-6 right-6'
              } ${selected === opt.id ? 'border-brand bg-brand' : 'border-border'}`}>
                {selected === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-8">
        <ProTipCallout
          body="Choosing 'Hardware' will unlock specific logistics and supply chain analytical models in the Growth Goals phase."
        />
      </div>

      {/* Footer */}
      <div className="mt-12 flex justify-between items-center">
        <button className="px-6 py-3 text-text-muted font-semibold flex items-center gap-2 hover:text-text-base transition-colors font-sans">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <button
          onClick={() => navigate('/onboarding/step-2')}
          className="px-8 py-3 bg-brand text-white rounded-lg font-bold shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans"
        >
          Continue to Personas
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
```

**Step 4: Run tests — expect PASS**

```bash
npm run test:run -- src/features/onboarding/__tests__/Step1ProductContext.test.tsx
```

**Step 5: Visual check in browser**

```bash
npm run dev
```
Navigate to `http://localhost:5173/onboarding/step-1`. Compare against `docs/onboarding_product_context_step_1/screen.png`.

**Step 6: Commit**

```bash
git add src/features/onboarding
git commit -m "feat: implement onboarding step 1 product context"
```

---

### Task 9: Step 2 — Target Personas

**Reference:** `docs/account_onboarding_refined_personas/code.html`

**Files:**
- Modify: `src/features/onboarding/Step2TargetPersonas.tsx`
- Create: `src/features/onboarding/__tests__/Step2TargetPersonas.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step2TargetPersonas } from '../Step2TargetPersonas'

test('renders heading', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Who do you sell to?')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
})

test('renders persona cards', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Procurement Managers')).toBeInTheDocument()
  expect(screen.getByText('Site Developers')).toBeInTheDocument()
  expect(screen.getByText('Fleet Operations')).toBeInTheDocument()
  expect(screen.getByText('Sustainability Officers')).toBeInTheDocument()
  expect(screen.getByText('Capital Partners')).toBeInTheDocument()
})

test('renders continue button', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText(/Continue to ICP/i)).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

```bash
npm run test:run -- src/features/onboarding/__tests__/Step2TargetPersonas.test.tsx
```

**Step 3: Implement `Step2TargetPersonas.tsx`**

Port from reference. Key elements:
- Step badge `"Step 2 of 4"`
- H1: `"Who do you sell to?"`
- 3-column checkbox grid of persona cards (5 cards + 1 "Add Custom Persona" dashed card)
- Each card: checkbox (hidden, peer), icon tile, name, description. Selected state: `border-brand bg-brand/5`
- Multi-select with `useState<string[]>`
- Pro-tip callout (larger, with background image overlay) — use `ProTipCallout` and add the multi-stakeholder text
- Footer: Back → `/onboarding/step-1`, Continue → `/onboarding/step-3`

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const personas = [
  { id: 'procurement', icon: 'inventory_2', label: 'Procurement Managers', desc: 'CPOs and hardware leads managing vendor selection for charging stations and grid hardware.' },
  { id: 'developers', icon: 'location_city', label: 'Site Developers', desc: 'Leads for NEVI-funded projects, corridor buildouts, and commercial real estate electrification.' },
  { id: 'fleet', icon: 'local_shipping', label: 'Fleet Operations', desc: 'Logistics managers transitioning medium and heavy-duty vehicles to electric power systems.' },
  { id: 'sustainability', icon: 'eco', label: 'Sustainability Officers', desc: 'ESG executives focused on Scope 2 and 3 emissions, carbon tracking, and compliance.' },
  { id: 'capital', icon: 'account_balance', label: 'Capital Partners', desc: 'Project finance firms and lenders providing the debt/equity for large scale infrastructure.' },
]

export function Step2TargetPersonas() {
  const [selected, setSelected] = useState<string[]>(['developers'])
  const navigate = useNavigate()

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 2 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">Who do you sell to?</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          Emerald Intelligence optimizes your outreach by mapping your product value to specific stakeholders in the EV infrastructure ecosystem. Select all that apply.
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {personas.map((p) => {
          const active = selected.includes(p.id)
          return (
            <label
              key={p.id}
              className={`cursor-pointer group relative bg-white border-2 rounded-xl p-6 transition-all hover:shadow-md ${
                active ? 'border-brand bg-brand/5' : 'border-border hover:border-brand-light'
              }`}
            >
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggle(p.id)} />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-light/30 text-brand rounded-lg">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-brand border-brand' : 'border-border'}`}>
                  {active && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-base mb-2 font-sans">{p.label}</h3>
              <p className="text-sm text-text-muted leading-relaxed font-sans">{p.desc}</p>
            </label>
          )
        })}

        {/* Add Custom */}
        <button className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-text-muted hover:border-brand-muted hover:text-brand hover:bg-brand-light/10 transition-all">
          <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
          <span className="font-bold text-xs uppercase tracking-widest font-sans">Add Custom Persona</span>
        </button>
      </div>

      {/* Pro Tip */}
      <div className="bg-surface-muted rounded-xl p-8 mb-12 flex items-start gap-6 relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-brand/5 rotate-12 select-none">lightbulb</span>
        <div className="p-3 bg-white text-brand rounded-lg shadow-sm shrink-0">
          <span className="material-symbols-outlined">tips_and_updates</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2 font-sans">Intelligence Pro Tip</p>
          <h4 className="text-lg font-bold text-text-base mb-2 font-sans">Multi-Stakeholder Mapping</h4>
          <p className="text-sm text-text-muted max-w-xl leading-relaxed font-sans">
            Infrastructure deals often require buy-in from multiple personas. Emerald's AI-driven intelligence engine can sequence multi-channel outreach to hit both procurement and finance teams simultaneously to accelerate deal cycles.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-border">
        <button onClick={() => navigate('/onboarding/step-1')} className="flex items-center gap-2 px-6 py-3 font-bold text-text-secondary hover:text-brand transition-colors font-sans">
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button onClick={() => navigate('/onboarding/step-3')} className="px-8 py-3 bg-brand text-white font-bold rounded-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans">
          Continue to ICP Definition
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
```

**Step 4: Run tests — expect PASS**

```bash
npm run test:run -- src/features/onboarding/__tests__/Step2TargetPersonas.test.tsx
```

**Step 5: Visual check** — compare against `docs/account_onboarding_refined_personas/screen.png`

**Step 6: Commit**

```bash
git add src/features/onboarding
git commit -m "feat: implement onboarding step 2 target personas"
```

---

### Task 10: Step 3 — ICP Definition

**Reference:** `docs/onboarding_icp_definition_step_3/code.html`

**Files:**
- Modify: `src/features/onboarding/Step3ICPDefinition.tsx`
- Create: `src/features/onboarding/__tests__/Step3ICPDefinition.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step3ICPDefinition } from '../Step3ICPDefinition'

test('renders heading', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Define your Ideal Customer Profile')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
})

test('renders geography section', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Geography')).toBeInTheDocument()
  expect(screen.getByText('Northeast')).toBeInTheDocument()
})

test('renders impact projection card', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Impact Projection')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `Step3ICPDefinition.tsx`**

Port from reference. Key structure:
- `grid grid-cols-1 lg:grid-cols-12 gap-8` — left col `lg:col-span-8`, right col `lg:col-span-4`
- **Geography section:** white card, 2x3 checkbox grid of US regions
- **Company Type + Site Type:** side-by-side grid, button-based single-select (Company) and radio-list (Site)
- **Score Threshold:** white card with range slider + `useState` for value display
- **Right sidebar:**
  - Dark green "Impact Projection" bento card (dark bg `bg-brand`, white text, stats)
  - Pro tip card using `ProTipCallout`
  - Resource image card with gradient overlay
- Footer: Back → `/onboarding/step-2`, Save as Draft (ghost), Continue → `/onboarding/step-4`

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/onboarding_icp_definition_step_3/screen.png`

**Step 6: Commit**

```bash
git add src/features/onboarding
git commit -m "feat: implement onboarding step 3 icp definition"
```

---

### Task 11: Step 4 — Growth Goals

**Reference:** `docs/onboarding_growth_goals_step_4/code.html`

**Files:**
- Modify: `src/features/onboarding/Step4GrowthGoals.tsx`
- Create: `src/features/onboarding/__tests__/Step4GrowthGoals.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step4GrowthGoals } from '../Step4GrowthGoals'

test('renders heading', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('What are your primary objectives?')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
})

test('renders timeline goal inputs', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('Timeline-Based Goals')).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/e.g., Close 15 CPO accounts/i)).toBeInTheDocument()
})

test('renders complete onboarding button', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText(/Complete Onboarding/i)).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `Step4GrowthGoals.tsx`**

Port from reference. Key elements:
- `grid grid-cols-12 gap-8` — main form `col-span-12 lg:col-span-8`, sidebar `col-span-12 lg:col-span-4`
- Progress indicator: 4 filled `h-1 w-8 bg-brand rounded-full` dots
- **Timeline goals card:** Two text inputs — short-term and annual
- **Priority Markets card:** Tag chips (active = `bg-brand-light text-brand border-brand/20`, inactive = `bg-surface-muted`) with add/remove, search input
- **Right sidebar:** ProTipCallout + Market Projection card with mini chart area
- Footer: Back + Complete Onboarding → `/crm/dashboard`
- Complete button uses `rocket_launch` icon (filled)

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/onboarding_growth_goals_step_4/screen.png`

**Step 6: Commit**

```bash
git add src/features/onboarding
git commit -m "feat: implement onboarding step 4 growth goals"
```

---

## Phase 3 — CRM Screens

> **Font rule for all CRM screens:** Headings → `font-heading` (Instrument Sans), body text → `font-body` (Geist), data/scores/IDs → `font-mono` (JetBrains Mono). The layouts handle `bg-surface-subtle`; pages manage their own padding.

### Task 12: Dashboard (Pipeline Pulse)

**Reference:** `docs/4 missing screens/dashboard_pipeline_pulse/code.html`

**Files:**
- Modify: `src/features/crm/Dashboard.tsx`
- Create: `src/features/crm/__tests__/Dashboard.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard } from '../Dashboard'

test('renders heading', () => {
  render(<MemoryRouter><Dashboard /></MemoryRouter>)
  expect(screen.getByText('Pipeline Pulse')).toBeInTheDocument()
})

test('renders metric cards', () => {
  render(<MemoryRouter><Dashboard /></MemoryRouter>)
  expect(screen.getByText('New Triggers')).toBeInTheDocument()
  expect(screen.getByText('High Intent Deals')).toBeInTheDocument()
  expect(screen.getByText('Total Pipeline Risk')).toBeInTheDocument()
})

test('renders table headers', () => {
  render(<MemoryRouter><Dashboard /></MemoryRouter>)
  expect(screen.getByText('Account')).toBeInTheDocument()
  expect(screen.getByText('Intelligence Score')).toBeInTheDocument()
  expect(screen.getByText('Latest Signal')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `Dashboard.tsx`**

Port from reference. Key structure:
- Page padding: `p-xl` (32px), `max-w-6xl mx-auto`
- Header: H2 "Pipeline Pulse" + subtitle, Filter View + Sync Data buttons
- Signal metrics: 3-col grid of white bordered cards. Values in `text-brand font-heading text-4xl font-semibold`
- Data table: white bordered container, sticky header with search. `text-small-caps` style for column headers (implement with `text-xs font-medium uppercase tracking-widest text-text-muted`)
- Table rows: Account (dot indicator for high-intent), Deal Size (font-mono), Score (`ScoreBadge`), Signal (title + subtitle)
- Row hover: `hover:bg-surface-muted cursor-pointer`
- Use `useNavigate` to navigate to `/crm/dossier/:accountId` on row click

```tsx
import { useNavigate } from 'react-router-dom'
import { ScoreBadge } from '../../components/ScoreBadge'

// ... implement full component
```

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/4 missing screens/dashboard_pipeline_pulse/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/Dashboard.tsx src/features/crm/__tests__
git commit -m "feat: implement crm dashboard pipeline pulse"
```

---

### Task 13: Intelligence Feed

**Reference:** `docs/4 missing screens/intelligence_feed/code.html`

**Files:**
- Modify: `src/features/crm/IntelligenceFeed.tsx`
- Create: `src/features/crm/__tests__/IntelligenceFeed.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntelligenceFeed } from '../IntelligenceFeed'

test('renders heading', () => {
  render(<MemoryRouter><IntelligenceFeed /></MemoryRouter>)
  expect(screen.getByText('Intelligence Feed')).toBeInTheDocument()
})

test('renders date divider', () => {
  render(<MemoryRouter><IntelligenceFeed /></MemoryRouter>)
  expect(screen.getByText(/Today/i)).toBeInTheDocument()
})

test('renders feed events', () => {
  render(<MemoryRouter><IntelligenceFeed /></MemoryRouter>)
  expect(screen.getByText('C-Suite Change: New CFO Appointed')).toBeInTheDocument()
  expect(screen.getByText('Funding Round: Series C Closed')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `IntelligenceFeed.tsx`**

Port from reference. Key elements:
- Sticky header `max-w-[640px] mx-auto` with title, subtitle, Filter button
- Feed centered column `max-w-[640px] mx-auto`
- Sticky date dividers: `text-text-muted text-xs font-mono uppercase tracking-widest`
- Event cards in `bg-white border-x border-b border-border` groups
- Each event: icon tile, time + account + score badge inline, title, 2-line summary
- Hover action button appears absolutely positioned right edge: `opacity-0 group-hover:opacity-100`
- Loading indicator at bottom: spinning `progress_activity` icon

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/4 missing screens/intelligence_feed/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/IntelligenceFeed.tsx src/features/crm/__tests__/IntelligenceFeed.test.tsx
git commit -m "feat: implement intelligence feed"
```

---

### Task 14: Account List

**Reference:** `docs/account_list_portfolio/code.html`

**Files:**
- Modify: `src/features/crm/AccountList.tsx`
- Create: `src/features/crm/__tests__/AccountList.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AccountList } from '../AccountList'

test('renders heading', () => {
  render(<MemoryRouter><AccountList /></MemoryRouter>)
  expect(screen.getByText('Account List')).toBeInTheDocument()
})

test('renders filter bar', () => {
  render(<MemoryRouter><AccountList /></MemoryRouter>)
  expect(screen.getByText('Industry Segment')).toBeInTheDocument()
  expect(screen.getByText('Score Threshold')).toBeInTheDocument()
})

test('renders table data', () => {
  render(<MemoryRouter><AccountList /></MemoryRouter>)
  expect(screen.getByText('VoltStream Infrastructure')).toBeInTheDocument()
  expect(screen.getByText('MegaCharge Solutions')).toBeInTheDocument()
})

test('renders bento insight card', () => {
  render(<MemoryRouter><AccountList /></MemoryRouter>)
  expect(screen.getByText('Market Penetration Signal')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `AccountList.tsx`**

Port from reference. Key elements:
- Page: `p-8 max-w-7xl mx-auto`
- Header: breadcrumb + H1 + toggle tabs (Active Targets / Watchlist) + New Account button
- Filter bar: 4-col grid of white bordered filter cards (Industry Segment dropdown, Region dropdown, ICP Match chips, Score Threshold slider)
- Table: `bg-white border border-border rounded-none` (sharp corners). Columns: Account Name (icon + name + domain), Segment badge, Total Sites (font-mono), Current Network, Active Signal (pulse dot + label), Intel Score (`ScoreBadge` variant with dark bg for high scores)
- Pagination footer
- Bento section: `lg:col-span-2 bg-brand text-white` insight card + contributor card

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/account_list_portfolio/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/AccountList.tsx src/features/crm/__tests__/AccountList.test.tsx
git commit -m "feat: implement account list"
```

---

### Task 15: Deal Progression

**Reference:** `docs/deal_progression_tracker/code.html`

**Files:**
- Modify: `src/features/crm/DealProgression.tsx`
- Create: `src/features/crm/__tests__/DealProgression.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DealProgression } from '../DealProgression'

test('renders heading', () => {
  render(<MemoryRouter><DealProgression /></MemoryRouter>)
  expect(screen.getByText('Deal Progression Tracker')).toBeInTheDocument()
})

test('renders stats bar', () => {
  render(<MemoryRouter><DealProgression /></MemoryRouter>)
  expect(screen.getByText('Total Pipeline Value')).toBeInTheDocument()
  expect(screen.getByText('Risk Exposure')).toBeInTheDocument()
})

test('renders kanban stages', () => {
  render(<MemoryRouter><DealProgression /></MemoryRouter>)
  expect(screen.getByText(/Technical Convertibility/i)).toBeInTheDocument()
  expect(screen.getByText(/Capital Fit/i)).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `DealProgression.tsx`**

Port from reference. Key elements:
- Section header: H2 uppercase, Board View / Timeline View toggle, Create New Deal button
- Stats bar: `grid grid-cols-2 md:grid-cols-4` with label + value pairs. Pipeline value in `text-brand`, Risk in `text-danger`
- Kanban container: `overflow-x-auto`, flex row of `min-w-[320px]` columns
- Each column: `border-b-4` colored header (active stages = `border-brand-muted`, others = `border-surface-strong`), cards below
- Deal cards: white bordered, ID (font-mono), status `Badge`, company name, deal size (font-mono), optional extras (team avatars, warning message, progress bar)
- Status footer: `h-10 bg-surface-muted border-t` with database sync + user info

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/deal_progression_tracker/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/DealProgression.tsx src/features/crm/__tests__/DealProgression.test.tsx
git commit -m "feat: implement deal progression tracker kanban"
```

---

### Task 16: Settings & Integrations

**Reference:** `docs/settings_integrations/code.html`

**Files:**
- Modify: `src/features/crm/Settings.tsx`
- Create: `src/features/crm/__tests__/Settings.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Settings } from '../Settings'

test('renders heading', () => {
  render(<MemoryRouter><Settings /></MemoryRouter>)
  expect(screen.getByText('Configuration & Nodes')).toBeInTheDocument()
})

test('renders active integrations', () => {
  render(<MemoryRouter><Settings /></MemoryRouter>)
  expect(screen.getByText('Active Integrations')).toBeInTheDocument()
  expect(screen.getByText('DOE / AFDC')).toBeInTheDocument()
  expect(screen.getByText('Salesforce CRM')).toBeInTheDocument()
})

test('renders data provenance', () => {
  render(<MemoryRouter><Settings /></MemoryRouter>)
  expect(screen.getByText('Data Provenance')).toBeInTheDocument()
  expect(screen.getByText('NREL Utility Rate Database')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `Settings.tsx`**

Port from reference. Key elements:
- `p-8 max-w-7xl mx-auto space-y-12`
- Page header: title + Export Config / Apply Changes buttons
- `grid grid-cols-1 lg:grid-cols-12 gap-8`
- Left `lg:col-span-8`:
  - Active Integrations: 2x2 grid of integration cards. Each: icon tile, toggle switch (CSS-only `peer` pattern), name, description, status line. Toggle: `bg-surface-strong peer-checked:bg-brand`
  - Data Provenance: list of API health rows with colored dots (green/amber) and uptime %
- Right `lg:col-span-4`:
  - User Profile card: avatar, name, role, email/timezone
  - Team Members list
  - API Usage quota card (`bg-brand text-white`)

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/settings_integrations/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/Settings.tsx src/features/crm/__tests__/Settings.test.tsx
git commit -m "feat: implement settings and integrations"
```

---

### Task 17: Deal-Ready Dossier

**Reference:** `docs/4 missing screens/deal_ready_dossier/code.html`

**Files:**
- Modify: `src/features/crm/DealReadyDossier.tsx`
- Create: `src/features/crm/__tests__/DealReadyDossier.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DealReadyDossier } from '../DealReadyDossier'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/crm/dossier/acme-corp']}>
      <Routes>
        <Route path="/crm/dossier/:accountId" element={<DealReadyDossier />} />
      </Routes>
    </MemoryRouter>
  )
}

test('renders account name', () => {
  render(<Wrapper />)
  expect(screen.getByText('Acme Corp')).toBeInTheDocument()
})

test('renders why now section', () => {
  render(<Wrapper />)
  expect(screen.getByText('Why NOW')).toBeInTheDocument()
})

test('renders talk track copy button', () => {
  render(<Wrapper />)
  expect(screen.getByText(/Copy Track/i)).toBeInTheDocument()
})

test('renders buying committee', () => {
  render(<Wrapper />)
  expect(screen.getByText('Buying Committee')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `DealReadyDossier.tsx`**

Port from reference. Key elements:
- Note: This is inside `FocusedLayout` — no sidebar. Layout already provides the back nav header.
- `flex-1 p-lg max-w-[1600px] mx-auto w-full` (uses spacing tokens from reference)
- 4-column grid: `lg:grid-cols-4` — left 1 col, center 2 cols, right 1 col
- **Left (1 col):** Firmographics card + Recent News card (both `card-panel` = white, `border border-border`, `rounded`)
- **Center (2 cols):** "Why NOW" card (green top border `border-t-4 border-t-brand`, buying triggers list with `check_circle` icons, EVR Talk Track block with copy button); Objection Handling grid
- **Right (1 col):** Buying Committee card (stacked stakeholder nodes, each with colored left border: green=champion, yellow=economic buyer, red=blocker)
- Copy button: `useState` for "Copied!" feedback with 2s timeout

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/4 missing screens/deal_ready_dossier/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/DealReadyDossier.tsx src/features/crm/__tests__/DealReadyDossier.test.tsx
git commit -m "feat: implement deal-ready dossier"
```

---

### Task 18: Decision Maker Map

**Reference:** `docs/4 missing screens/decision_maker_map/code.html`

**Files:**
- Modify: `src/features/crm/DecisionMakerMap.tsx`
- Create: `src/features/crm/__tests__/DecisionMakerMap.test.tsx`

**Step 1: Write failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DecisionMakerMap } from '../DecisionMakerMap'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/crm/map/acme-corp']}>
      <Routes>
        <Route path="/crm/map/:accountId" element={<DecisionMakerMap />} />
      </Routes>
    </MemoryRouter>
  )
}

test('renders filter panel', () => {
  render(<Wrapper />)
  expect(screen.getByText('Map Filters')).toBeInTheDocument()
})

test('renders node names', () => {
  render(<Wrapper />)
  expect(screen.getByText('Marcus Thorne')).toBeInTheDocument()
  expect(screen.getByText('Sarah Jenkins')).toBeInTheDocument()
})

test('renders detail panel for selected node', () => {
  render(<Wrapper />)
  expect(screen.getByText('Contact History')).toBeInTheDocument()
})
```

**Step 2: Run test — expect FAIL**

**Step 3: Implement `DecisionMakerMap.tsx`**

Port from reference. This is the most complex screen. Key elements:
- Layout: `flex h-full` (fills FocusedLayout's remaining height)
- **Left panel** (`w-64 bg-white border-r border-border`): Map Filters (Roles checkboxes, Sentiment legend, Add Node / Sync buttons)
- **Canvas** (`flex-1 relative overflow-hidden bg-[#F8FAFC]` with `bg-grid` CSS grid pattern): SVG layer for edges + absolutely positioned node cards
  - CSS grid pattern via inline style: `backgroundImage: 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px'`
  - SVG edges: `<svg className="absolute inset-0 w-full h-full pointer-events-none">`
  - Node cards: `absolute w-[180px] h-16 bg-white border border-border cursor-pointer` + sentiment left border
  - Selected node: `border-2 border-brand`
  - Canvas toolbar: "Live Sync: Active" chip top-left
  - Zoom controls: bottom-right button group
- **Right panel** (`w-80 bg-white border-l border-border`): Contact detail — avatar initials, score + role type grid, contact history timeline, internal notes textarea

Use `useState<string>` for `selectedNodeId`. Clicking a node sets the selection and shows details in right panel.

> Note: Actual pan/zoom is not required — static layout faithful to reference is sufficient. The canvas has `cursor-grab` styling but no JS pan behavior needed for this phase.

**Step 4: Run tests — expect PASS**

**Step 5: Visual check** — compare against `docs/4 missing screens/decision_maker_map/screen.png`

**Step 6: Commit**

```bash
git add src/features/crm/DecisionMakerMap.tsx src/features/crm/__tests__/DecisionMakerMap.test.tsx
git commit -m "feat: implement decision maker map"
```

---

## Phase 4 — Polish & Verification

### Task 19: Final wiring, navigation, and smoke test

**Files:**
- Modify: `src/features/crm/Dashboard.tsx` — ensure table rows navigate to `/crm/dossier/:id`
- Modify: `src/features/crm/AccountList.tsx` — ensure rows navigate to `/crm/dossier/:id`

**Step 1: Wire up row navigation in Dashboard**

In `Dashboard.tsx`, add `useNavigate` and `onClick={() => navigate('/crm/dossier/acme-corp')}` to each table row `<tr>`.

**Step 2: Wire up Account List row navigation**

Same pattern — row click → `/crm/dossier/${accountId}`.

**Step 3: Run full test suite**

```bash
npm run test:run
```
Expected: All tests PASS. Fix any failures before continuing.

**Step 4: Full smoke test in browser**

```bash
npm run dev
```

Walk through the full user journey:
1. `/` → redirects to `/onboarding/step-1` ✓
2. Click "Continue to Personas" → `/onboarding/step-2` ✓
3. Continue through all 4 steps ✓
4. "Complete Onboarding" → `/crm/dashboard` ✓
5. Click a table row → `/crm/dossier/acme-corp` (FocusedLayout) ✓
6. Click back → returns to dashboard ✓
7. Navigate to `/crm/accounts`, `/crm/deals`, `/crm/feed`, `/crm/settings` ✓
8. Navigate to `/crm/map/acme-corp` ✓

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire navigation, complete all screens"
```

---

### Task 20: Production build verification

**Step 1: Run build**

```bash
npm run build
```
Expected: `dist/` created, no TypeScript errors, no Tailwind purge issues.

**Step 2: Preview production build**

```bash
npm run preview
```
Walk through the same smoke test journey as Task 19 on the production build.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify production build passes"
```

---

## Summary

| Phase | Tasks | Screens |
|---|---|---|
| 0 — Setup | 1–4 | Project scaffold, Tailwind config, Logo SVG, CLAUDE.md |
| 1 — Foundation | 5–7 | Shared components, 3 layouts, App routing |
| 2 — Onboarding | 8–11 | Steps 1–4 |
| 3 — CRM | 12–18 | Dashboard, Feed, Accounts, Deals, Settings, Dossier, Map |
| 4 — Polish | 19–20 | Navigation wiring, production build |

**Total:** 20 tasks, ~7–10 hours of focused implementation work.
