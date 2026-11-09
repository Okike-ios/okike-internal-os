# OK-QNB-003 — Ground Floor Construction: Placeholder Calculation Prototype

Status: **Implementation draft / Product Owner review required**.

## Included
- Eleven ground-floor activities integrated into existing Work Details stage/activity navigation.
- Floor-type selector, editable stage applicability, and repeated measurement rows.
- Ground-floor slab volume: sum of (length m × width m × thickness mm ÷ 1,000 × repeats).
- Site-mixed concrete: independently editable cement/sand/gravel **mix parts**, recalculated quantities displayed directly in Work Details, and compatible display units.
- Ready-mixed supply alternative uses measured concrete volume (m³).
- Generated Materials & Equipment rows, identified by source `okike-placeholder-mix`, remain alongside manually entered resources; existing user-entered material rates for generated items are retained on recalculation.
- Draft storage remains within the existing localStorage quotation structure. Nothing is sent to a backend.

## UNVERIFIED PLACEHOLDER — NOT FOR COMMERCIAL USE
Demonstration-only rule:
- dry-volume factor defaults to **1.0** (editable);
- nominal density constants: cement 1440 kg/m³; sand 1600 kg/m³; gravel 1500 kg/m³;
- material mass kg = measured wet slab volume m³ × demonstration factor × (material mix part / sum of mix parts) × assumed density kg/m³;
- `kg ↔ t` is an exact mass conversion (1 t = 1,000 kg).
- `50kg-bags` is a package equivalent for cement only, not a purchasing round-up.
- No waste, yield, bulking, compaction, moisture or procurement allowances.
- These values **must not** be used for structural specification, purchasing or quotations. Mix ratios do not establish designed concrete quality.

## Suggested acceptance checks
1. In Construction Scope, select Ground Floor Construction, then open stage and any of the eleven activities.
2. Check floor type changes suggestions while allowing manual tickbox overrides.
3. In Ground floor concrete slab add row: length 12m, width 10m, depth 150mm, repeat 1 -> 18m³.
4. Change site-mix parts from 1:2:4 to 1:3:5; all three output masses should update immediately (without leaving Work Details).
5. Toggle a material display between kg and tonnes; base mass must not change. Cement also supports 50 kg bag equivalents.
6. Open Materials & Equipment and verify linked generated items plus manual-add capability.
7. Enter a manually added equipment resource, change slab measurements, return to Materials: manually added resource should persist while linked quantities refresh.
8. Switch to ready-mixed; generated cement/sand/gravel rows should be replaced by one concrete-volume row.
9. Close/reopen the page; confirm saved ratio, dimensions and manual resources persist.
10. Regression check Substructure, Preliminaries, sidebar collapsing and previously saved quotations.

JavaScript parsing verified in development. Interactive browser tests, storage regression tests, and engineering validation remain outstanding. Existing live Pages site uses `main` and will **not** change until this branch is reviewed and merged.
