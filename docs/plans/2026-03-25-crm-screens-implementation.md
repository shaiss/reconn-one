# CRM Screens Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **For Parallel Phase (Tasks 9-15):** Use superpowers:dispatching-parallel-agents to dispatch all 7 screen tasks simultaneously.

**Goal:** Implement all 7 CRM screens from reference HTML docs using shadcn/ui for interactive primitives and shared Tailwind components for layout patterns.

**Architecture:** Phase 1 wires shadcn/ui into the project (path aliases, CSS variables, component installs). Phase 2 builds 5 shared components used across screens. Phase 3 dispatches 7 screen implementations in parallel — each is independent and self-contained.

**Tech Stack:** React 19, TypeScript, Tailwind v3, shadcn/ui (Switch + Tabs + Accordion from Radix UI), React Router v7, Material Symbols Outlined icons.

**IMPORTANT — Token Translation:** Reference HTML files use OLD token names. Always translate before writing Tailwind classes:
- `primary` → `brand`
- `background-light`, `surface-container-low`, `background` → `surface-subtle`
- `surface` → `surface` (same)
- `on-surface`, `text-main`, `text` → `text-base`
- `muted`, `on-surface-variant` → `text-muted`
- `secondary` → `text-secondary`
- `outline`, `border-color`, `border` → `border`
- `accent` → `brand-muted`
- `alert`, `error` → `danger`
- `score-good-bg` → `score-positive-bg`, `score-good-text` → `score-positive-text`, `score-good-border` → `score-positive-border`
- `score-warn-bg` → `score-neutral-bg`, `score-warn-text` → `score-neutral-text`, `score-warn-border` → `score-neutral-border`
- `primary-container` / `accent-light` → `brand-light`
- `surface-container` / `surface-dim` / `secondary-container` / `surface-muted` → `surface-muted`
- `surface-container-high` / `surface-strong` → `surface-strong`

**IMPORTANT — CRM Font Rules:**
- Headings: `font-heading` (Instrument Sans + `tracking-tight`)
- Body: `font-body` (Geist)
- Data/scores/amounts/IDs: `font-mono` (JetBrains Mono)
- All elements: `rounded` (2px sharp/flat — NOT `rounded-lg` etc.)

---

## PHASE 1: SETUP (run Tasks 1–4 sequentially)

---

### Task 1: Add path aliases (shadcn prerequisite)

**Files:**
- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`
- Install: `@types/node` (already in devDeps — verify)

**Step 1: Update tsconfig.app.json**

Replace the file content with:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Step 2: Update vite.config.ts**

```typescript
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add tsconfig.app.json vite.config.ts
git commit -m "chore: add @/* path alias for shadcn/ui"
```

---

### Task 2: Install shadcn/ui base dependencies

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/` directory

**Step 1: Install packages**

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

Expected: All 4 packages installed without errors.

**Step 2: Create components.json at project root**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Step 3: Create src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Commit**

```bash
git add components.json src/lib/utils.ts package.json package-lock.json
git commit -m "chore: add shadcn/ui base setup and cn utility"
```

---

### Task 3: Install shadcn interactive components (Switch, Tabs, Accordion)

**Files:**
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/ui/accordion.tsx`

**Step 1: Add shadcn components via CLI**

```bash
npx shadcn@latest add switch tabs accordion --yes
```

This will:
- Install `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`
- Create the component files in `src/components/ui/`

Expected: 3 files created in `src/components/ui/`, packages installed.

**Step 2: Verify the files exist**

Run: `ls src/components/ui/`
Expected: `switch.tsx`, `tabs.tsx`, `accordion.tsx`

**Step 3: Commit**

```bash
git add src/components/ui/ package.json package-lock.json
git commit -m "chore: install shadcn Switch, Tabs, Accordion components"
```

---

### Task 4: Add CSS variables to index.css

**Files:**
- Modify: `src/index.css`

**Step 1: Read existing index.css first** (to avoid overwriting it)

**Step 2: Prepend CSS variables block**

Add the following `:root` block at the very top of `src/index.css` (before any existing content):

```css
@layer base {
  :root {
    /* shadcn/ui CSS variables — mapped to our design token hex values */
    --background: 210 40% 98%;        /* surface-subtle: #F8FAFC */
    --foreground: 222 47% 11%;        /* text-base: #0F172A */
    --card: 0 0% 100%;                /* surface: #FFFFFF */
    --card-foreground: 222 47% 11%;   /* text-base: #0F172A */
    --primary: 145 60% 20%;           /* brand: #14532D */
    --primary-foreground: 0 0% 100%;  /* white */
    --secondary: 210 40% 96%;         /* surface-muted: #F1F5F9 */
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;             /* surface-muted: #F1F5F9 */
    --muted-foreground: 215 16% 47%;  /* text-muted: #64748B */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 72% 51%;         /* danger: #B91C1C */
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;            /* border: #E2E8F0 */
    --input: 214 32% 91%;
    --ring: 145 60% 20%;              /* brand: #14532D */
    --radius: 2px;                    /* matches our rounded DEFAULT */
  }
}
```

**Step 3: Commit**

```bash
git add src/index.css
git commit -m "chore: add shadcn CSS variable mapping to design tokens"
```

---

## PHASE 2: SHARED COMPONENTS (run Tasks 5–8 sequentially)

---

### Task 5: Build StatCard component

Used by: Dashboard (3 metric cards), Deal Progression (4 stats).

**Files:**
- Create: `src/components/StatCard.tsx`

**Step 1: Write the component**

```typescript
interface StatCardProps {
  label: string
  value: string
  trend?: string
  trendPositive?: boolean
}

