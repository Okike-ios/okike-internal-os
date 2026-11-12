# OK-SS-002 — Superstructure resource and Work Details refinement v0.3

**Status:** Implemented on feature branch; awaiting Product Owner functional review. NOT integrated into main quotation app.

**Branch:** `feature/superstructure-floor-walls-v01`  
**Draft PR:** #10  
**Merge gate:** Exact Product Owner authorization phrase is required; ordinary approval does not authorize merge.

## Approved requirements implemented

### Structural columns and beams
- Shape-aware square, rectangular and circular column measurement rows; diameter (mm) replaces breadth/width on circular selection.
- Width/breadth/beam depth in mm, member height/span in m, with explicit SI conversions.
- Columns: rectangular gross volume = W × B × H × count; circular = πD²/4 × H × count.
- Column formwork: sum selected shuttered faces × height × count; circular = π × D × H × count.
- Beams: volume = width × depth × span × count; soffit and side-formwork faces selectable.
- Formwork area (m²) separate from optional theoretical panel count; panel size and reuse cycles must be entered.
- Reinforcement by bar schedule or guided calculation; only one method applies per member.
- Scheduled/guided nominal bar mass uses `0.006165 × diameter(mm)² × cut length(m) × count` kg. No inferred bar laps or hooks.
- Guided links require specified diameter, spacing, member length and scheduled link cut length.
- Site-mixed component inputs use separate cement/sand/gravel/other cells, and require user-entered verified conversion/yield factor to generate dry-component volume. No default density or sack conversions.

### Walls and block production
- Multiple wall types, segments, openings, storeys, independent floor records.
- Mortar by theoretical rectangular block bed/perpend joint geometry or verified coverage (litres/m²). The geometry is a provisional nominal model, not a verified supplier order or applicable to all hollow-block web arrangements.
- Mortar component mix has separate cement/sand/other fields and optional verified yield factor for dry component breakdown.
- Purchased blocks yield count, priced separately.
- In-house blocks support **two alternatives**: batch yield (verified blocks/batch, actual resources/batch) or mix-ratio (block geometry, user-entered void fraction, material parts, verified production yield). They are never added together.
- Laying mortar and block-production materials are separate resource lines.
- Measurement-method selector spans available row width; additional CSS spacing and dark theme support.

### Door and window openings; lintels
- Multiple independent door/window types per floor, each with repeatable grid/location measurement groups.
- Lintel type, in-situ concrete geometric volume, three-face shuttering, optional panel counts, bar schedule or guided reinforcing and site-mix component fields.
- Precast / steel lintels remain product count quantities; no false concrete breakdown.
- Opening areas are recorded, but **not automatically subtracted from Walls**; PM must record deductions in associated wall measurement only once.

### Stiffeners and wall ties
- Multiple measurement groups, independently selectable concrete stiffener versus wall tie/anchor.
- Stiffeners produce m³ concrete, m² formwork and reinforcement quantities if entered; ties produce a separate count. Units are never summed together.

### Floors and costing
- Floor modes: blank, specifications only, and full draft duplication; source floor can be selected.
- Per-floor activity details and independent new floor IDs.
- Materials & Equipment generated rows use material source identifiers and preserve manual additions. Unit prices are carried only when material name and unit remain identical.
- No merging into the approved app and no direct shared Home Screen/department modification.

## Verification

- 75/75 JavaScript simulated checks passed, including all 48 earlier activity screens.
- Independent examples:
  - Ten square columns 300mm × 300mm × 3m: 2.7m³ concrete and 36m² all-face formwork.
  - Ten circular columns diameter 300mm × 3m: π×0.3²/4×3×10 m³ concrete.
  - Two beams 225×450mm by 5m: 1.0125m³ concrete, 11.25m² soffit and both-side formwork.
  - A 22m² net wall with 450×225mm block face and 10mm joints: 204 theoretical blocks.
  - 3 in-situ window lintels, 1.5×0.15×0.225m each: 0.151875m³ concrete.
- Quantity validation, source data persistence, floor duplication and generated material separation checked via simulated DOM.

## Remaining risks / deferred decisions
- Browser click-through and responsive visual testing are **not completed**.
- Manufacturer-specific block joints, mix workability, hollow-core effects, concrete yield and density remain unverified.
- Engineers must approve design details, concrete grade, lap lengths, cover and bar schedules.
- Formwork panel optimization, scaffold/props, reuse and losses require separate project requirements.
- AI extraction of dimensions from drawings remains future scope.
- These formulas are **preliminary estimates**, not issued construction orders or approved commercial price rules.
