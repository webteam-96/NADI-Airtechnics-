# Nadi Airtechnics — Current Workflow, Revamped Workflow, and Migration Map

Based on the Pending Order workbook, the Manufacturing Plan sheet, the network shares, and the summary/production reports in the screenshots, read against the Revision 3 process document.

---

## Part 1 — What the attachments actually show

| Artifact | What it is | Who maintains it |
|---|---|---|
| **Pending order** tab (501 rows, ~50 columns A→AX) | The real operating system of the company | Projects + Planning |
| **Manufacturing plan sheet — Sep 2026** | Component-level readiness per OA line (Hub, Shaft, Imp, Case) | Planning |
| **Pending Order Summary** tab | Manually derived monthly money view — invoiced, executable order by entity, target, shortfall | Planning / Commercial |
| **COO** and **CANCELLED** tabs | Side registers hanging off the same workbook | Planning |
| Weight pivot (DOM-FAB-COMP / DOM-FAB / RLW-A-FAB / RLW-W-FAB) | Capacity planning in kilograms of fabrication per month | Planning |
| Nett Production / Inventory (FG, SFG, WIP) sheet | Monthly production and inventory against target | Finance / Planning |
| `\\192.168.0.215` department shares | Administration, Engineering, Finance, HR, IT, Production, Quality Control, Sales, Service, Stores, Supply Chain | Each department |
| Planning share (DEVA-17-18 → DEVA-26-27, OA Committment, OTD Report, Impeller Planning, DGM Planning) | Year-wise and topic-wise file trees | Planning |
| Production share (Machine Shop, Impeller, Assembly, Painting, Testing, Packing) | Section-wise file trees | Production |
| **Per-project Gantt** (e.g. `BALLAS…` workbook, tabs *Core Energy* / *Core Energy (2)*) | Operation-level schedule with QAP hold points for engineered orders | Planning / Projects |

The full column set of the Pending order tab, left to right, is: `OA NO`, `SAP NO`, `GA APPROVAL REC`, `Epicor No`, `Cust PO NO`, `PO Date`, `PO Cleared Dt`, `OA Relsd. Dt`, `Customer Name`, `INSP`, `Agents`, `CODE`, `Fan Model`, `Qty`, `Amount`, `NEED DATE`, `PROMISED DATE`, `NO. OF DAYS (PROMISED DT–OA)`, `Revised Delivery Date`, `BILL PLANNED`, `YEAR PLANNED`, `Motor scope`, `Motor Expected Date`, `Boughtout`, `Supplier Name/Contact No`, `CRATE CLEARANCE`, `Wooden Crate Status`, `MFG PLAN MONTH`, `REVENUE PLAN MONTH`, `PLAN WEEK`, `Remarks for Boughtouts`, `Shortages – Motor/BO`, `Pending break up`, `Pending`, `FAN STATUS AS ON 05.09.2026`, `Status`, `Stage`, `Dispatch Plan`, `ST`, `PAYMENT TERMS`, `Industry`, `PROJECT STATUS`, `off meeting`, `AB STATUS`, `WEIGHT`, `Drawing committed date`, `READY SINCE`, `Remarks`, `Drg. Recd Date`, `REVISED DRAWING DATE`.

Six observations that matter more than anything else here:

1. **`FAN STATUS AS ON 05.09.2026` is the only column that tells the truth.** Everything around it — `Status`, `Stage`, `ST` — is a code. The actual state lives in free text like *"Mfg drg recd on 25.06.25. Testing completed 26.09.25. Leakage highlighted during customer inspection. New seal recd. Leaking detected after…"*. That column is a hand-typed timeline squeezed into one cell, and it is dated as a snapshot, not maintained live.
2. **One job has three identities.** `OA NO` (20602), `Epicor No` (020602-1-1), `ID Num` (91340/41). The `-1-1` suffix carries line and sub-line, so OA 19962 spreads across six rows. Nothing in the workbook enforces that these stay in step.
3. **`SAP NO` is empty on almost every row.** Column B is blank across the visible data with a single exception (`SQ2627-74-1`). The link to the system of record — the thing the whole integration argument rests on — is not being maintained in the operational sheet. Today the two systems are joined by a human remembering which order is which.
4. **Subtotal rows live inside the data.** Yellow bands sit between order rows: *"BILL BUT NOT MOVED – JULY'26 | 8 | 16,75,262"* at row 3, and later *"211 | 3,20,91,720"* and *"1 | 1,10,400"*. Excel reports `293 of 501 records found` in one state and `Count: 511` in another. Any sort, filter or import over this table breaks it, and no two people reading it get the same total.
5. **`PLAN WEEK` holds two different kinds of value.** Its filter list reads: `Wk-1`, `Wk-2`, `Wk-3`, `Wk-4`, `READY`, `Back log`, `Short Supply`, `HOLD`, `PRE-MAN`. Four of those are weeks and five are statuses. The same is true of `BILL PLANNED` and `YEAR PLANNED`, which carry a month (`JULY'26`, `OCTOBER'26`), a status (`BILLED`, `HOLD`), or a project code (`ALS E-BLOCK`, `ALS(2025-26)`) depending on the row.
6. **The sheet is carrying rows from 2018.** Orders with `NEED DATE` 28-02-2018 and `NO. OF DAYS` of **-322**, parked on `HOLD` with `YEAR PLANNED` 2027-28. Another from 29-01-2022 with a motor receipt note dated 2021. The 501 rows are not 501 live orders, and nobody currently knows the real number.

