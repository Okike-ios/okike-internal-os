# OKIKE Internal OS — New Build Quotation v0.3 (OK-QNB-002)

## Scope
- Preserves Home Screen, settings, navigation, Project Information, Construction Scope, and approved Preliminaries activities.
- Adds 15 Substructure activities with Work Details, measurement groups and inherited four resource-cost forms.
- Foundation selector offers **suggested** selections; estimator can override all checkboxes. Piled foundation requires a separate engineered specialist scope, not included in these 15 generic activity formulas.
- Quantity totals are in-place/reference quantities only, not automatically populated resource purchases or selling prices. Material and labour pricing remain independently entered.
- Activity data remains in `okike_new_build_quotation.workDetails.activities[activityName]`; stage configuration is under `workDetails.substructure`.

## Run
1. Extract the ZIP. Open `OKIKE-HomeScreen-v01/home.html` locally.
2. From New Build, open Project Information, continue to Construction Scope, select Substructure and continue to Work Details.
3. Choose foundation type; review selected activities. Enter Work Details and measurement groups. Use Continue through Materials, Labour, Logistics and Other Costs, and review.
4. Changing an activity's Work Details/measurements invalidates its previous confirmation until reviewed and confirmed again.

## Measurement formulas
- Rectangular trench/footing/beam: length × width × depth × count (m³).
- Blinding: length × width × thickness(mm)/1000 × count (m³).
- Reinforcement theoretical weight: 0.006165 × diameter(mm)² × cut length(m) × bars × elements (kg).
- Formwork: specified contact length × height/depth × formed faces × elements (m²).
- Walling: max(0, length × height − openings) × wall count (m²).
- Backfill: max(0, excavated void − occupied volume) × zones (compacted m³).
- Other calculations are labelled per activity.

## Acceptance / caveats
- Syntax and file integrity checks are included in development verification; **visual and end-to-end browser acceptance is still required**.
- Do not assume suggestions determine engineering suitability. Drawing revisions, excavation support, soil conditions, discharge consents, piling, raft overlaps, and specialist inspections need competent review.
- No automatic resource conversion factors, wastage, unit rates, bar laps, block counts, procurement allowances or client prices are assumed.
- Confirm no duplicate scope across Preliminaries, Substructure and Ground Floor Construction.
- Save a copy before replacing a previously tested prototype; localStorage is browser-origin specific, so file:// behaviour can vary.
