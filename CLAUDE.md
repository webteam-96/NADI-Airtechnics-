# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **design/prototype stage** repository for the Nadi Airtechnics Unified Operations Platform — a role-aware operations layer that sits around SAP Business One (ERP system of record) and AutoCAD Vault (drawing/revision system of record) to replace the operational role of a shared "Pending Order" Excel workbook.

There is still **no project toolchain** — no `package.json`, declared build system, test runner, or linting. The repo is under **git** (branch `main`). The repository holds:

- `nadi-operations-dashboard-v3.jsx` — **the current working artifact**. Single-file, self-contained React prototype, **reframed to the V6 Functional Flow** (`NADI Airtechnics Functional Flow V6.pdf`, internally v1.5). It now centres on the flow's three ranked pillars around SAP Business One — **Schedule** (finite-capacity, forward/backward, freeze), **Capacity** (load vs available by day/week/month, overloaded work centres), **Shop floor** (START/STOP at manufacturing-order level, closure posted to SAP) — plus the **4 dashboards**, a **Where-orders-stand** roll-up, an **Integration & audit** view, and an extended **Today**. Roles are the flow's five (Planning, Production supervisor, Projects, Management & dashboards, System administrator). It still keeps multi-line OA, drive type, the legacy-code decode and order lifecycle. The v2 **discussion rail** is simplified to the Projects model (holds + comments + revised-date history, no Yes/No/Thinking stances) and the **Revenue plan** is removed (the platform holds no money figures, §5.3). See "V6 reframe" below.
- `index.html` + `app.js` — the **deployable static build**: `app.js` is a prebuilt, minified esbuild bundle of the v3 component (React bundled in) that mounts via `createRoot` on `#root`; `index.html` loads it. This is a build artifact committed for one-click browser preview — it is *generated from the v3 JSX, not edited by hand*. Regenerate it after changing v3 (see "Running the prototype") rather than editing `app.js` directly.
- `nadi-operations-dashboard-v2.jsx` — the prior version, kept for reference. Do not edit; work in v3.
- `Nadi_Airtechnics_Unified_Operations_Platform_PRD.md` — the authoritative PRD. Read this before making product/UX decisions; it defines the principles the prototype implements.
- `nadi-workflow-as-is-to-be.md` — the as-is (Excel process) → to-be (platform) workflow mapping, a companion to the PRD.
- `Nadi Airtechnics Operations Platform Flow Updated.docx` and `NADI Excel Screenshots/` (the screenshots dir is **git-ignored**, present locally only) — source material (the current Excel-based process and business flow the platform replaces). The screenshots show the real "Pending Order" workbook (501 rows; columns include OA/Epicor/SAP, INSP, CODE=product type A/C/S, Agents, Motor scope NM/CM/NA, Crate/Wooden-crate status, MFG & Revenue plan months, PLAN WEEK which mixes weeks with states, a free-text "FAN STATUS AS ON" cell, and legacy ST codes), the separate "Manufacturing plan sheet" (Hub/Shaft/Impeller/Casing readiness — Shaft is N/A for direct drive), and a "Pending Order Summery" tab (monthly Invoiced/Target/Shortfall, inventory FG/SFG/WIP).

## Running the prototype

The dashboard JSX (`nadi-operations-dashboard-v3.jsx`, and v2) is a standalone React component with **no build tooling in the repo**. Its only dependency is `react` (`import React, { useState, useMemo } from "react"`) and it inlines all styling as a single `CSS` template string injected via `<style>` — no CSS files, no component libraries, no Tailwind. Fonts load from Google Fonts at runtime.

**Quickest preview:** open `index.html` in a browser — `app.js` is the already-built v3 bundle, so no toolchain is needed to see the current prototype. **After editing `nadi-operations-dashboard-v3.jsx`, `app.js` is stale** until you rebuild it. Do not hand-edit `app.js`. The repo has no `node_modules`, so rebuild from a scratch dir that has React installed, with a tiny bootstrap that mounts `App` on `#root`:

```
# in a scratch dir containing: react@18.3.1, react-dom@18.3.1
#   bootstrap.jsx:
#     import React from "react";
#     import { createRoot } from "react-dom/client";
#     import App from "<abs path to a copy of the v3 jsx in this dir>";
#     const el = document.getElementById("root");
#     if (el) createRoot(el).render(React.createElement(App));
npx esbuild bootstrap.jsx --bundle --minify \
  --outfile="<repo>/app.js" --loader:.jsx=jsx \
  --define:process.env.NODE_ENV='"production"'
```