---

## Part 2 — Current stages, department by department

### Sales
```
Enquiry (Cratio) → Quotation → Customer PO
```
Recorded as: `Customer Name`, `Agents` (Satheesh Kumar R, Raja A, Rajesh C, Banumathy K, Subhamoy Sarkar, Systemair), `CODE` (A / C / S / SERVICE), `Fan Model`, `Qty`, `Amount`, `PAYMENT TERMS`, `Industry`, `INSP` (Self / Client).
Handoff to Projects: verbal + email. Nothing links the quotation to the row that gets created later.
Breaks: `INSP = Client` means a customer inspection call is mandatory before dispatch, but it sits as a label with no gate attached to it.

### Projects
```
PO received → PO cleared → OA released → GA drawing approval received → row inserted in Pending order
```
Recorded as: `OA NO`, `SAP NO`, `Cust PO NO`, `PO Date`, `PO Cleared Dt`, `OA Relsd. Dt`, `GA APPROVAL REC`, `Epicor No`, `ID Num`, `NEED DATE`, `PROMISED DATE`, `NO. OF DAYS (PROMISED DT–OA)`, `PROJECT STATUS`, `off meeting`.

This is the one stage where real events *are* being captured — four dated checkpoints in sequence. It is also where the sheet quietly exposes a problem nobody is measuring: one visible row runs `PO Date 19-10-2025 → PO Cleared 24-10-2025 → OA Released 02-06-2026`. Seven months between a cleared PO and a released OA, invisible because no report subtracts those two columns.

Breaks: OA is added by one person; `SAP NO` is left blank; the derived day-count column produces values from `0` to `145` to `-322` with no rule about what it means.

### Design / Engineering
```
Fan selection → GA drawing → customer approval (if required) → manufacturing drawing → BOM
```
Recorded as: `Drawing committed date`, `Mfg drg recd date`, `REVISED DRAWING DATE`, plus narrative in the FAN STATUS cell ("Mfg drg recd on 30.07.26"). Files sit in AutoCAD Vault and the Engineering share.
Breaks: drawing revision is not tied to the job. Production can be working to an older revision and the sheet won't show it.

### Planning
```
Receive OA → check drawing → decide make vs buy → load into month/week →
maintain Manufacturing Plan (Hub / Shaft / Imp / Case readiness) →
maintain weight loading pivot → chase everyone → update Pending order
```
Recorded as: `MFG PLAN MONTH`, `REVENUE PLAN MONTH`, `PLAN WEEK`, `WEIGHT`, `AB STATUS` (DOM-FAB-COMP etc.), `Revised Delivery Date`, `READY SINCE`, and the whole Manufacturing Plan sheet.
Breaks: Planning is the single editor. The Manufacturing Plan sheet re-lists the same OA rows a second time, so component readiness and order status drift apart. Capacity is planned in kilograms with no link to which machine or section is loaded.

### Purchase / Supply Chain
```
Requirement → PO in SAP → chase supplier → motor / bought-out in → crate arranged
```
Recorded as: `Motor scope` (NA / NM / CM), `Motor Expected Date` ("25/8/26 Motor"), `Boughtout`, `Supplier Name/Contact No`, `Remarks for Boughtouts`, `Shortages – Motor/BO` ("Motor – 25/08", "Motor/Boughtout – 30/08", "Customer Motor", "Boughtout – Yet To", "Nil"), `Pending break up`, `Pending`, plus `CRATE CLEARANCE` and `Wooden Crate Status`.

