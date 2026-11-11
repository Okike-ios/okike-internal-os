# OKIKE-INT-001 — Administration and Finance integration candidate

**Authorization:** Product Owner has authorized implementation, but no merge into `main` is authorized without review and acceptance.

## Objective
Integrate the Administration and Finance source submissions into `Okike-ios/okike-internal-os`, while preserving all existing New Build quotation files and OKIKE visual design. Promote new workflows into Home, Project Management, Design and Media progressively, replacing placeholder content rather than fitting the new modules into old placeholder business rules.

## Inputs
- `OKIKE_Administration_Source.zip` and `OKIKE_IOS_Accounting_Source.zip` (original sources)
- This implementation candidate (`OKIKE-Integration-Candidate-v01.zip`)
- Latest approved `main` branch of `Okike-ios/okike-internal-os`

## Affected components
- Shared Home navigation and project library
- Administration workflows, quotation revisions, approvals, SOWs and milestone evidence
- Finance workflow, requisitions, invoices, CSV bank import, review, reconciliation and reporting
- Design and Media handoff displays
- Shared sample Client IDs and Project IDs
- Finance table layout and spacing

## Required protections
1. Work on `integration/administration-finance-v01` or equivalent isolated feature branch.
2. Make zero changes to existing New Build quotation formulas and work-details JavaScript unless a separate reviewed task explicitly requires it.
3. Preserve the original submitted Administration and Finance capabilities and business state transitions.
4. Show user-friendly role names: Administration, Finance, Project Manager, Head of Project Management, Managing Director, etc.; retain legacy machine aliases as needed for compatibility.
5. Keep ALL demo figures and projects clearly marked as placeholders; do not generate financial postings from cross-department summary displays.
6. Do not merge to `main` until Product Owner approves the PR.

## Candidate state and known gaps
This ZIP contains a locally generated integration shell and adapters. Admin retains its workflow engine in an embedded same-origin iframe; this preserves functionality but is an intermediate integration technique. The unified demo project association uses a name match for seed records; verify ID collisions and migration before PR approval. Browser tests were not available in the generation environment. Do not present this as production-ready.

## Acceptance tests
- App opens in a browser on a local HTTP server and at a GitHub preview URL, without console errors.
- Home and Administration show the same placeholder project IDs and client names after refresh and new-project creation.
- Finance project selectors include new projects created through Home / Administration.
- Role switching works for all submitted workflow operations without accidentally lifting permission checks.
- Submitted quotation version, design revision, SOW, approval, deposit and milestone workflows remain functional.
- Purchase requisitions, approvals, invoice dispatch, CSV bank import, review queue and reconciliation work with representative data.
- Finance tables have usable cell padding and no unexpected text/column overlap at desktop and tablet widths.
- Project Management, Design and Media display relevant handoffs without duplicating ledger postings.
- Existing New Build quotation navigation, scope selection, Work Details and cost calculations are unchanged and regression-tested.
- Code review includes storage migration behavior, XSS mitigation, credential exposure, demonstration-only auth warnings and accessibility.

## Pull request deliverables
- Explanation of changed and preserved files
- Screenshots of Home, Administration, Finance, Design and Media at desktop/tablet widths
- Test evidence and pass/fail results
- Remaining risks and migration constraints
- Product Owner approval request; **no automatic merge**
