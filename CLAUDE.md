# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A **design/prototype stage** repository for the Nadi Airtechnics Unified Operations Platform — a role-aware operations layer that sits around SAP Business One (ERP system of record) and AutoCAD Vault (drawing/revision system of record) to replace the operational role of a shared "Pending Order" Excel workbook.

There is **no application yet** — no `package.json`, build system, git, tests, or linting. The repository holds:

- `nadi-operations-dashboard-v3.jsx` — **the current working artifact**. Single-file, self-contained React prototype. Enhances v2 with: an always-visible per-order **discussion rail** (each stakeholder holds a formal Yes/No/Thinking position + threaded comments), a management **Revenue plan** view (monthly target vs billed vs shortfall), **multi-line OA** support (one OA → many Epicor lines), **drive type** (Direct/Coupled/Belt, which governs sub-assemblies), **payment terms** as a dispatch condition, a **legacy-code decode** (RE/FQC/ASS…), and an order **lifecycle** (active/aged/dead/cancelled) with Orders filters and service/spares order types.
- `nadi-operations-dashboard-v2.jsx` — the prior version, kept for reference. Do not edit; work in v3.
- `Nadi_Airtechnics_Unified_Operations_Platform_PRD.md` — the authoritative PRD. Read this before making product/UX decisions; it defines the principles the prototype implements.
- `Nadi Airtechnics Operations Platform Flow Updated.docx` and `NADI Excel Screenshots/` — source material (the current Excel-based process and business flow the platform replaces). The screenshots show the real "Pending Order" workbook (501 rows; columns include OA/Epicor/SAP, INSP, CODE=product type A/C/S, Agents, Motor scope NM/CM/NA, Crate/Wooden-crate status, MFG & Revenue plan months, PLAN WEEK which mixes weeks with states, a free-text "FAN STATUS AS ON" cell, and legacy ST codes), the separate "Manufacturing plan sheet" (Hub/Shaft/Impeller/Casing readiness — Shaft is N/A for direct drive), and a "Pending Order Summery" tab (monthly Invoiced/Target/Shortfall, inventory FG/SFG/WIP).

## Running the prototype

`nadi-operations-dashboard-v2.jsx` is a standalone React component with **no build tooling in the repo**. It has zero external dependencies beyond `react` (imports only `useState`, `useMemo`) and inlines all styling as a single `CSS` template string injected via `<style>` — no CSS files, no component libraries, no Tailwind. Fonts load from Google Fonts at runtime.

To preview it, drop it into a React sandbox (Vite, CodeSandbox, or similar) as the default export. Do not assume a dev server or test runner exists; if the user wants one scaffolded, ask which toolchain before adding config.

**Validating changes without a project toolchain.** esbuild parses/transforms the file for a fast syntax check: `npx esbuild nadi-operations-dashboard-v3.jsx --format=esm --outfile=<tmp>` (loader is inferred from `.jsx`; exit 0 = valid). For a runtime check, in a scratch dir with `react`/`react-dom` installed, bundle a harness that `renderToString`s the components (temporarily append `export { … }` to a scratch copy — every view takes an `open`/`toast` noop, `Workspace` takes `order, back, role, disc, onPost`) with `--external:react --external:react-dom`; this catches bad references and data-shape crashes across all views/orders. Server render only exercises the initial tab, so tab-gated content (Build/Operations/Supply/Dispatch-gate) still needs a browser click-through.

## Prototype architecture (`nadi-operations-dashboard-v2.jsx`)

The whole app is one file, structured top-to-bottom as: `CSS` string → domain constants/mock data → shared components → view components → the `App` shell. Understanding it requires holding a few cross-cutting concepts together:

**The single spine.** Both order classes ("Catalogue" and "Project") ride the same 8 checkpoints in `SPINE` (`Order accepted` → … → `Dispatched`). An order's position is expressed as **one checkpoint + one state**, deliberately *not* four status columns — this is the core product idea (see PRD §29, §45). The `<Spine>` component renders progress by finding `SPINE.indexOf(order.checkpoint)`, so `order.checkpoint` values **must exactly match strings in `SPINE`**.

