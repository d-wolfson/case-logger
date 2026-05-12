# Submit ACGME Queue With Codex

Submit queued Case Logger cases to the ACGME Case Logs site using Codex-controlled Chrome.

## Operating Mode

Default to supervised pilot mode unless the user explicitly authorizes full auto-submit in the current conversation.

In supervised pilot mode:
- Process only the first valid queued case.
- Fill the ACGME form completely.
- Stop before clicking the final Submit button.
- Ask the user to verify the visible form and confirm submission.
- After the user confirms, submit the case, verify success, then mark it submitted locally.

In full auto-submit mode:
- Process the queue in order.
- Submit each case automatically after all field-level verification passes.
- Stop on unclear success, missing fields, CPT search failure, attending search failure, or browser/login problems.

## Step 0: Start Case Logger

Ensure the local app is running:

```bash
cd /Users/danielwolfson/Documents/Projects/case-logger
node server.js
```

Verify the queue endpoint:

```bash
curl -sS http://localhost:3000/api/acgme-queue
```

If the server is already running, reuse it.

## Step 1: Browser Prerequisites

Use the user's real Chrome browser through Codex Computer Use. The user must already be logged into ACGME.

For the streamlined workflow, Chrome must also allow Codex to execute JavaScript in the active tab:

```text
Google Chrome > View > Developer > Allow JavaScript from Apple Events
```

Open or use the existing Chrome tab at:

```text
https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert
```

Before filling any case, verify the page is the ACGME Case Entry insert form. If login is required, stop and ask the user to log in manually.

Check the fast Chrome bridge before using Computer Use for field-by-field actions:

```bash
npm run acgme:chrome:check
```

If Chrome reports that JavaScript from Apple Events is disabled, ask the user to enable the menu item above. If the bridge still fails, fall back to Computer Use.

## Step 2: Fetch and Validate Queue

Prefer the repo helper:

```bash
npm run acgme:queue
npm run acgme:next
```

The helper fetches:
- `queue`: ordered array of case IDs
- `cases`: full case objects
and sorts the queue chronologically before submitting.

Validate every queued case before touching ACGME. A case is invalid if any required field is missing, empty, or equals `Not found` case-insensitively:
- `patient_mrn`
- `date_of_surgery`
- `patient_age`
- `patient_gender`
- `attending_surgeon`
- `cpt_code`

If any queued case fails validation, stop immediately and report each bad case and missing field. Do not submit any cases until the user fixes the data and confirms.

## Step 3: Field Mapping

| Case Logger Field | ACGME Field | Notes |
| --- | --- | --- |
| `patient_mrn` | Case ID | MRN goes in the Case ID field |
| fixed value | Case Year | Should be `6` |
| fixed value | Role | Should be `Lead Resident Surgeon` |
| `attending_surgeon` | Site | Towner/Sierens = Cook County, all others = Rush |
| `attending_surgeon` | Attending | Search by last name; `Wang` means `Wang, Timothy`; fallback is `Other, Attending_` |
| `patient_age` | Patient Type | Adult if >= 18, Pediatric if < 18 |
| `cpt_code` | Code or Keyword | Search CPT and add first matching row |
| `case_category`, `procedure_name`, `cpt_code` | Microdissection | Check for tumor cases or MVD/CPT 61458 |
| `date_of_surgery` | Case Date | Enter last as `M/D/YYYY` |

## Step 4: Fill One Case

Fast path:

```bash
npm run acgme:chrome:fill-next
```

This fills the next chronological case in the active ACGME tab, adds the CPT, and stops before final submission. Verify the visible form with Computer Use before clicking Submit.

When the user has explicitly authorized full auto-submit in the current conversation, the fast path may submit one case:

```bash
node scripts/acgme-chrome.mjs fill-next --submit
```

Only use `--submit` after the form has been successfully piloted in the current browser session. It marks the local Case Logger case submitted only after ACGME success appears clear.

Manual fallback:

For each case:

1. Navigate to the ACGME insert page if needed.
2. Verify the page is ready with screenshot/accessibility context.
3. Fill Case ID with `patient_mrn`.
4. Verify Case Year is `6`.
5. Verify Role is `Lead Resident Surgeon`.
6. Set Site:
   - Towner or Sierens: `John H. Stroger Jr. Hospital of Cook County`
   - Everyone else: `Rush University Medical Center`
7. Set Attending by searching/selecting the attending last name.
   - If `attending_surgeon` is `Wang`, select `Wang, Timothy`. Do not select `Wang, Dian`.
   - If the attending does not appear in the dropdown, select `Other, Attending_`.
8. Set Patient Type from age.
9. Open the `Area/Type/Code` tab.
10. Search `cpt_code` in the Code or Keyword input.
11. Wait for results.
12. If microdissection is indicated, check Microdissection before adding the CPT.
13. Click Add for the first matching CPT result.
14. Verify the selected-code counter or selected panel incremented.
15. Enter Case Date last, converted from `YYYY-MM-DD` to `M/D/YYYY`.
16. Verify Case ID still equals the MRN and Case Date is correct.

Microdissection is indicated when:
- `case_category` contains `Tumor`
- `procedure_name` contains `microvascular decompression` or `MVD`
- `cpt_code` contains `61458`

## Step 5: Submit and Mark Local Success

In supervised pilot mode, stop before clicking Submit and ask the user to confirm.

After confirmation, or in full auto-submit mode:

1. Click the ACGME Submit button.
2. Wait for visible success: confirmation, form reset, or case count increase.
3. If success is unclear, do not mark locally submitted.
4. If success is clear, mark the case submitted locally:

```text
POST http://localhost:3000/api/cases/{id}/mark-submitted
```

Then continue with the next queued case only in full auto-submit mode.

## Error Handling

- If ACGME requires login, stop and ask the user to log in manually.
- If CPT search returns no result, skip that case and report it.
- If attending search fails or returns no result, select `Other, Attending_` and continue.
- If the selected CPT count does not increment after Add, retry once. If still unchanged, stop or skip and report.
- If Case Date resets or appears in the wrong field, correct it before submit.
- If submission fails or success cannot be verified, do not call `mark-submitted`.
- Avoid saving PHI-heavy screenshots unless needed for debugging.

## ACGME Form Quirks

- The Case Date field can reset when other fields change; always set it last.
- Role, Site, Attending, and Patient Type can persist between submissions; still verify them for each case.
- The form layout shifts as sections expand, so prefer accessible element names and focused verification over fixed coordinates.
- Date entry can sometimes cross-contaminate Case ID; verify both before Submit.
- Duplicate CPT adds are possible if Add is clicked twice; verify the selected panel before continuing.