(esbuild resolves `react` from the file's own dir, so the v3 copy must sit in the scratch dir, not be imported by absolute path from the repo. Default platform = browser → IIFE, matching the committed `app.js`.)

Alternatively, drop the JSX into a React sandbox (Vite, CodeSandbox, or similar) as the default export. Do not assume a dev server or test runner exists; if the user wants one scaffolded, ask which toolchain before adding config.

**Validating changes without a project toolchain.** esbuild parses/transforms the file for a fast syntax check: `npx esbuild nadi-operations-dashboard-v3.jsx --format=esm --outfile=<tmp>` (loader is inferred from `.jsx`; exit 0 = valid). For a runtime check, in a scratch dir with `react`/`react-dom` installed, bundle a harness that `renderToString`s the components (temporarily append `export { … }` to a scratch copy — every view takes an `open`/`toast` noop, `Workspace` takes `order, back, role, disc, onPost`) with `--external:react --external:react-dom`; this catches bad references and data-shape crashes across all views/orders. Server render only exercises the initial tab, so tab-gated content (Schedule freeze, ShopFloor START/STOP, Capacity period toggle, Workspace Build/Operations) still needs a browser click-through.

## Prototype architecture (`nadi-operations-dashboard-v3.jsx`)

This describes v3 (the working artifact); v2 shares the same spine, shell, and data model, minus the v3 additions (discussion rail, revenue plan, payment gating, lifecycle). The whole app is one file, structured top-to-bottom as: `CSS` string → domain constants/mock data → shared components → view components → the `App` shell. Understanding it requires holding a few cross-cutting concepts together:

**The single spine.** Both order classes ("Catalogue" and "Project") ride the same 8 checkpoints in `SPINE` (`Order accepted` → … → `Dispatched`). An order's position is expressed as **one checkpoint + one state**, deliberately *not* four status columns — this is the core product idea (see PRD §29, §45). The `<Spine>` component renders progress by finding `SPINE.indexOf(order.checkpoint)`, so `order.checkpoint` values **must exactly match strings in `SPINE`**.

**State vocabulary.** `STATE_MAP` is the single source for how a state renders (CSS class, glyph, label). States are `at-risk`, `blocked`, `warn`, `watch`, `on-track`. Color is always paired with a glyph + text label — never color alone (PRD §11 rule 11, §52). Reuse `<State level=... text=... />` for any status pill; don't hand-roll status colors.

**Role-aware shell.** `App` holds `role`, `view`, and `oa` (selected order) in state. `ROLES` maps each role to a person and a `nav` allow-list; `NAV` maps nav keys to labels. Switching role resets to that role's first nav item. Each role sees a filtered surface, never the full database (PRD §12, §41) — the `ATTENTION` feed items carry a `roles` array and `Today` filters by the active role. When adding a view, wire it in three places: the `NAV`/`ROLES` entries, the `counts` object, and the `body` dispatch chain in `App`.

**Data shape drives the UI.** `ORDERS` is the mock dataset and every order object is a dense record: identity (`oa`, `epicor`, `sap`, `custPo`), dates (`need`/`promise`/`revised`), `checkpoint`+`state`, plus nested `subitems`, `supply`, `gate`, `exceptions`, `catch`, `timeline`, and (Project orders only) `operations`. Views derive everything from these — e.g. `Supply` flattens all orders' `supply` rows and sorts by `age`; `Dispatch`/`GateBody` compute dispatchability from `gate` entries where `s === "fail"`. When adding a field, add it across all orders in `ORDERS` so views don't break on `undefined`.

**Order class differences.** `order.cls` is `"Catalogue"` or `"Project"`. Project orders have an `operations` array (with contractual `hold` points) and show an "Operations" tab; Catalogue orders show a "Build" tab (sub-assembly readiness). The `Workspace` component picks the tab label via `order.cls === "Project" ? "Operations" : "Build"`. Quality hold points are surfaced by scanning `order.operations` for `hold && s !== "Passed"`.

**The dispatch gate** is the one hard business rule modeled: an order is dispatchable only when no `gate` entry has `s === "fail"`. `GateBody` disables the Dispatch button and names the missing conditions. In v3 `GateBody` also appends a computed **Payment cleared** row from `order.payState` (`received`/`na`/`advance-only`), so payment terms gate dispatch too. Preserve this "block, don't warn" behavior (PRD §23).

**Discussion rail (reframed).** `DISCUSSIONS` is keyed by OA with a `comments` array (the old per-role `stances` are gone). State is **lifted into `App`** (`useState(DISCUSSIONS)`) and passed into `Workspace` as `disc={disc[order.oa]}` with an `onPost(oaId, entry)` handler that prepends the comment. The `Discussion` component (always-rendered right rail) now shows **Holds & dates** (current state, promised-vs-committed, the order's exceptions as holds) + a threaded **Comments** list; it posts as the active "Viewing as" role. Comments from historical departments (purchase, quality, …) render via `roleLabel`/`roleAvatar` (`HIST_ROLE` fallback) since those are no longer platform roles. Still contained to the order — does not feed Today or the Timeline.

## V6 reframe — data model, views, roles

The prototype was realigned to the V6 Functional Flow. The flow's unit of work is the **Manufacturing Order (MO) under a sales-order line**, each with a **route of operations on work centres** — this is layered on as **side-structures keyed by OA** (the same pattern as `DISCUSSIONS`), leaving `ORDERS`/`SPINE` intact:

- **`WORKGROUPS` / `WORKCENTRES`** — shop groups and work centres with `shiftHrs`/`shifts`/`downtime` (capacity); two `subcontract` centres are lead-time-dated. `CAL_ADJUST` holds overtime/extra-shift changes. Read-from-SAP in the fiction (§7.1); platform-held schedule data per §7.2.
- **`MOS`** (keyed by OA) — the core. Each MO: `soLine`, `item`, `route[]` (`{op, wc, hrs, s, hold?, subcontract?}`), `schedStart/End`, `frozen`, `status` (`unscheduled|scheduled|started|stopped`), `startAt/stopAt`, `stoppages[]`, `rejections[]`, `closurePosted` (`false|"pending"|true`), `waitingFor` (`"material:…"|"route"|"BOM"`). Service/spare/cancelled orders carry **no MO**. `BOUGHTOUT` dates material by item-code lead time first, else open-PO due (§9.1.5).
- **`MO_STATE` / `CLOSURE_STATE`** — render vocab (reuse `STATE_MAP` CSS classes). **`INTERFACES` / `AUDIT`** — the 8 SAP interfaces and the idempotent message log (§16.1).
- **Scheduling/capacity helpers** (above `Schedule`): `allMOs()`, `wcDailyHours`/`wcAvailable(w, period)` (`WORKDAYS = {day:1, week:6, month:26}`), `wcLoad()`, `wcClashes()` (equal-need-date), `materialDate()`, `cmpDate`/`toDate`/`daysBetween`, `committedOf`/`scheduledEndOf`, `moPill`/`routeProgress`.

**Views** (all take `{open?, toast?}`): `Schedule` (direction toggle, freeze/unfreeze, waiting-for-BOM/route, clashes, bought-out dating), `Capacity` (period toggle, load-vs-available bars per work group, overload highlight, overtime), `ShopFloor` (MOs grouped by SO line, local-state START/STOP, stoppage/rejection chips, closure status), `Dashboards` (the 4: on-time at component + SO-line level, job status, utilisation & OEE, capacity vs load), `OrderStands` (SO-line roll-up), `Integration` (interfaces + audit log with retry). `Today` gained an **Operational signals** card (overloaded WCs, unposted closures, unscheduled). `Orders` and `Workspace` are kept.

**Roles** are the flow's five: `planning`, `supervisor`, `projects`, `management`, `admin` (System administrator → `integration`). The out-of-scope departments (sales/design/purchase/stores/quality/dispatch/operator) and their views (`Supply`/`Quality`/`Dispatch`/`Operator`/`Production`/`Planning`/`Reports`/`Revenue`) and data (`JOBS`/`WEEK_COLS`/`REVENUE`/stance constants) were **removed**. To add a view, still wire it in `NAV`, the relevant `ROLES.nav`, `counts`, and the `App` body dispatch chain.

**Validating the reframe.** esbuild syntax check as below; then the `renderToString` harness should cover `Schedule`/`Capacity`/`ShopFloor`/`Dashboards`/`OrderStands`/`Integration`/`Orders`/`Today`(per role)/`App`, and `Workspace` across all `ORDERS` (the rail + MO detail). Mock "today" stays **8 September 2026**.

## Conventions to follow when editing the prototype

- The UI copy is intentionally plain-language and department-native ("Waiting for the motor", "Ready to leave"), not ERP/technical codes — match this tone (PRD §11 rule 2, §29 UX rule).
- `.mono` class + `font-feature-settings:'tnum'` is used for all identifiers and numbers; keep OA numbers, dates, and quantities monospaced.
- Currency is Indian formatting (₹, lakh/crore) and dates are `DD-MM-YYYY`.
- Mock data reflects a fixed "today" of **8 September 2026** (see the topbar and computed ageing like "66 days"). If you change dates, keep ageing figures internally consistent.

## When making product decisions

The PRD is the spec. Key non-negotiables that constrain any change: one order = one connected history; show current state first; every exception has an owner + due date; no silent handoffs; the platform never becomes a second master database competing with SAP/Vault (PRD §42–43 data-ownership table). Phase 1 scope is Order Intake → Planning → Manufacturing → Despatch; installation/service/vendor-portal/customer-portal are explicitly Phase 2 (PRD §6).
