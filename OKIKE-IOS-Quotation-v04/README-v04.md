# OKIKE Internal OS — Quotation v0.4 (navigation corrections)

Based on approved v0.3 source; no estimation formulas or quotation storage schema changed.

## Changes
- Removed the nested quotation service and quotation-step entries from the quotation sidebar. The existing Home Screen Project Management > Quotations workspace remains the access point for all service forms.
- Removed the nested quotation-form dropdown from the Home Screen sidebar; kept the quotation service cards within the Quotations workspace.
- Sidebar minimization uses the same saved `okike_internal_os_preferences_v1.collapsed` flag as Home. The collapsed view shows icons and expands back using the top toggle.
- Hid the internal sidebar scrollbar, while retaining overflow access where necessary at reduced viewport heights.
- Whole construction-stage rows and activity rows open by mouse or Enter/Space; redundant Open text/arrows removed.

## Manual acceptance checks
1. Open `OKIKE-HomeScreen-v01/home.html`, select Project Management > Quotations; confirm service cards remain, with no nested sidebar service list.
2. Choose New Build, proceed to Work Details. Verify the left sidebar has no separate visible scrollbar at standard desktop height.
3. Click the sidebar toggle; verify icons-only sidebar and that the workspace expands. Click again to restore. Navigate across pages and verify the preference persists.
4. Click anywhere on a stage card (other than no buttons, which were removed); verify it opens. Check Enter/Space with keyboard focus. Repeat for an activity.
5. Verify Substructure calculation rows, draft persistence, and Preliminaries are unchanged.

Automated browser-level acceptance is not claimed by this README.
