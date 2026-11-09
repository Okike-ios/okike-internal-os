# OK-QNB-004 — Ground Floor material quantity refinements

Status: **development prototype; not approved for commercial estimation**.

## Proposed changes
- Ground Floor activities now display live **placeholder material requirements** in Work Details after complete measurements and specification are entered:
  - Hardcore / granular sub-base: compacted measured volume (m³); demo factor defaults to 1.0, selectable m³ / yd³.
  - Sand blinding and surface levelling: measured blinding volume (m³); dropdowns for material and levelling method; demo factor defaults to 1.0.
  - Damp-proof membrane: measured area (m²) with area units m², yd², cm², mm²; linear outputs in m, yd, cm, mm require *usable roll width (m)*. Membrane specification required.
  - Insulation / protective layers: measured coverage area (m²), unit conversions; specification required.
  - Mesh / bar reinforcement: measured coverage area (m²), unit conversions; specification required. **No bar mass or bar schedule is inferred.**
- Joint specification and slab finish: now required dropdowns; existing measured joint length (m) retained until remaining quantity-rule requirements are clarified.
- Quantity outputs appear in Work Details before Step 2; provisional linked material rows are displayed in Materials & Equipment. Manual material/equipment additions are preserved.

## Demonstration-only formula
- Derived resource = summed measured area/volume × editable *demo factor* (initially 1.0).
- Cubic yards = cubic metres ÷ 0.764554857984.
- Square yards = square metres ÷ 0.83612736.
- Linear membrane (metres) = covered area in m² ÷ usable roll width in metres. Convert to yards/cm/mm as display-only units.
- No allowance for overlaps, wastage, bulking, compaction/shrinkage, roll packing, mesh lap, reinforcement mass, procurement rounding or product specifications.

**WARNING:** These are not verified OKIKE engineering, material estimation or procurement rules. Do not use generated quantities for supplier orders, contract quotations or design.

## Acceptance checks
1. Select Ground Floor stage; open each relevant activity from its full row.
2. Enter required specification; add two measurement groups; verify output changes as dimensions or demo factor change.
3. Change compatible output units; confirm conversion and resource-row propagation.
4. Confirm membrane linear units request usable roll width; invalid / empty width must not yield a quantity.
5. Confirm the five specified fields are required; sand material and method, plus joint and finish, offer dropdowns.
6. In Materials & Equipment, add a manual item; revisit Work Details and adjust dimensions; ensure manually entered item is retained.
7. Verify Preliminaries, Substructure, Home, settings and existing quotations remain intact. Prototype preview uses isolated localStorage.
8. Inspect potential duplicate scope and test formula assumptions before accepting any future backend formula.

Technical status: JavaScript syntax parsing passed; interactive browser and regression testing are still required. The final joint/finishing material rule is **not specified** because the Product Owner's latest instruction ended mid-sentence.
