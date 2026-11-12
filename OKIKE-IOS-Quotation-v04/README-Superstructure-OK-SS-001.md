# OK-SS-001 — Stage 04 Superstructure Development Prototype

**Status:** Implemented on feature branch only; Product Owner review and browser testing pending.
**Branch:** `feature/superstructure-floor-walls-v01`
**Base:** Current `main` at branch creation. **Do not merge without explicit authorization phrase.**

## Scope

Stage 04 is enabled in the quotation's Construction Stage and Activity navigation with nine activity rows:

1. Structural layout and setting out
2. Reinforced concrete columns
3. Reinforced concrete beams
4. Walls
5. Door and window opening formation (includes lintels)
6. Reinforced concrete stiffeners and wall ties
7. Wall reinforcement and anchoring
8. Concrete and masonry curing
9. Superstructure inspection and quality testing

All vertical structural elements belong here regardless of floor, while suspended slabs stay outside this stage.

### Floor workflow
- Floor records use stable floor IDs with user-specified labels.
- Ground Floor is the initial floor.
- Add Floor allows three options: blank, copy wall/material specifications only (no measurements), or duplicate measurements and details. Source floor is selectable.
- New floors are unconfirmed draft data. Records are stored beneath each activity's `details.superstructure[floorId]` with a shared `workDetails.superstructureConfig`.
- Floor tab navigation is present in each activity's Work Details; shared configuration is visible on the stage activity list.
- There is no automatic floor approval inheritance.

### Walls
- Single activity contains multiple independent wall systems per floor: load-bearing / non-load-bearing blockwork, brick masonry, drywall, precast panels, cast-in-situ concrete and custom.
- Wall position Interior/Exterior.
- Manual overall dimensions and repeatable segment/grid references with opening deductions.
- Blockwork theoretical blocks = ceil(net measured area ÷ nominal masonry module face area). Module dimensions are actual selected block face dimensions plus entered joints. No wastage or mortar yield is assumed.
- Purchased blocks: generated count transfers to Materials & Equipment and price remains separately entered.
- In-house blocks: user must provide verified blocks/batch, cement bags/batch and sand m³/batch before material production requirements generate. Block manufacturing and laying mortar remain separate.
- Laying mortar (m³) uses **user-entered verified consumption rate** in litres/m² × net wall area ÷ 1,000. No invented mortar percentage or conversion to cement/sand.
- Drywall theoretical boards = ceil(net wall area × number of faces × layers ÷ board face area).
- Precast theoretical panels = ceil(net wall area ÷ panel face area).
- Cast-in-situ gross concrete = net wall area × thickness metres. Reinforcement/formwork are independent and not auto-inferred.
- The Materials & Equipment stage retains manual additions and prevents stale generated prices following specification changes.

### Other activities
- Columns and beams have per-floor dimensional inputs producing **gross geometric volume** (L × W × H × count) as a preliminary check.
- Other six activities have per-floor scope/drawing/specification details and simple measurement placeholders.
- Full engineering reinforcement, lintel geometry, curing, formwork and opening-schedule calculators are **not yet specified or approved**.
- User's earlier DPC boundary suggestion is retained conceptually; no ground-floor DPC code has been moved by this branch.
- Drawing AI scanning is a future proposal only, not implemented.

## Acceptance / QA

Simulated JavaScript tests performed: 57/57 passed:
- Activity forms open across 13 Preliminaries, 15 Substructure, 11 Ground Floor and 9 Superstructure activities.
- Block example: 8m × 3m with 2m² openings => 22m² net, using 450 × 225mm face and 10mm joints => 204 theoretical blocks.
- Verified mortar use of 12 L/m² => 0.264m³ for 22m².
- New floor blank / specifications-only / full-copy modes retain expected data and preserve project information.
- Per-floor column data saved and reloaded.

**Not yet completed:** Real browser click and form-entry testing, accessibility, mobile/tablet responsive review, edge-case validation, cross-project persistence, structural engineering verification and source-specific material takeoff validation. No approved waste percentages, supplier density, mortar yield, mix design or pricing rules have been invented.

## Implementation boundaries
- Updated only `Quotation-new build/work-details.js` and `work-details.css`, plus this development record.
- The approved `main` branch, shared UI, Home Screen and other departments remain unchanged.
- Requested by Product Owner for development; **not an instruction to merge into main**.
