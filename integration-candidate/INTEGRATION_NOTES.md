# OKIKE Internal OS — Department Ownership Integration v0.2

**Status:** Functional browser-test candidate, not production-ready.
**Product Owner direction:** Department selection determines workspace; no testing-role switchers.

## Ownership and routing

- **Home:** Shared client/project directory and project tabs. It owns stable demo Client IDs and Project IDs.
- **Administration:** Client enquiries, intake, correspondence, quotations submitted for dispatch/review, SOW client acceptance, invoice dispatch, and Admin-origin purchase requisitions.
- **Project Management:** New Build quotation forms (unchanged), quotations, project-specific SOW/milestone work, project-manager-origin purchase requests and work orders. The Head of Project Management approval role is not impersonated by ordinary navigation.
- **Design:** Client briefs and design revision actions from the original Administration workflow engine, under the Design section.
- **Media:** Assigned milestone and documentation work from the original workflow engine, under the Media section.
- **Finance:** Invoices, partial receipts, payments, verification, purchase review, bank CSV review/reconciliation, project finance, reports and opening balances. Finance reads quotation acceptance and SOW status from the Administration-origin project workflow.

## Technical implementation

- `department-router.js` replaces the former `integration.js` routing layer (the obsolete script is no longer loaded).
- `modules/administration/embedded.js` scopes the original form engine by department context; role selection is hidden and cannot be used to navigate across departments.
- `accounting.js` maintains financial transactions and journal entries; quotation/SOW acceptance is read from the shared project-workflow records rather than using Finance-only demo approvals.
- Admin/PM procurement entry and Admin invoice dispatch use Finance's transaction engine with their respective department context.
- Project identity synchronization is still browser-local. Ambiguous duplicate project names are not automatically unified.
- `index.html` is now the unified candidate; the repository root entry on `main` already redirects into `integration-candidate/index.html`.
- Protected files in `OKIKE-IOS-Quotation-v04/` are not modified.

## Test evidence

GitHub Actions workflow: `.github/workflows/okike-integration-checks.yml`.
Tests verify JavaScript syntax and run a headless Chromium smoke test of Administration, Finance, Design, Media, Project Management, New Build quotation routing, role-selector removal, finance requisition origin and quotation/SOW read-model ownership.

## Current limits requiring further work

1. **User authentication and authority:** Department navigation is not authentication. Head of Finance, Head of PM and Managing Director approval actions still require a user identity/permission model; they must not be made available by an unrestricted role switch.
2. **Single backend:** Browser localStorage remains the prototype persistence layer, not a secure multi-user source of truth. Cross-tab and cross-device consistency is not guaranteed.
3. **Original Administration UI:** Existing business forms are mounted in a section-scoped iframe to preserve their workflow code. This removes duplicate navigation and inter-department role switching but is not yet a native shared-component migration.
4. **Finance invoice and Admin SOW overlap:** Invoice dispatch uses Finance-owned invoice records. Legacy Administration invoice artifacts remain historical demonstration records and are not authoritative for Finance balances. Mobilisation/deposit synchronization requires a Product Owner-approved deposit policy and integrated payment evidence before release.
5. **Media and Design enhancements:** No finished asset library, drawing viewer, media upload storage or content scheduler is fabricated where none exists in the teammates' source files.
6. **Visual QA:** Automated browser smoke checks are not a complete visual, accessibility, permissions, quotation mathematics or responsive layout test.
7. **Sample records:** Seeded project and accounting data are illustrative. No bank, email, Drive or production Supabase connection is added.

## Release criterion

Do not call this a production-ready system. Review the published build, run the cross-department scenario tests with the team and approve subsequent hardening tasks before real client or financial data is entered.
