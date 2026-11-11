# OKIKE Internal OS — Integration implementation candidate

**Status:** implementation candidate for Product Owner review; not merged to GitHub `main`.

## Implementation boundaries

- The provided Administration and Finance workflow engines have been retained; no original commercial calculation rules were rewritten.
- `index.html` uses the Finance/Home shell as the unified navigation. The Administration workflow is embedded in the shared workspace, with its duplicate sidebar hidden by `embedded.css`.
- `integration.js` shows read-only cross-department workflow records for Home, Project Management, Design and Media. Actual approval operations remain inside their owning modules.
- `modules/administration/embedded.js` aligns illustrative project and client identities with the central Home project library. Matching by exact project name is a demonstration migration rule, not a production-grade matching method.
- The Finance team sample project is also used by the Home module; historical Finance and Administration samples are independent of real company records.
- Internal machine role strings are retained for compatibility; role selectors show **Finance**, **Administration**, **Project Manager**, **Head of Project Management**, **Managing Director**.
- Accounting styling is refined by `integration.css` (table overflow, minimum column sizes, spacing, responsive layout).
- The existing quotation files must remain untouched in the Git repository; the New Build entry links to its existing route for hosted integration.

## Known limitations / release blockers

1. These are client-only JavaScript prototypes using localStorage. Cross-device updates, real role-based authorization and financial audit integrity require backend integration.
2. The Administration embedded module retains its original document and workflow screens; the new shell unifies navigation, not the internal component library. Complete CSS consolidation is a later, separately tested step.
3. Cross-department summary panels are read-only. They do not create invoices, dispatch documents, update financial ledgers, or post payments.
4. Existing browser localStorage data can use historical duplicate IDs. **Back up/Export demo records before using the combined preview**. For deterministic smoke testing, run in a clean origin or incognito profile.
5. New Build quotation route assumes this directory is placed adjacent to the existing `OKIKE-IOS-Quotation-v04` directory. Use the published GitHub file structure when deploying.
6. This implementation must be verified in a browser for each role, project, revision, approval stage, financial transaction and responsive breakpoint before the Product Owner accepts it.

## Recommended staged verification

- Open `index.html` through a local HTTP server, not `file://` (same-origin communication).
- Home → Administration → My Workspace: check project cards and role selector.
- Home → Finance: switch roles and verify purchase requisition → approval → payment flows.
- Design and Media: verify handoff rows from Administration's submitted design revision or milestone approval.
- Verify the New Build quotation form still opens and no quotation JavaScript was changed.
- Check 1440px, 1024px and 768px widths for table overflow and header spacing.
- Confirm that no real payment or dispatch is claimed.