**The motor is the single most-tracked object in the entire workbook** — five columns exist purely to chase it, and it is the most common reason a fan sits at `Short Supply`. The scope codes appear to be NM (Nadi supplies), CM (customer supplies), NA (no motor) — confirm before build.

Breaks: a shortage is a date typed into a free-text cell. It has no owner, no age, and no history of when it first appeared. `Shortages – Motor/BO`, `Remarks for Boughtouts`, `Pending break up` and `Pending` overlap heavily; different people use different ones.

### Stores
```
Receive → inward inspection → stock → issue to job → issue to vendor → receive back
```
Recorded as: nothing in this workbook. It lives in SAP and the Stores share.
Breaks: the gap between "material received" and "material issued to the job" is invisible to Planning.

### Production
```
Machine Shop → Impeller → Fabrication → Balancing → Assembly → Painting → Testing → Packing
```
Recorded as: `ST` codes (FAB, ASS, ASS/B, ASS/CM, B, CI, DI, FCP, TE, FQC, PD, RE) and `Stage` values (`FP / FQC / PAC`, `ASS/TE`, `Yet To Ass / BO / CM`), plus section folders on the Production share.
Breaks: no start or stop time, no operator, no quantity done. `MFG-BL` (backlog) tells you a job is late but not since when or why.

### Quality
```
Inward inspection → in-process → final (FQC) → customer inspection → release
```
Recorded as: `FQC` inside the `ST` code, plus failure narratives in the FAN STATUS cell.
Breaks: failures and reworks are absorbed into a sentence. Repeat failures by model or vendor cannot be counted.

### Dispatch / Commercial
```
Ready → customer inspection (if INSP = Client) → crate → dispatch plan → invoice → billed
```
Recorded as: `Dispatch Plan`, `CRATE CLEARANCE`, `Wooden Crate Status`, `BILL PLANNED`, `YEAR PLANNED`, `BILLED`, `REVENUE PLAN MONTH`.
Breaks: "READY" appears in three different columns with three different meanings — ready to assemble, ready to dispatch, and ready to bill. The crate columns are blank on most rows, so a fan can be marked ready with no packing arranged. And the workbook contains a standing yellow band literally titled **"BILL BUT NOT MOVED"** — 8 units, ₹16.75 lakh — a known category of finished, invoiced, undispatched stock that has no status of its own.

### Project orders — a second, parallel planning system
```
Order → per-project Gantt workbook → operation schedule with QAP hold points
```
Recorded as: a standalone file per project (e.g. *Core Energy*), listing operations in sequence — Material procurement → Raw material stamping for test piece (stage inspection) → Chemical & mechanical testing (stage inspection) → Material cutting → Flange machining → Casing rolling & long-seam welding → Radiography test (stage inspection) → Flange dimension check (stage inspection) → Casing fitup & welding → Dye penetrant test (stage inspection) → then the same again for Impeller. Each row carries % complete, start, duration, end, and a Gantt bar.

This is the most sophisticated planning Nadi does, and it is completely disconnected from the Pending Order sheet. **Every % complete in the visible screenshot reads 0%**, on a schedule dated Jul-24 — it was built once and never updated.

Breaks: engineered orders and catalogue orders are planned in two different systems with two different vocabularies. Neither knows about the other. The QAP hold points, which are contractual, exist nowhere in the sheet that management reads.

### Management
```
Read Pending Order Summary → compare to target → ask Planning why
```
Recorded as: `Invoiced for the month`, `Executable Order — Dom / Wab / Alst / US LLC`, `Approval Orders Yet To Release`, `Total Order In Hand`, `Target`, `Shortfall for the month`, `Shortfall for the Quarter`, plus the Nett Production and FG/SFG/WIP sheets.
Breaks: the whole summary is re-derived by hand and stamped "REPORT DT: 05-09-2026". By the time it is read it describes a company that existed last week, and no number can be clicked to reach the orders behind it.

---

## Part 3 — The structural problems

