# QA Visual Inspection Findings

Inspected all screens at `http://localhost:5173` on 2026-03-25 via Cursor embedded browser (1024px viewport).

---

## GLOBAL: Material Symbols icons rendering as raw text

**Severity:** High — affects every screen in the app.

The `material-symbols-outlined` web font is not loading. Every `<span class="material-symbols-outlined">` renders its text content as a plain string instead of the expected glyph. Examples visible across all screenshots:

| Screen | What renders | Expected glyph |
|--------|-------------|-----------------|
| CRM sidebar nav | `DASHBOARD`, `DESCRIPTION`, `ACCOUNT_TREE`, `SENSORS`, `ANALYTICS`, `HANDSHAKE`, `SETTINGS_INPUT_COMPONENT` | Respective Material Symbol icons inline before the label |
| Dashboard topnav | `notifications`, `settings` as plain text | Bell and gear icons |
| Dashboard stat card | `trending_up` as green text | Upward-trend arrow icon |
| Dashboard buttons | `filter_list Filter View` — icon name bleeds into button label | Funnel icon left of "Filter View" |
| Dashboard table search | `search` text visible behind placeholder | Magnifying glass icon |
| Intelligence Feed | `person_add`, `payments`, `trending_down`, `language`, `progress_activity` all render as serif-sized text overlapping content | Respective icon glyphs (person+, cash, down-arrow, globe, spinner) |
| Account List table | `electric_car`, `construction`, `account_balance`, `power` render as large raw text overlapping account names | Icon glyphs inside the colored tile |
| Account List pagination | `chevron_left`, `chevron_right` as text strings | Left/right arrow icons |
| Account List bento | `verified` as green text next to "Top Contributor" | Verified badge icon |
| Settings integrations | `ev_station`, `eco`, `domain`, `cloud` as text in card headers | Integration-specific icons |
| Settings right column | `person_add` as text next to "Team Members" heading | Add-person icon button |
| Dossier | `arrow_back`, `domain`, `newspaper`, `bolt`, `check_circle`, `star` all as text | Back arrow, building, news, lightning, checkmark, star icons |
| Decision Maker Map | `arrow_back`, `add`, `remove`, `fit_screen`, `close` as text | Icon buttons for back, zoom +/-, fit, close |
| Onboarding sidebar | `ANALYTICS`, `GROUP`, `TARGET`, `TRENDING_UP` as text before step labels | Step icons |
| Onboarding cards | `ev_charger`, `developer_board`, `construction`, `build` as text | Product-type icons |
| Onboarding topnav | `help`, `notifications` as text | Help circle, bell icons |

**Root cause:** The Google Fonts `@import` for Material Symbols in `src/index.css` is placed after the `@tailwind` directives. PostCSS warns: `@import must precede all other statements`. The browser may be ignoring or failing to fetch the font. The Cursor embedded browser may also be blocking the external Google Fonts CDN request.

**Expected:** Each icon span should render a single Material Symbol glyph at the configured optical size, not a text string.

---

## GLOBAL: CRM sidebar nav labels show icon name + label (doubled text)

**Severity:** Medium — affects CRM sidebar on all CRM screens.

Each sidebar link renders as two words on separate lines: the icon text content (e.g. `DASHBOARD`) followed by the label (e.g. `DASHBOARD`). Because the icon font is not loading, the icon `<span>` text and the label `<span>` text both display, e.g. "DASHBOARD DASHBOARD", "DESCRIPTION DOSSIER", "ACCOUNT_TREE DECISION MAP".

**Expected:** A small icon glyph followed by a single label, on one line.

---

## GLOBAL: Topnav icon buttons show raw text instead of icons

**Severity:** Medium — affects CRM topnav on all CRM screens.

The topnav right side shows `notifications` and `settings` as plain text. The search input also has a visible `search` text string overlapping or adjacent to the placeholder.

**Expected:** A bell icon, a gear icon, and a search (magnifying glass) icon.

---

## Dashboard: StatCard trend icon renders as text

**Severity:** Low — cosmetic.

The "New Triggers" stat card shows `trending_up +3 since yesterday` as a single line of green text. The `trending_up` portion should be a small upward-arrow icon.

**Expected:** A green upward-trend icon followed by "+3 since yesterday".

---

## Intelligence Feed: Icon tiles show icon name text bleeding over content

**Severity:** High — significantly degrades the feed layout.

