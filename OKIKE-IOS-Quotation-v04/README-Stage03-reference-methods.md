# OK-QNB-005 — Source-grounded Ground Floor material takeoff (draft)

Status: Implementation prepared for review; not approved commercial pricing rules.

## Design distinction
Measured physical work quantity is not automatically the supplier order quantity. Quantity is calculated in Work Details and transferred to Materials & Equipment, where manual extras can still be added. No automated pricing policies or procurement allowances have been authorized.

## Implemented specifications and calculations
- Hardcore: material dropdown (graded crushed stone, crushed granite aggregate, graded natural gravel, lateritic granular fill, other). In-place *compacted volume* = sum of L(m) × W(m) × compacted depth(mm)/1000 × repeats. Show m³ or yd³ (1 yd³ = 0.764554857984 m³). No loose-volume factor or tonne conversion without project-specific validated data.
- Sand blinding: material and levelling-method dropdowns. Net in-place volume = same geometric expression; m³ or yd³. Sand material selection does not imply an unverified bulk density.
- DPM: 250, 300 and 500 micron **product examples**, with roll dimensions sourced from Visqueen's published DPM product page (4×25m, 4×25m, 4×12.5m respectively), plus other/custom with user-entered roll dimensions. Area = L×W; theoretical minimum roll count = ceiling(net area / gross roll area). Equivalent length = area / selected roll width. Square yard, yard, centimetre, millimetre and metre display conversions supported. Layout, laps, upstands, cuts and waste are not included; roll count must not be construed as a reliable supplier order.
- Insulation/protective layers: generic EPS, XPS, PIR, mineral wool or other; area L×W, theoretical minimum panel count = ceiling(area/(specified panel length×panel width)). Actual product size and suitability are user-specified. No undocumented default panel size.
- Mesh reinforcement: mesh dropdown A142 (2.22 kg/m²), A193 (3.02), A252 (3.95), A393 (6.16), with published 4.8×2.4m standard sheet example. Nominal mesh mass kg = net covered area × published mesh kg/m². Theoretical minimum sheets = ceiling(area/11.52m²). Structural bar/engineered reinforcement will not generate a fabricated mass without an approved bar schedule. Mesh laps, placement, cutting and procurement are excluded.

## Sources checked 2026-11-11
- RICS NRM2 detailed measurement: https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm
- Midland Rapid BS4483 mesh table: https://www.midlandrapid.co.uk/standard-fabric-mesh-bs-4483-and-bs-4483/
- Rainham reinforcement mesh table: https://rainhamreinforcement.co.uk/products/reinforcing-mesh/
- Visqueen DPM product specifications: https://visqueen.com/products/visqueen-dpm/

These references support physical measurement methods and published product attributes. They do not approve design suitability, compaction factors, installation allowances or supplier orders for OKIKE.

## Testing
- JS parse passed.
- Simulated activity navigation: 11 of 11 activities opened.
- Independent calculation examples:
  * 12×10×0.15m hardcore = 18m³;
  * 12×10×0.05m sand = 6m³;
  * 12×10m DPM = 120m², theoretical minimum 2 of 4×25m gross rolls;
  * 12×10m A142 = 120×2.22 = 266.4kg;
  * mesh gross minimum sheets = ceil(120/11.52) = 11.
- Live cross-browser interaction, data persistence, and all regression tests still require review.
- No future in-house material formulas are approved by this draft.

## Outstanding
- Complete and approve the unfinished request for special joint/finish quantity rules.
- Confirm preferred Nigerian supplier material standards and product sizes before making specific SKUs or densities the default.
- Confirm real material installation allowances and conversion policies in a separate formula-library assignment.