1. **Status is spread across four columns that contradict each other.** `Status`, `Stage`, `ST`, and `AB STATUS` all encode position. A row can read `READY / FP-FQC-PAC / FQC / DOM-FAB-COMP` simultaneously.
2. **Dates are opinions, not events.** `NEED DATE`, `PROMISED DATE`, `Revised Delivery Date`, `Drawing committed date`, `REVISED DRAWING DATE`, `READY SINCE`, `BILL PLANNED`, `Dispatch Plan`, `MFG PLAN MONTH`, `PLAN WEEK`. Nine date fields, none of them recording when anything actually happened.
3. **The narrative column is the audit trail.** Everything of consequence is in a paragraph inside one cell, overwritten each time it is updated. Previous state is lost.
4. **Departments are folders, not participants.** Twelve network shares means twelve versions of the same job. Planning's DEVA year folders and Production's section folders never meet.
5. **Money is re-keyed.** The summary tab's invoiced/executable/shortfall maths is manual work redone every reporting cycle over the same 501 rows.
6. **Columns hold mixed types.** `PLAN WEEK` contains weeks and statuses. `BILL PLANNED` contains months, statuses and project codes. Once a column can hold three kinds of thing, no report built on it can be trusted, and no import can be validated.
7. **The table is not a table.** Yellow subtotal and category bands are interleaved with data rows. This is why the same sheet reports 293, 501 and 511 records in three different states.
8. **The register was never closed.** Rows from 2018 and 2022 sit on HOLD in the live pending list, with day-counts down to -322. Backlog, dead orders and live work are indistinguishable.
9. **Two planning systems that don't meet.** Catalogue orders are planned by component readiness in the Pending Order sheet; engineered orders are planned operation-by-operation in per-project Gantt files with QAP hold points. Neither is visible from the other, and the Gantt files stop being updated after they are built.

---

## Part 4 — Revamped workflow

The goal is not to digitise the sheet. It is to make the sheet fall out of the work as a by-product.

### One spine, eight checkpoints

```
Order accepted → Drawing released → Plan confirmed → Material ready →
Parts made (in-house + vendor) → Assembled & tested → Quality released → Dispatched
```

Every department writes to the same spine. Nobody maintains a parallel list.

### Two order classes, one spine

The eight checkpoints stay the same for both. What differs is the depth underneath them.

| | Catalogue / repeat order | Project / engineered order |
|---|---|---|
| Today | Pending Order row + Manufacturing Plan row | Separate Gantt workbook |
| Planned by | Component readiness — Hub, Shaft, Impeller, Case | Operation sequence with durations |
| Quality | Final inspection | QAP hold points — radiography, DP test, chemical & mechanical, dimension check |
| Revamped | Sub-items on the order, each with readiness | Operation list on the order, each with planned/actual dates and a hold-point flag |

A hold point is not a status — it is a stop. The operation after it cannot start until Quality passes it, and when `INSP = Client` it cannot pass until the customer's inspector signs. Making that a rule in the system is the single biggest quality-of-life gain for engineered orders, because it is currently enforced by memory.

### Motor and bought-outs get a real object

Five columns currently chase the motor. They collapse into one **supply item** per order line with: scope (Nadi / customer / not applicable), supplier, expected date, received date, and status. When the expected date passes, it becomes an ageing shortage exception on its own — nobody has to notice it.

### Dispatch becomes a gate, not a word

An order becomes dispatchable only when all of these are true, and the screen says which one is missing:
quality released · customer inspection cleared (if `INSP = Client`) · crate ready · documents complete · as-built BOM frozen.

That also gives **"billed but not moved"** a proper home: invoiced, dispatch gate not yet passed. It stops being a yellow band someone maintains by hand.

### Status collapses from four columns to two fields

| Today | Becomes |
|---|---|
| `Status`, `Stage`, `ST`, `AB STATUS` | **Stage** — one of the eight above, set by the system when the checkpoint event fires |
| `MFG-BL`, `Back log`, `Short Supply`, colour fills | **Exception** — a separate object with type, reason, owner, due date, and delivery impact |

An order therefore always reads as one line: *stage + on track / at risk / blocked + one named owner*. Colour becomes decoration rather than data.

### The narrative column becomes the timeline

`FAN STATUS AS ON 05.09.2026` is replaced by an append-only event log. Each event is `date · actor · action · reason · result · next owner`. The same information the team already types, but stamped, attributed, and never overwritten. Anyone joining the order mid-way reads it top-down instead of parsing a paragraph.

### Component readiness moves into the order

The Manufacturing Plan sheet's `Hub / Shaft / Imp / Case` columns become sub-items under the order, each with its own readiness. Planning stops maintaining a second row per job — the plan sheet becomes a view of the order list filtered to the plan month.

### Revised stages per department