Each feed event's left icon tile (40x40 box) renders the icon name as full text (e.g. `person_add`, `payments`, `trending_down`, `language`) which overflows the tile and bleeds into adjacent content (time, account name).

**Expected:** A 40x40 bordered box containing a centered Material Symbol glyph.

---

## Intelligence Feed: Loading spinner at bottom shows raw text

**Severity:** Low — cosmetic.

The bottom of the feed shows `progress_activity LOADING OLDER SIGNALS...` with the icon name as text.

**Expected:** A spinning progress indicator icon followed by "LOADING OLDER SIGNALS...".

---

## Account List: Icon tiles in account name column overflow

**Severity:** High — breaks table layout.

The account name column renders the icon name as full text (e.g. `electric_car`, `construction`, `account_balance`, `power`) in large font, pushing the account name text to the right and causing misalignment of the entire row.

**Expected:** A 40x40 colored tile with a centered icon glyph.

---

## Account List: Pagination renders icon names as text

**Severity:** Low — cosmetic.

The pagination row shows `chevron_left 1 2 3 chevron_right` with the chevron icon names as text strings.

**Expected:** Left-arrow icon, page buttons, right-arrow icon.

---

## Settings: Integration card icons render as text

**Severity:** Medium — cards feel incomplete.

Each integration card header shows the icon name in text (e.g. `ev_station`, `eco`, `domain`, `cloud`) instead of the expected icon glyph.

**Expected:** A 40x40 muted-bg tile with a centered integration icon.

---

## Settings: Gear icon buttons in integration cards render as text

**Severity:** Low — cosmetic.

Each integration card footer shows the word `settings` as text where a small gear icon button should be.

**Expected:** A small gear icon.

---

## Dossier: Multiple icon names render as text

**Severity:** Medium — degrades the professional appearance.

- "domain Firmographics" — the word `domain` precedes the heading
- "newspaper Recent News" — the word `newspaper` precedes the heading
- "bolt" and "check_circle" in the Why NOW section render as text
- "star" next to Jane Doe renders as colored text instead of a star icon
- `arrow_back` in the FocusedLayout header renders as text before "Back"

**Expected:** Each should be a small icon glyph, not a text label.

---

## Decision Maker Map: Zoom controls render as text

**Severity:** Low — cosmetic.

The bottom-right zoom toolbar shows `add`, `remove`, `fit_screen` as text instead of `+`, `-`, and fit-screen icons.

**Expected:** Icon buttons with +, -, and fit-to-screen glyphs.

---

## Decision Maker Map: Close button in detail panel renders as text

**Severity:** Low — cosmetic.

The right panel close button shows `close` as text.

**Expected:** An X icon.

---

## Onboarding: Sidebar step icons render as large text

**Severity:** Medium — breaks sidebar layout.

The onboarding sidebar shows `ANALYTICS`, `GROUP`, `TARGET`, `TRENDING_UP` as full-width text before each step label, pushing labels to a second line.

**Expected:** Small step icons (chart, people, target, trend) inline before each label.

---

## Onboarding: Product option card icons render as text

**Severity:** Medium — cards feel broken.

Each product-type option card shows the icon name (e.g. `ev_charger`, `developer_board`, `construction`, `build`) as styled text in the icon tile area.

**Expected:** A small icon inside a muted-bg rounded tile.

---

## Summary

All findings trace to a single root cause: **the Material Symbols Outlined web font is not loading**. Every icon in the app uses `<span class="material-symbols-outlined">icon_name</span>`, which falls back to rendering the text content when the font is absent.

**Fix approach:** Ensure the `@import` for Material Symbols in `src/index.css` is placed before any `@tailwind` directives, or switch to a `<link>` tag in `index.html` so the font loads independent of CSS processing order.

---

## Resolution (2026-03-25)

**Implemented:** Google Fonts (text stack + Material Symbols Outlined) are loaded from [`index.html`](index.html) via `preconnect` + `<link rel="stylesheet">`. The invalid `@import` lines were removed from [`src/index.css`](src/index.css), which clears the PostCSS `@import must precede all other statements` warning and allows `.material-symbols-outlined` spans to render as glyphs in normal browsers.

**Verify:** Hard-refresh the app; icons should appear across CRM, onboarding, and focused layouts. Production `index.html` in `dist/` includes the same links after `npm run build`.