export function StatCard({ label, value, trend, trendPositive }: StatCardProps) {
  return (
    <div className="bg-surface border border-border p-6 flex flex-col gap-2">
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
        {label}
      </h3>
      <div className="font-heading text-4xl font-semibold text-brand tracking-tight">
        {value}
      </div>
      {trend && (
        <p className="text-[12px] text-text-muted flex items-center gap-1 mt-1">
          {trendPositive && (
            <span className="material-symbols-outlined text-[14px] text-brand-muted">
              trending_up
            </span>
          )}
          {trend}
        </p>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/StatCard.tsx
git commit -m "feat: add StatCard shared component"
```

---

### Task 6: Build PageHeader component

Used by all 5 CRMLayout screens.

**Files:**
- Create: `src/components/PageHeader.tsx`

**Step 1: Write the component**

```typescript
import { type ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode  // action buttons slot
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-3xl font-semibold text-text-base tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-muted mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/PageHeader.tsx
git commit -m "feat: add PageHeader shared component"
```

---

### Task 7: Build SignalBadge component

Used by: Dashboard table, Intelligence Feed, Account List, Dossier. Renders a colored pill for signal types.

**Files:**
- Create: `src/components/SignalBadge.tsx`

**Step 1: Write the component**

```typescript
type SignalType =
  | 'exec-hire'
  | 'funding'
  | 'regulatory'
  | 'fleet-expansion'
  | 'tech-stack'
  | 'competitor'
  | 'risk'
  | 'generic'

const signalConfig: Record<SignalType, { label: string; classes: string; icon: string }> = {
  'exec-hire':       { label: 'Exec Hire',       classes: 'bg-brand-light text-brand border-brand-light',          icon: 'person_add' },
  'funding':         { label: 'Funding',          classes: 'bg-score-positive-bg text-score-positive-text border-score-positive-border', icon: 'payments' },
  'regulatory':      { label: 'Regulatory',       classes: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',         icon: 'gavel' },
  'fleet-expansion': { label: 'Fleet Expansion',  classes: 'bg-brand-light text-brand border-brand-light',          icon: 'electric_car' },
  'tech-stack':      { label: 'Tech Stack',       classes: 'bg-surface-muted text-text-secondary border-border',    icon: 'language' },
  'competitor':      { label: 'Competitor',       classes: 'bg-surface-muted text-text-secondary border-border',    icon: 'compare_arrows' },
  'risk':            { label: 'Risk Alert',        classes: 'bg-danger-light text-danger border-danger-light',       icon: 'trending_down' },
  'generic':         { label: 'Signal',            classes: 'bg-surface-muted text-text-muted border-border',        icon: 'sensors' },
}

interface SignalBadgeProps {
  type: SignalType
  label?: string  // override default label
}

export function SignalBadge({ type, label }: SignalBadgeProps) {
  const config = signalConfig[type]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium border rounded ${config.classes}`}
    >
      <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
      {label ?? config.label}
    </span>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/SignalBadge.tsx
git commit -m "feat: add SignalBadge shared component"
```

---

### Task 8: Build SectionPanel component

A white bordered card wrapper with optional table-style header (gray bg + title + right slot). Used by Dashboard, Account List, Settings, Dossier.

**Files:**
- Create: `src/components/SectionPanel.tsx`

**Step 1: Write the component**

```typescript
import { type ReactNode } from 'react'

interface SectionPanelProps {
  title?: string
  headerRight?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionPanel({ title, headerRight, children, className = '' }: SectionPanelProps) {
  return (
    <div className={`bg-surface border border-border flex flex-col ${className}`}>
      {title && (
        <div className="border-b border-border px-4 py-3 flex justify-between items-center bg-surface-muted">
          <h3 className="font-heading font-semibold text-text-base">{title}</h3>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/SectionPanel.tsx
git commit -m "feat: add SectionPanel shared component"
```

---

## PHASE 3: SCREENS (dispatch Tasks 9–15 as parallel agents)

> Each task is fully self-contained. Dispatch all 7 simultaneously using superpowers:dispatching-parallel-agents.
> Each agent must read its reference HTML file before writing any code.

**Shared context every agent needs:**
- Project root: `C:\Users\Shai\Documents\Code Workspaces\reconn-one`
- All custom Tailwind tokens are in `tailwind.config.ts` — use them, don't use raw hex
- Token translation table: see top of this document
- CRM font rule: `font-body` body, `font-heading` headings, `font-mono` data
- All edges/borders: `rounded` (2px) — never `rounded-lg` etc. in CRM screens
- Icons: `<span className="material-symbols-outlined">icon_name</span>`
- Filled icon variant: add `style={{ fontVariationSettings: "'FILL' 1" }}`
- Shared components available: `StatCard`, `PageHeader`, `SignalBadge`, `SectionPanel`, `ScoreBadge`, `Badge`
- shadcn components available in `@/components/ui/`: `Switch`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent`

---

### Task 9: Dashboard — Pipeline Pulse

**Reference:** `docs/4 missing screens/dashboard_pipeline_pulse/code.html`
**File:** `src/features/crm/Dashboard.tsx`

**Data:**
```typescript
const SIGNALS = [
  { id: 1, account: 'Acme Corp',     dealSize: '$150,000', score: 92, signalTitle: 'New Exec Hire',    signalDesc: 'CFO transition announced via PR Newswire',          hot: true },
  { id: 2, account: 'TechFlow',      dealSize: '$85,000',  score: 88, signalTitle: 'Funding Round',    signalDesc: 'Series B closed, expanding engineering team',       hot: true },
  { id: 3, account: 'GlobalData',    dealSize: '$220,000', score: 75, signalTitle: 'Tech Stack Change', signalDesc: 'Evaluating new analytics vendors',                  hot: false },
  { id: 4, account: 'CloudSync',     dealSize: '$45,000',  score: 42, signalTitle: 'No recent signals', signalDesc: 'Last activity 45 days ago',                         hot: false },
  { id: 5, account: 'Nexus Systems', dealSize: '$115,000', score: 68, signalTitle: 'Competitor Mention', signalDesc: 'Viewed comparison page vs legacy provider',        hot: false },
]
```

**Layout:**
1. `PageHeader` — title "Pipeline Pulse", subtitle "Monitoring active deals and recent buying signals.", two action buttons: "Filter View" (outlined) + "Sync Data" (brand)
2. 3-column `StatCard` grid:
   - "New Triggers" / "12" / "+3 since yesterday" (trendPositive)
   - "High Intent Deals" / "8" / "Requiring immediate action"
   - "Total Pipeline Risk" / "$4.2M" / "Across 45 active opportunities"
3. `SectionPanel` title="Active Signals" with search input in headerRight
   - Search filters `SIGNALS` by account name (case-insensitive `includes`)
   - Table columns: Account | Deal Size | Intelligence Score | Latest Signal
   - "Account" column: hot accounts show green dot (`w-2 h-2 rounded-full bg-brand-muted`) before name
   - "Deal Size": `font-mono text-[13px] text-text-muted`
   - "Intelligence Score": `<ScoreBadge score={row.score} />`
   - "Latest Signal": two-line cell — signal title (medium) + description (muted, truncate)

**State:** `const [query, setQuery] = useState('')`

**Step 1: Implement Dashboard.tsx** (read reference first)

**Step 2: Verify it renders** — run `npm run dev`, navigate to `/crm/dashboard`

**Step 3: Commit**
```bash
git add src/features/crm/Dashboard.tsx
git commit -m "feat: implement Dashboard (Pipeline Pulse) screen"
```

---

### Task 10: Intelligence Feed

**Reference:** `docs/4 missing screens/intelligence_feed/code.html`
**File:** `src/features/crm/IntelligenceFeed.tsx`

**Data:**
```typescript
type FeedItem = {
  id: number; time: string; account: string; score: number
  title: string; description: string; icon: string
  iconColor: 'brand' | 'brand-muted' | 'danger'
  actionLabel: string; date: 'today' | 'yesterday'
}

const FEED_ITEMS: FeedItem[] = [
  { id: 1, time: '10:30 AM', account: 'Acme Corp',    score: 92, title: 'C-Suite Change: New CFO Appointed',     description: 'Sarah Jenkins replaces John Doe. Potential trigger for tech stack consolidation in Q4.', icon: 'person_add',    iconColor: 'brand',      actionLabel: 'Draft Email',   date: 'today' },
  { id: 2, time: '09:15 AM', account: 'Globex Inc',   score: 88, title: 'Funding Round: Series C Closed',        description: 'Closed $50M. Expansion into EMEA expected, massive hiring surge detected.',               icon: 'payments',      iconColor: 'brand-muted', actionLabel: 'View Dossier', date: 'today' },
  { id: 3, time: '08:05 AM', account: 'Initech',      score: 45, title: 'Risk Alert: Champion Departure',        description: 'VP of Engineering left company. Deal momentum stalled.',                                  icon: 'trending_down', iconColor: 'danger',     actionLabel: 'Map Contacts', date: 'today' },
  { id: 4, time: '04:20 PM', account: 'Soylent Corp', score: 82, title: 'Tech Stack Addition: Competitor Dropped', description: 'Removed LegacyCRM snippet from main domain. Active evaluation phase likely.',             icon: 'language',      iconColor: 'brand',      actionLabel: 'Draft Email',   date: 'yesterday' },
]
```

**Layout:**
- Full height container `h-full overflow-y-auto` — 640px max-width centered column
- Sticky header: "Intelligence Feed" + "Chronological stream of active account signals." + Filter button
- Use shadcn `Tabs` with triggers: All / Exec / Funding / Risk / Tech
  - Filtering: 'exec' matches `icon === 'person_add'`, 'funding' matches `icon === 'payments'`, 'risk' matches `icon === 'trending_down'`, 'tech' matches `icon === 'language'`
- Sticky date dividers: "Today, Oct 24" / "Yesterday, Oct 23"
- Feed item structure (from reference):
  - Left: 40×40 icon box with `border border-border rounded`; icon color varies by `iconColor` (`text-brand` / `text-brand-muted` / `text-danger`)
  - Middle: time (`font-mono text-xs text-text-muted`) + account name + score badge (inline, right-aligned using `ml-auto`)
  - Signal title (medium text-sm) + description (muted, truncate)
  - Hover: "Draft Email" / "View Dossier" button appears at right (`opacity-0 group-hover:opacity-100`)
- Score badge inline: `≥80` → green variant, `<80` → neutral variant

**State:** `const [activeTab, setActiveTab] = useState('all')`

**Step 1: Implement IntelligenceFeed.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/feed`

**Step 3: Commit**
```bash
git add src/features/crm/IntelligenceFeed.tsx
git commit -m "feat: implement Intelligence Feed screen"
```

---

### Task 11: Account List

**Reference:** `docs/account_list_portfolio/code.html`
**File:** `src/features/crm/AccountList.tsx`

**Data:**
```typescript
type Account = {
  id: string; name: string; domain: string; icon: string
  iconBg: string; iconColor: string
  segment: string; segmentClasses: string
  totalSites: string; network: string
  signal: string; signalActive: boolean; signalColor: string
  score: number
}

const ACCOUNTS: Account[] = [
  { id: 'voltstream',  name: 'VoltStream Infrastructure', domain: 'voltstream.io',   icon: 'electric_car',   iconBg: 'bg-brand-light',    iconColor: 'text-brand',          segment: 'Hardware', segmentClasses: 'bg-score-positive-bg text-score-positive-text border-score-positive-border', totalSites: '1,248', network: 'Tesla, ABB +2',         signal: 'Grid Expansion Bid',    signalActive: true,  signalColor: 'text-brand',         score: 94 },
  { id: 'summit',      name: 'Summit Grid Services',      domain: 'summitgrid.com',  icon: 'construction',   iconBg: 'bg-surface-muted',  iconColor: 'text-text-secondary', segment: 'EPC',      segmentClasses: 'bg-surface-muted text-text-secondary border-border',                           totalSites: '432',   network: 'Internal / Proprietary', signal: 'Permit Acquisition',    signalActive: true,  signalColor: 'text-[#D97706]',     score: 81 },
  { id: 'bluehorizon', name: 'BlueHorizon Equity',        domain: 'bluehorizon.cap', icon: 'account_balance', iconBg: 'bg-[#EFF6FF]',     iconColor: 'text-[#1E40AF]',      segment: 'Capital',  segmentClasses: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',                                 totalSites: '2,810', network: 'ChargePoint Multi-site', signal: 'Dormant (14d)',         signalActive: false, signalColor: 'text-text-muted',    score: 67 },
  { id: 'megacharge',  name: 'MegaCharge Solutions',      domain: 'megacharge.com',  icon: 'power',          iconBg: 'bg-brand-light',    iconColor: 'text-brand',          segment: 'Hardware', segmentClasses: 'bg-score-positive-bg text-score-positive-text border-score-positive-border', totalSites: '156',   network: 'Mix Portfolio',          signal: 'Series B Funding News', signalActive: true,  signalColor: 'text-brand',         score: 91 },
]
```

**Layout:**
1. `PageHeader` title="Account List" subtitle="Centralized intelligence monitoring for high-priority EV infrastructure partners." — action: "New Account" button (brand bg)
2. Segment filter tabs row (Active Targets / Watchlist button toggle — purely visual, no filter logic needed)
3. `SectionPanel` containing full-width table:
   - Columns: Account Name | Segment | Total Sites | Current Network | Active Signal | Intel Score
   - Account Name cell: 40×40 icon box + name (bold) + domain (muted tiny)
   - Segment: colored badge from `segmentClasses`
   - Total Sites: `font-mono`
   - Intel Score: `ScoreBadge` but with the account list variant — dark green badge. Use existing `ScoreBadge`
   - Active Signal: dot indicator (`signalActive` → pulsing green, else static amber/muted) + signal text
   - Row click: `useNavigate()` → `/crm/dossier/${account.id}`
   - Table footer: "Showing 1-20 of 1,482 Accounts" + simple pagination buttons (visual only)
4. Bento section below table (2 cards, `grid-cols-3`):
   - **Market Penetration Signal** (`col-span-2`): dark `bg-brand` (not brand-light — use `bg-[#14532D]`) panel, white text. Title + paragraph + "View Deep Signal Report" button
   - **Top Contributor**: white bordered card with "Top Contributor" label, contributor name "Elena Rodriguez", "Senior Intelligence Lead", "Active Leads: 42"

**Step 1: Implement AccountList.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/accounts`. Click a row — should navigate to dossier.

**Step 3: Commit**
```bash
git add src/features/crm/AccountList.tsx
git commit -m "feat: implement Account List screen"
```

---

### Task 12: Deal Progression (Kanban)

**Reference:** `docs/deal_progression_tracker/code.html`
**File:** `src/features/crm/DealProgression.tsx`

**Data:**
```typescript
type DealStatus = 'On Track' | 'Delayed' | 'High Risk' | 'Ready' | 'Funded' | 'Review' | 'Finalizing'

type Deal = {
  id: string; company: string; size: string; status: DealStatus
  statusVariant: 'positive' | 'danger' | 'neutral' | 'funded' | 'muted'
  note?: string; noteType?: 'error' | 'success' | 'info'
  progress?: number  // 0-100, shows progress bar if set
}

type KanbanColumn = { stage: number; title: string; accentColor: string; deals: Deal[] }

const COLUMNS: KanbanColumn[] = [
  { stage: 3, title: 'Technical Convertibility', accentColor: 'border-border',      deals: [
    { id: 'VP-9021', company: 'OmniGrid Systems LLC',      size: '$84.5M',  status: 'On Track', statusVariant: 'positive' },
    { id: 'VP-8832', company: 'Lithium-Core Kinetics',     size: '$210.0M', status: 'Delayed',  statusVariant: 'danger',   note: 'Technical debt detected', noteType: 'error' },
  ]},
  { stage: 4, title: 'Physical Feasibility',      accentColor: 'border-brand-muted', deals: [
    { id: 'VP-1102', company: 'Northeast Transit Network', size: '$42.1M',  status: 'Ready',    statusVariant: 'positive', note: '8 sites surveyed' },
  ]},
  { stage: 5, title: 'Economic Survivability',    accentColor: 'border-border',      deals: [
    { id: 'VP-9941', company: 'SolarStream Renewables',    size: '$12.5M',  status: 'High Risk', statusVariant: 'danger',  progress: 75, note: 'EBITDA Projection Variance', noteType: 'error' },
    { id: 'VP-8772', company: 'Voltaic Charge Points',     size: '$67.9M',  status: 'On Track',  statusVariant: 'positive' },
  ]},
  { stage: 6, title: 'Control & Structure',       accentColor: 'border-brand-muted', deals: [
    { id: 'VP-4412', company: 'EcoFleet Logistics Intl.',  size: '$156.0M', status: 'Review',   statusVariant: 'muted',    note: 'Majority Stake (72%)' },
  ]},
  { stage: 7, title: 'Capital Fit',               accentColor: 'border-border',      deals: [
    { id: 'VP-0021', company: 'Zenith Charging Hubs',      size: '$540.0M', status: 'Funded',   statusVariant: 'funded' },
  ]},
  { stage: 8, title: 'Execution',                 accentColor: 'border-brand',       deals: [
    { id: 'VP-1002', company: 'UrbanGrid EV Solutions',    size: '$28.2M',  status: 'Finalizing', statusVariant: 'positive', note: 'Closing Documents Sent', noteType: 'success' },
  ]},
]
```

**Layout:**
1. `PageHeader` title="Deal Progression Tracker" subtitle="Advanced Pipeline Analysis: M&A Stages 3–8" — actions: Board View / Timeline View toggle (visual) + "Create New Deal" button
2. Stats bar (`grid-cols-4`, border-y padding):
   - `StatCard`-like inline items (no Card wrapper): "Total Pipeline Value" / "$1.42B" / "Active Entities" / "42" / "Avg. Deal Velocity" / "182 Days" / "Risk Exposure" / "12.4%" (last one text-danger)
3. Horizontal-scroll kanban: `flex gap-6 overflow-x-auto pb-8`
   - Each column: min-w-[320px], column header (`border-b-4 ${accentColor}`) with stage+title + count badge
   - Each deal card: white border, `p-4 flex flex-col gap-3 hover:border-text-secondary cursor-pointer`
     - ID line: `font-mono text-xs text-text-muted` + status badge from `Badge` component
     - Company name: bold
     - "Deal Size" label + size in `font-mono text-base`
     - Optional: note line, progress bar (`<div class="w-full bg-surface-muted h-1"><div class="bg-danger h-1" style={{ width: `${progress}%` }} /></div>`)
     - Deals with `status === 'Funded'` get `border-l-4 border-l-brand`
     - Deals with `status === 'High Risk'` get `border-l-4 border-l-danger`
4. Footer status bar: `h-10 bg-surface-muted border-t border-border px-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-muted`

**Step 1: Implement DealProgression.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/deals`

**Step 3: Commit**
```bash
git add src/features/crm/DealProgression.tsx
git commit -m "feat: implement Deal Progression kanban screen"
```

---

### Task 13: Settings & Integrations

**Reference:** `docs/settings_integrations/code.html`
**File:** `src/features/crm/Settings.tsx`

**Data:**
```typescript
type Integration = {
  id: string; name: string; description: string; icon: string
  status: string; defaultEnabled: boolean
}

const INTEGRATIONS: Integration[] = [
  { id: 'doe',        name: 'DOE / AFDC',    description: 'National Alternative Fuels Data Center sync for charging infrastructure.',  icon: 'ev_station', status: 'Syncing Every 6h', defaultEnabled: true },
  { id: 'epa',        name: 'EPA Green Power', description: 'Environmental Protection Agency data for grid emission factors.',            icon: 'eco',        status: 'Connected',        defaultEnabled: true },
  { id: 'attom',      name: 'ATTOM Property', description: 'Comprehensive property tax and ownership data for site evaluation.',         icon: 'domain',     status: 'API Active',       defaultEnabled: true },
  { id: 'salesforce', name: 'Salesforce CRM', description: 'Bidirectional lead and account sync with enterprise CRM.',                   icon: 'cloud',      status: 'Disabled',         defaultEnabled: false },
]

const HEALTH_NODES = [
  { name: 'NREL Utility Rate Database', type: 'Federal API',    uptime: '99.98%', status: 'healthy' as const },
  { name: 'Census Bureau TIGER/Line',   type: 'Federal API',    uptime: '100.0%', status: 'healthy' as const },
  { name: 'NYC OpenData Zoning',        type: 'Municipal API',  uptime: '84.22%', status: 'warning' as const, note: 'Latency Detected' },
]

const TEAM_MEMBERS = [
  { initials: 'SM', name: 'Sarah Miller',  role: 'Regional Lead',  badge: 'Admin' },
  { initials: 'RK', name: 'Robert Kwon',   role: 'Data Scientist', badge: 'Editor' },
  { initials: 'AL', name: 'Anna Lopez',    role: 'Site Auditor',   badge: 'Pending', muted: true },
]
```

**Layout:** `grid grid-cols-1 lg:grid-cols-12 gap-8`

**Left col (col-span-8):**
1. `PageHeader` title="Configuration & Nodes" subtitle="Manage cross-platform data flow and institutional preferences." — actions: "Export Config" (outlined) + "Apply Changes" (brand)
2. Active Integrations panel (white border, p-6):
   - Header: "Active Integrations" label + "4 Live Nodes" badge
   - 2×2 grid of integration cards (white border, hover:border-brand, p-5):
     - Top row: icon box (40×40 bg-surface-muted) + **shadcn `Switch`** (checked = `defaultEnabled`)
     - Integration name (bold) + description (text-xs muted)
     - Footer: status text (enabled → `text-brand-muted font-bold`, disabled → `text-text-muted`) + settings icon
   - `Switch` from `@/components/ui/switch` — use `defaultChecked={integration.defaultEnabled}`
3. Data Provenance panel (white border, p-6):
   - "Data Provenance" header + description
   - List of health nodes, each: dot indicator (green/amber) + name + type + uptime (right-aligned)

**Right col (col-span-4):**
1. User Profile card (white border, p-6, items-center text-center):
   - Avatar placeholder: `w-24 h-24 rounded bg-brand-light flex items-center justify-center text-brand font-heading font-bold text-2xl` with "JD" initials
   - Name "Johnathan Doe", role "Senior Infrastructure Architect"
   - Data rows: Email / Timezone
2. Team Members panel (white border, p-6):
   - "Team Members" label + add icon button
   - Member rows: initials avatar (w-8 h-8 bg-surface-muted rounded) + name + role + badge
   - "Pending" member: `opacity-60`
   - Footer: dashed "View All 12 Members" button
3. API Usage quota (dark `bg-[#14532D]` bg, white text, p-6):
   - "Monthly API Usage" label
   - "82,440 Calls / 100k"
   - Progress bar: `bg-[#14532D] h-1.5` outer, `bg-brand-muted w-[82%] h-full` inner
   - Note text (italic, muted)

**State:** `const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.defaultEnabled])))`

**Step 1: Implement Settings.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/settings`. Toggle switches should update state.

**Step 3: Commit**
```bash
git add src/features/crm/Settings.tsx
git commit -m "feat: implement Settings & Integrations screen"
```

---

### Task 14: Deal-Ready Dossier (FocusedLayout)

**Reference:** `docs/4 missing screens/deal_ready_dossier/code.html`
**File:** `src/features/crm/DealReadyDossier.tsx`

**Data:**
```typescript
const FIRMOGRAPHICS = [
  { label: 'Industry',  value: 'Enterprise Software' },
  { label: 'Employees', value: '500-1000' },
  { label: 'Revenue',   value: '$50M-$100M' },
  { label: 'HQ',        value: 'San Francisco, CA' },
]
const TECH_STACK = ['Salesforce', 'AWS', 'Snowflake']

const NEWS = [
  { age: '2 days ago',   text: 'Acquired TechStart Inc. for $25M to bolster data analytics division.' },
  { age: '1 week ago',   text: 'Appointed new CTO, Jane Doe, formerly VP of Eng at Oracle.' },
  { age: '3 weeks ago',  text: 'Expanded European operations with new London office.' },
]

const WHY_NOW_SIGNALS = [
  { text: '<strong>Budget Approved:</strong> Q3 infrastructure upgrade budget was finalized last Tuesday according to their latest 10-Q filing.' },
  { text: '<strong>Competitor Vulnerability:</strong> Existing contract with LegacyVendor Inc. is expiring in exactly 45 days. They are actively evaluating alternatives.' },
  { text: '<strong>High Intent Signals:</strong> Multiple visits from VP Engineering to our Enterprise Pricing page in the last 24 hours.' },
]

const TALK_TRACK = `"Hi [Name], I noticed Jane Doe recently joined as CTO and you're ramping up your European expansion.

Given your current contract with [Competitor] is up for renewal next month, I wanted to share how we helped [Similar Company] handle that exact transition while reducing infrastructure latency by 40% during their international rollout.

Are you open to a brief conversation next Tuesday to see if our Q3 deployment timeline aligns with your new budget initiatives?"`

const OBJECTIONS = [
  { blocker: '"Migration risk is too high right now."', response: 'Pivot to our automated schema mapping tool that requires zero downtime. Reference the TechStart acquisition integration.' },
  { blocker: '"We need to stick with [Competitor] for Europe."', response: 'Highlight our new Frankfurt data center opening next month, ensuring GDPR compliance natively.' },
]

type Sentiment = 'positive' | 'neutral' | 'negative'
type Stakeholder = { initials: string; name: string; title: string; role: string; sentiment: Sentiment; indented?: boolean }
const STAKEHOLDERS: Stakeholder[] = [
  { initials: 'JD', name: 'Jane Doe',    title: 'Chief Technology Officer', role: 'Champion',         sentiment: 'positive' },
  { initials: 'MS', name: 'Mike Smith',  title: 'VP of Engineering',        role: 'Economic Buyer',   sentiment: 'neutral',  indented: true },
  { initials: 'SJ', name: 'Sarah Jones', title: 'Dir. IT Procurement',      role: 'Historical Blocker', sentiment: 'negative', indented: true },
]
```

**Layout:** `flex-1 p-6 max-w-[1600px] mx-auto w-full overflow-y-auto`

3-column grid `grid-cols-1 lg:grid-cols-4 gap-6 items-start`:

**Left column (col-span-1):**
- Firmographics card: title "Firmographics" with `domain` icon. Each row: small-caps label + value. Tech stack section: monospace chip tags.
- Recent News card: title "Recent News" with `newspaper` icon. Each news item: age in `font-mono text-text-muted` + text. Dividers between items.

**Center column (col-span-2):**
- "Why NOW" card with top green border (`absolute top-0 left-0 right-0 h-1 bg-brand`):
  - Header: "Why NOW" (bolt icon filled, text-brand-muted) + "High Intent" badge (brand-light bg)
  - 3 bullet points using check_circle icons (text-brand)
  - Talk track block: `bg-surface-subtle border border-border relative` with "EVR Recommended Talk Track" label chip, pre-formatted text, "Copy Track" button (`navigator.clipboard.writeText(TALK_TRACK)`)
- Objection Handling card: 2-column grid of objection panels. Each: "Potential Blocker" label (danger color) + blocker quote + response text.

**Right column (col-span-1):**
- "Buying Committee" card:
  - Connecting vertical line: `absolute left-4 top-4 bottom-4 w-px bg-border`
  - Each stakeholder: `relative z-10 flex items-start gap-3 bg-surface border border-border p-3`
    - Left sentiment border: `positive` → `borderLeft: '3px solid #22C55E'`, `neutral` → `borderLeft: '3px solid #EAB308'`, `negative` → `borderLeft: '3px solid #B91C1C'`
    - `indented` → add `ml-6` class
    - Initials avatar (8×8 rounded-full) + name + title + role (font-mono text-[10px])
    - Champion stakeholder gets a `star` icon (brand-muted color) next to name
  - "View Full Map" button → `useNavigate()` to `/crm/map/acme`

**State:**
- `const [copied, setCopied] = useState(false)` — copy button shows "Copied!" briefly

**Step 1: Implement DealReadyDossier.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/dossier/acme`

**Step 3: Commit**
```bash
git add src/features/crm/DealReadyDossier.tsx
git commit -m "feat: implement Deal-Ready Dossier screen"
```

---

### Task 15: Decision Maker Map (FocusedLayout)

**Reference:** `docs/4 missing screens/decision_maker_map/code.html`
**File:** `src/features/crm/DecisionMakerMap.tsx`

**Data:**
```typescript
type NodeSentiment = 'positive' | 'neutral' | 'negative'

type MapNode = {
  id: string; name: string; title: string; score: number
  sentiment: NodeSentiment; x: number; y: number
  initials: string
}

type Edge = {
  from: string; to: string
  type: 'strong' | 'neutral' | 'friction'
}

const NODES: MapNode[] = [
  { id: 'ceo', name: 'Marcus Thorne',   title: 'Chief Executive Officer', score: 92, sentiment: 'positive', x: 350, y: 116, initials: 'MT' },
  { id: 'cfo', name: 'Sarah Jenkins',   title: 'Chief Financial Officer',  score: 45, sentiment: 'negative', x: 200, y: 320, initials: 'SJ' },
  { id: 'cto', name: 'David Chen',      title: 'Chief Technology Officer', score: 68, sentiment: 'neutral',  x: 500, y: 320, initials: 'DC' },
  { id: 'vps', name: 'Elena Rodriguez', title: 'VP of Sales',              score: 72, sentiment: 'neutral',  x: 400, y: 520, initials: 'ER' },
  { id: 'vpe', name: 'James Wilson',    title: 'VP of Engineering',        score: 88, sentiment: 'positive', x: 600, y: 520, initials: 'JW' },
]

const EDGES: Edge[] = [
  { from: 'ceo', to: 'cfo', type: 'strong' },
  { from: 'ceo', to: 'cto', type: 'neutral' },
  { from: 'cfo', to: 'vps', type: 'friction' },
  { from: 'cto', to: 'vpe', type: 'strong' },
]

const CONTACT_HISTORY = [
  { date: 'Today, 10:42 AM', title: 'Opened Pricing Proposal',  detail: 'Viewed for 4m 12s. High engagement on the enterprise tier comparison.', dot: 'brand-muted' },
  { date: 'Oct 12, 2:30 PM', title: 'Discovery Call',          detail: 'Expressed clear urgency around Q4 deliverables. Mentioned budget constraints from CFO.', dot: 'brand' },
  { date: 'Sep 28, 9:00 AM', title: 'LinkedIn Connection',     detail: 'Accepted invite after targeted outreach campaign.', dot: 'border' },
]
```

**Sentiment color helpers:**
```typescript
const sentimentBorderColor = { positive: '#22C55E', neutral: '#EAB308', negative: '#B91C1C' }
const sentimentScoreClasses = {
  positive: 'bg-score-positive-bg text-score-positive-text border-score-positive-border',
  neutral:  'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]',
  negative: 'bg-danger-light text-danger border-danger-light',
}
const edgeStroke = { strong: '#22C55E', neutral: '#94A3B8', friction: '#B91C1C' }
const edgeDash  = { strong: undefined, neutral: undefined, friction: '4 4' }
```

**Layout:** `flex h-full` (fills FocusedLayout's flex-1 container)

```
┌──────────────────────────────────────────────────────────┐
│  Left panel 280px │  Canvas (flex-1)  │  Right panel 320px│
│  Map Filters      │  bg-grid, pannable│  Node detail       │
└──────────────────────────────────────────────────────────┘
```

**Left panel (280px, border-r):**
- "Map Filters" heading + description
- Checkboxes for Roles (Decision Makers / Champions / Blockers / Influencers) — visual only, no filter logic
- Sentiment legend (dots only, no interactivity)
- "Add Node" + "Sync from Salesforce" buttons (visual only)

**Canvas area (flex-1, overflow-hidden, cursor-grab/grabbing):**
```typescript
const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
const [isDragging, setIsDragging] = useState(false)
const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

// Mouse handlers on the canvas wrapper:
onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }) }}
onMouseMove={(e) => { if (isDragging) setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }) }}
onMouseUp={() => setIsDragging(false)}
onMouseLeave={() => setIsDragging(false)}
```

Inside canvas: single `<div style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }} className="absolute inset-0">` containing:
1. SVG layer: `<svg className="absolute inset-0 w-full h-full pointer-events-none">` with edge paths:
   - Path formula for edge from node A to node B: `M ${A.x+90} ${A.y+32} C ${A.x+90} ${(A.y+B.y)/2}, ${B.x+90} ${(A.y+B.y)/2}, ${B.x+90} ${B.y}`
   - Strong/neutral: solid stroke, friction: `strokeDasharray="4 4"`
   - Each stroke color from `edgeStroke[edge.type]`
2. Node cards (absolutely positioned):
   ```tsx
   <div
     key={node.id}
     className={`absolute w-[180px] bg-surface border border-border p-3 cursor-pointer hover:border-text-muted transition-colors ${selectedNode?.id === node.id ? 'border-brand border-2' : ''}`}
     style={{ top: node.y, left: node.x, borderLeft: `4px solid ${sentimentBorderColor[node.sentiment]}` }}
     onClick={() => setSelectedNode(node)}
   >
     <div className="flex justify-between items-start mb-1">
       <span className="text-sm font-semibold text-text-base truncate max-w-[110px]">{node.name}</span>
       <span className={`text-[10px] font-mono px-1 border rounded ${sentimentScoreClasses[node.sentiment]}`}>{node.score}</span>
     </div>
     <div className="text-xs text-text-muted truncate">{node.title}</div>
   </div>
   ```

Canvas toolbar (absolute, top-6 left-6):
- "Live Sync: Active" chip with pulsing green dot

Canvas controls (absolute, bottom-6 right-6):
- Zoom in / Zoom out / Fit to screen buttons (visual only — just `+`, `-`, `fit_screen` icons in white bordered box)

**Right panel (320px, border-l):** Shown when `selectedNode !== null`
```typescript
const [selectedNode, setSelectedNode] = useState<MapNode | null>(NODES[0])  // CEO selected by default
```
- Close button (top-right) → `setSelectedNode(null)`
- Node header: initials box (40×40, bg-surface-subtle border, font-heading text-brand) + name + title
- 2-col stat grid: "Rel Score" (large, text-brand-muted) + "Role Type" ("Champion")
- "Contact History" section: vertical timeline (`border-l border-border ml-2 pl-4 space-y-6`)
  - Each item: dot (absolute -left) + date in font-mono + title + detail
- Internal Notes: `<textarea>` + "Save Note" button (brand bg)

**State:**
```typescript
const [selectedNode, setSelectedNode] = useState<MapNode | null>(NODES[0])
const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
const [isDragging, setIsDragging] = useState(false)
const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
```

**Step 1: Implement DecisionMakerMap.tsx** (read reference first)

**Step 2: Verify** — navigate to `/crm/map/acme`. Drag to pan canvas. Click node to open panel.

**Step 3: Commit**
```bash
git add src/features/crm/DecisionMakerMap.tsx
git commit -m "feat: implement Decision Maker Map with pannable canvas"
```

---

## POST-PARALLEL CLEANUP

### Task 16: Final integration check

**Step 1: Run the dev server**

```bash
npm run dev
```

Navigate through all routes:
- `/crm/dashboard` — stat cards, table search filters
- `/crm/feed` — tabs filter feed items
- `/crm/accounts` — row click navigates to dossier
- `/crm/deals` — kanban scrolls horizontally
- `/crm/settings` — switches toggle
- `/crm/dossier/acme` — copy button, "View Full Map" link
- `/crm/map/acme` — canvas pans on drag, node click opens panel

**Step 2: Run tests**

```bash
npm run test:run
```

Expected: All existing tests pass (no new tests required for this phase).

**Step 3: Commit any fixes found during review**

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete all 7 CRM screens with shadcn/ui integration"
```