| Department | Current stages | Revamped |
|---|---|---|
| Sales | Enquiry → Quote → PO (Cratio, disconnected) | Same, but the quote carries the enquiry ID forward into the order — no re-keying |
| Projects | Allot OA → type row → issue OA | Accept order once; OA, Epicor line and SAP order link automatically. OA acknowledgement generates from the record |
| Design | Committed date → drawing → BOM (dates typed) | Release drawing revision as an **event**; every downstream job pins the revision it was released against |
| Planning | Maintain two sheets + pivot + chase | Confirm the plan, then **re-plan on exception only**. Weight loading auto-sums from confirmed orders |
| Purchase | Type "Short Supply" | Raise a **shortage exception** with supplier, expected date, owner. It ages visibly |
| Stores | Invisible | Receive, issue, vendor gate pass — each one is a checkpoint event on the order |
| Production | ST codes typed by supervisor | Operator taps **Start job / Stop job / what happened**. Stage, quantity, rework, scrap, downtime and time recorded from the tap |
| Quality | FQC in a code, failures in prose | Pass / fail against the inspection point. A fail creates a rework loop with an owner and a retest date |
| Dispatch | "READY" in three columns | One gate: documents complete + quality released + as-built BOM frozen = dispatchable |
| Management | Read a manual summary | Same numbers, live, and every number opens the orders behind it |

### What each department stops doing

- Projects stop typing rows into a shared file.
- Planning stop maintaining the Manufacturing Plan sheet, the weight pivot, and the OTD report by hand.
- Production supervisors stop reporting status upward — the taps do it.
- Commercial stop re-deriving invoiced / executable / shortfall.
- Nobody types a status into a paragraph.

---

## Part 5 — Column-by-column migration map

This is what makes the switch survivable. Every existing column has a destination, so the team can see nothing is being thrown away.

| Excel column | Destination | Note |
|---|---|---|
| `OA NO` | Order ID | Primary identity |
| `SAP NO` | SAP sales order link | **Populated by integration, not typed.** Currently blank on almost every row |
| `Epicor No` (020602-1-1) | Order line / sub-line | Structure preserved, generated not typed |
| `ID Num` | Legacy reference field | Searchable, read-only after cutover |
| `Cust PO NO`, `PO Date` | Customer PO | |
| `PO Cleared Dt`, `OA Relsd. Dt`, `GA APPROVAL REC` | Intake checkpoint events | Dated, and the gaps between them become a measurable intake lead time |
| `Customer Name` | Customer (from SAP master) | No local copy |
| `Agents` | Sales agent on the order | |
| `INSP` (Self / Client) | Inspection type | Drives the customer-inspection gate before dispatch |
| `CODE` (A / C / S / SERVICE) | Order category | Confirm meaning with client |
| `Fan Model`, `Qty` | Order line | |
| `Amount` | Order value (from SAP) | Drives the summary automatically |
| `NEED DATE` | Customer need date | Never edited |
| `PROMISED DATE` | Promise date | Changing it requires a reason and creates an event |
| `Revised Delivery Date` | Current committed date | With the reason it moved |
| `NO. OF DAYS (PROMISED DT–OA)` | Derived, displayed | Not stored |
| `Drawing committed date`, `REVISED DRAWING DATE` | Design checkpoint dates | Event-stamped |
| `Status`, `Stage`, `ST`, `AB STATUS` | **Stage** (one field) + **Exception** | The four collapse into two |
| `FAN STATUS AS ON …` | **Timeline** | Historic text imported as the first timeline entry per order |
| `MFG PLAN MONTH`, `PLAN WEEK` | Plan slot | |
| `REVENUE PLAN MONTH`, `BILL PLANNED`, `YEAR PLANNED` | Billing plan | Feeds the summary directly |
| `WEIGHT` | Order line weight | Auto-aggregates into the capacity view |
| `Motor scope` (NA / NM / CM) | Supply item — scope | Nadi / customer / not applicable |
| `Motor Expected Date`, `Boughtout`, `Supplier Name/Contact No` | Supply item — supplier and expected date | Ages into an exception on its own |
| `Shortages – Motor/BO`, `Remarks for Boughtouts`, `Pending break up`, `Pending` | **Shortage exception** | Four overlapping columns become one object with an owner and an age |
| `CRATE CLEARANCE`, `Wooden Crate Status` | Packing readiness | Part of the dispatch gate |
| `PLAN WEEK` | Split in two: **plan week** (Wk-1…Wk-4) and **status** (READY / Back log / Short Supply / HOLD / PRE-MAN) | The mixed column is the single messiest field to migrate |
| `BILL PLANNED`, `YEAR PLANNED` | Split: billing month, billing status, project code | Same problem, same fix |
| Yellow subtotal and category bands | Derived totals and saved views | Never stored as rows |
| Per-project Gantt (operations + QAP hold points) | Operation list on the order | Replaces the standalone workbook |
| `READY SINCE` | Derived from the readiness event | Stops being typed |
| `PAYMENT TERMS`, `Industry` | Order commercial detail | |
| `PROJECT STATUS`, `off meeting` | Project notes | |
| `Remarks` | Timeline note | |
| Manufacturing Plan `Hub / Shaft / Imp / Case` | Sub-item readiness on the order | Replaces the second sheet |
| Summary tab totals | Live dashboard | Derived, never typed |
| `COO`, `CANCELLED` tabs | Order status filters | Not separate registers |

