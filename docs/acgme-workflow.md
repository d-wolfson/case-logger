# ACGME Queue Workflow

This document is the source of truth for ACGME submission behavior. Claude and Codex command files should reference this file instead of carrying separate clinical logic.

## Modes

Default to supervised pilot mode unless the user explicitly authorizes full auto-submit in the current conversation.

Supervised pilot mode:
- Process only the first valid queued case.
- Fill the ACGME form completely.
- Stop before final Submit.
- Ask the user to verify the visible ACGME form.
- After confirmation, submit, verify success, then mark the case submitted locally.

Full auto-submit mode:
- Process queued cases in chronological order by `date_of_surgery`, preserving queue order within the same date.
- Submit each case only after field-level verification passes.
- Stop on missing data, unclear ACGME success, CPT search failure, browser/login problems, or any mismatch between the visible form and the case record.

## Required Local Checks

Start the app if needed:

```bash
npm start
```

Check the local queue:

```bash
npm run acgme:queue
npm run acgme:next
```

Validate every queued case before touching ACGME. A case is invalid if any required field is missing, empty, or equals `Not found` case-insensitively:
- `patient_mrn`
- `date_of_surgery`
- `patient_age`
- `patient_gender`
- `attending_surgeon`
- `cpt_code`

If any queued case fails validation, stop and report the case IDs and missing fields.

## Browser Prerequisites

The user must be logged into ACGME in a real browser at:

```text
https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert
```

For Codex fast automation on macOS Chrome, enable:

```text
Google Chrome > View > Developer > Allow JavaScript from Apple Events
```

Check the bridge:

```bash
npm run acgme:chrome:check
```

If the bridge is unavailable, use agent browser tooling manually with the same field mapping and verification rules.

## Field Mapping

| Case Logger Field | ACGME Field | Rule |
| --- | --- | --- |
| `patient_mrn` | Case ID | Use MRN as Case ID. Strip surrounding brackets if present. |
| fixed | Case Year | `6` |
| fixed | Role | `Lead Resident Surgeon` |
| `attending_surgeon` | Site | Towner/Sierens = `John H. Stroger Jr. Hospital of Cook County`; all others = `Rush University Medical Center` |
| `attending_surgeon` | Attending | Search/select by last name; `Wang` = `Wang, Timothy`; if not found use `Other, Attending_` |
| `patient_age` | Patient Type | Adult if age >= 18; Pediatric if age < 18 |
| `cpt_code` | Code or Keyword | Search CPT and add the matching row for the patient type when multiple rows appear |
| `case_category`, `procedure_name`, `cpt_code` | Microdissection | Check for tumor cases or MVD/CPT `61458` before Add |
| `date_of_surgery` | Case Date | Enter last as `M/D/YYYY` |

## Microdissection

Check Microdissection before adding the CPT when any of the following are true:
- `case_category` contains `Tumor`
- `procedure_name` contains `microvascular decompression`
- `procedure_name` contains `MVD`
- `cpt_code` is `61458`

## Submit Verification

Before clicking Submit, verify:
- Case ID equals the normalized MRN.
- Case Date equals `date_of_surgery` converted to `M/D/YYYY`.
- Case Year is `6`.
- Role is `Lead Resident Surgeon`.
- Site matches the attending rule.
- Attending is selected, with the Wang and fallback rules applied.
- Patient Type matches age.
- Exactly the intended CPT is visible in the Selected panel or selected counter.

After clicking Submit:
- Wait for ACGME success, preferably a submitted-case count increment.
- Do not call `POST /api/cases/{id}/mark-submitted` unless ACGME success is clear.
- If success is unclear, stop and report the case ID.

## Codex Fast Path

For a supervised single-case fill:

```bash
npm run acgme:chrome:fill-next
```

For an explicitly authorized full queue:

```bash
npm run acgme:chrome:run-queue
```

The fast path reloads the ACGME insert page between cases, fills the form, verifies the selected CPT, clicks Submit only in submit mode, confirms the ACGME count incremented, and then marks the local case submitted.

## Manual Fallback

When using manual browser automation:
1. Navigate to the insert page.
2. Fill Case ID.
3. Verify Case Year.
4. Verify Role.
5. Set Site.
6. Set Attending.
7. Set Patient Type.
8. Open Area/Type/Code.
9. Search CPT.
10. Set Microdissection if indicated.
11. Add the correct CPT row.
12. Enter Case Date last.
13. Verify the form.
14. Submit only when authorized.
15. Mark local success only after ACGME success is clear.

## Known ACGME Quirks

- Case Date can reset when other fields change; always set it last.
- Role, Site, Attending, and Patient Type can persist between submissions; still verify every case.
- Date entry can cross-contaminate Case ID in some automation approaches; verify both immediately before Submit.
- CPT search may return adult and pediatric rows for the same CPT; choose the row matching Patient Type.
- Duplicate CPT adds are possible if Add is clicked twice; verify Selected count/panel before Submit.
- Avoid saving screenshots because they may contain PHI.