**State vocabulary.** `STATE_MAP` is the single source for how a state renders (CSS class, glyph, label). States are `at-risk`, `blocked`, `warn`, `watch`, `on-track`. Color is always paired with a glyph + text label — never color alone (PRD §11 rule 11, §52). Reuse `<State level=... text=... />` for any status pill; don't hand-roll status colors.

**Role-aware shell.** `App` holds `role`, `view`, and `oa` (selected order) in state. `ROLES` maps each role to a person and a `nav` allow-list; `NAV` maps nav keys to labels. Switching role resets to that role's first nav item. Each role sees a filtered surface, never the full database (PRD §12, §41) — the `ATTENTION` feed items carry a `roles` array and `Today` filters by the active role. When adding a view, wire it in three places: the `NAV`/`ROLES` entries, the `counts` object, and the `body` dispatch chain in `App`.

**Data shape drives the UI.** `ORDERS` is the mock dataset and every order object is a dense record: identity (`oa`, `epicor`, `sap`, `custPo`), dates (`need`/`promise`/`revised`), `checkpoint`+`state`, plus nested `subitems`, `supply`, `gate`, `exceptions`, `catch`, `timeline`, and (Project orders only) `operations`. Views derive everything from these — e.g. `Supply` flattens all orders' `supply` rows and sorts by `age`; `Dispatch`/`GateBody` compute dispatchability from `gate` entries where `s === "fail"`. When adding a field, add it across all orders in `ORDERS` so views don't break on `undefined`.

**Order class differences.** `order.cls` is `"Catalogue"` or `"Project"`. Project orders have an `operations` array (with contractual `hold` points) and show an "Operations" tab; Catalogue orders show a "Build" tab (sub-assembly readiness). The `Workspace` component picks the tab label via `order.cls === "Project" ? "Operations" : "Build"`. Quality hold points are surfaced by scanning `order.operations` for `hold && s !== "Passed"`.

**The dispatch gate** is the one hard business rule modeled: an order is dispatchable only when no `gate` entry has `s === "fail"`. `GateBody` disables the Dispatch button and names the missing conditions. In v3 `GateBody` also appends a computed **Payment cleared** row from `order.payState` (`received`/`na`/`advance-only`), so payment terms gate dispatch too. Preserve this "block, don't warn" behavior (PRD §23).

**v3 discussion model.** `DISCUSSIONS` is keyed by OA; each entry has `stances` (role → `yes`/`no`/`thinking`) and a `comments` array. The state is **lifted into `App`** (`useState(DISCUSSIONS)`) and passed into `Workspace` as `disc={disc[order.oa]}` with an `onPost(oaId, entry)` handler that prepends the comment and updates that role's stance. The `Discussion` component (always-rendered right rail, not tab-gated) posts **as the active "Viewing as" role**; `STAKEHOLDERS` lists the decision roles in handoff order, `STANCE_MAP` is the single source for stance pill rendering (mirrors `STATE_MAP`). Discussions are deliberately **contained to the order** — they do not feed Today or the Timeline. When adding a role to `STAKEHOLDERS`, ensure it exists in `ROLES` (v3 added `sales`, `design`, `stores`).

## Conventions to follow when editing the prototype

- The UI copy is intentionally plain-language and department-native ("Waiting for the motor", "Ready to leave"), not ERP/technical codes — match this tone (PRD §11 rule 2, §29 UX rule).
- `.mono` class + `font-feature-settings:'tnum'` is used for all identifiers and numbers; keep OA numbers, dates, and quantities monospaced.
- Currency is Indian formatting (₹, lakh/crore) and dates are `DD-MM-YYYY`.
- Mock data reflects a fixed "today" of **8 September 2026** (see the topbar and computed ageing like "66 days"). If you change dates, keep ageing figures internally consistent.

## When making product decisions

The PRD is the spec. Key non-negotiables that constrain any change: one order = one connected history; show current state first; every exception has an owner + due date; no silent handoffs; the platform never becomes a second master database competing with SAP/Vault (PRD §42–43 data-ownership table). Phase 1 scope is Order Intake → Planning → Manufacturing → Despatch; installation/service/vendor-portal/customer-portal are explicitly Phase 2 (PRD §6).