**Codes to confirm with the client before build.** These are inferred from context and should be validated in one sitting, not guessed at: `ST` values RE, FQC, FP, PAC, ASS, ASS/B, ASS/CM, B, CI, DI, FAB, FCP, PD, TE; `Stage` values MFG-BL, `Yet To Ass / BO / CM`; `AB STATUS` values DOM-FAB-COMP, DOM-FAB, RLW-A-FAB, RLW-W-FAB; `CODE` values A, C, S, SERVICE; `Motor scope` values NA, NM, CM; `PLAN WEEK` value PRE-MAN; and the project prefixes ALS / Wab / RLW that appear in the billing columns and the summary tab. Getting a single agreed dictionary out of the team is a prerequisite for the data import, and it is also the moment to retire the codes that no longer mean anything.

---

## Part 5b — What has to be cleaned before import

The import is not a technical problem. It is four decisions the client has to make, and they should be made before any development starts:

1. **How many of the 501 rows are live?** Rows from 2018 and 2022 sit on HOLD with day-counts to -322. Someone has to declare each of them live, cancelled, or archived. Migrating them as-is imports a decade of ambiguity into a new system on day one.
2. **Strip the yellow bands.** Subtotal and category rows must come out of the data before import and come back as views. This is also what fixes the 293 / 501 / 511 record-count disagreement.
3. **Split the mixed columns.** `PLAN WEEK`, `BILL PLANNED` and `YEAR PLANNED` each need their values sorted into the right destination field. This is a spreadsheet exercise, best done by Planning with a script, not a judgement call at runtime.
4. **Backfill `SAP NO`.** Every live order needs its SAP sales order attached, once. Without it the integration has nothing to join on, and the platform's central claim — that SAP stays the system of record — doesn't hold.

Point 1 is the one that will be resisted and the one that matters most. It is worth framing to the client as a closing exercise they have needed for years, which the platform is simply the occasion for.

---

## Part 6 — Making adoption easy

The risk is not the software. It is that Planning keeps the workbook open in a second window.

**1. Import the live sheet, don't ask anyone to re-enter it.** All 501 rows land as orders on day one, with the FAN STATUS narrative preserved as the first timeline entry. If people have to type their backlog in, they won't switch.

**2. Ship an Excel export that looks exactly like the current sheet.** Same columns, same order, one click. This removes the only real argument for keeping the file, and it keeps the people who genuinely work in Excel — Finance especially — unaffected.

**3. Start with the two roles who feel relief first.** Planning stops being the single editor, and Management gets a live summary. Both are net-subtractions of work. Roll Production, Quality and Dispatch in only once those two are steady.

**4. Bring Production in through the tap, not the screen.** One job card, two buttons, a stop reason. If it takes an operator longer than writing on the job card, it fails regardless of how good the rest is.

**5. Run parallel for four weeks, then stop updating the sheet — with a date announced in advance.** Parallel running that has no end date never ends.

**6. Freeze the derived reports first.** The OTD report, the weight pivot and the Pending Order Summary become read-only views on the same day the import lands. That removes several hours of recurring manual work immediately and gives the team a visible early win.

**7. Keep the year-wise folders as they are.** The DEVA-xx-xx and section folders don't need migrating. Attach them to the order as links. Nobody should be asked to reorganise a decade of files as a precondition for using a dashboard.

---

## Suggested rollout order

| Weeks | What |
|---|---|
| 1–2 | Code dictionary confirmed. Import the 501 rows. Order list and Order Workspace live, read-only |
| 3–4 | Projects and Planning write in the platform. Excel still updated in parallel |
| 5–6 | Excel updates stop. Summary and OTD generated from the platform |
| 7–9 | Production start/stop on shared devices, section by section — Machine Shop first |
| 10–12 | Quality inspection points, Dispatch gate, material shortage exceptions |
| Later | Vendor progress reporting, then Phase 2 scope |
