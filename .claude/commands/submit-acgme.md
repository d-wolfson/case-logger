---
description: Submit pending cases to ACGME website
---

Submit all pending surgical cases from Case Logger to the ACGME website using browser automation.

## Step 0: Start Server

Start the Case Logger server if not already running:
```bash
cd ~/Documents/Projects/case-logger && node server.js &
```
Verify it's up: `curl -s http://localhost:3000/api/acgme-queue | head -c 20`

## Prerequisites

1. User must already be logged into ACGME at https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert
2. The claude-in-chrome MCP browser extension must be connected (call `tabs_context_mcp` to verify)

## Workflow

### Step 1: Get Queued Cases and Validate

Fetch the ACGME submission queue (cases the user has explicitly queued):
```
GET http://localhost:3000/api/acgme-queue
```

**BEFORE SUBMITTING ANY CASE**, validate every case in the queue. A case is invalid if any of these fields is missing, empty, or equals "Not found" (case-insensitive):
- `patient_mrn`
- `date_of_surgery`
- `patient_age`
- `patient_gender`
- `attending_surgeon`
- `cpt_code`

If any cases fail validation, **stop immediately** and tell the user which cases have which missing fields. Do not submit any cases until the user fixes the issues and confirms to proceed.

Response has `queue` (array of IDs) and `cases` (array of case objects) with fields:
- `id`: Database ID (used to mark as submitted later)
- `patient_mrn`: Goes into "Case ID" field
- `date_of_surgery`: Goes into date picker (format: MM/DD/YYYY)
- `attending_surgeon`: Search in Attending dropdown (last name only)
- `patient_age`: Determines Patient Type (Adult if >= 18, Pediatric if < 18)
- `cpt_code`: Search in CPT Code field

### Step 2: For Each Case, Fill the ACGME Form

Use browser automation tools in this order:

**IMPORTANT**: The date field must be set LAST, immediately before submitting. The ACGME form resets the date when other fields are changed.

1. **Navigate** to https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert (if not already there)

2. **Take screenshot** to verify the page loaded

3. **Fill Case ID** (the MRN):
   - Find the first text input at the top of the form
   - Set its value to the `patient_mrn`

4. **Case Year**: Already set to "6" (verify, don't change unless wrong)

5. **Role**: Already set to "Lead Resident Surgeon" after first case (verify on first case)

6. **Site**:
   - If attending is "Towner" or "Sierens": set to "John H. Stroger Jr. Hospital of Cook County"
   - Otherwise: set to "Rush University Medical Center"
   - (Persists between submissions - only change if different from previous case)

7. **Attending**: This is a searchable dropdown
   - Type the attending's last name and select from results (applies to all attendings including Towner/Sierens)
   - If attending is "Wang", select "Wang, Timothy" (do NOT select "Wang, Dian")
   - If the attending does not appear in the dropdown, select "Other, Attending_"
   - (Persists between submissions - only change if different from previous case)

8. **Patient Type**: Set based on age
   - If `patient_age` >= 18 or unknown: "Adult"
   - If `patient_age` < 18: "Pediatric"
   - (Usually stays as "Adult" - only change if pediatric case)

9. **CPT Code Search**:
    - Click the "Area/Type/Code" tab to switch to it
    - Find the "Code or Keyword" text input (use `find` to locate it reliably)
    - Type the `cpt_code`
    - Click the Search button (magnifying glass icon, use `find` to locate the button ref)
    - Wait for results to load
    - Check Microdissection if needed (step 10) BEFORE clicking Add
    - Use `find` to locate the "Add" button in the first result row, then click it via ref
    - Verify "Selected" counter increments in the top-right panel

10. **Microdissection Checkbox**:
    - Check Microdissection if ANY of the following apply:
      - Case category contains "Tumor" (e.g., "Cranial: Tumor General", "Cranial: Tumor Sellar/Parasellar", "Pediatric: Cranial Tumor")
      - Procedure is a microvascular decompression (MVD) - look for "microvascular decompression", "MVD", or CPT 61458 in the procedure name/CPT
    - The checkbox appears next to the CPT code row in search results
    - Check the Microdissection checkbox BEFORE clicking Add

11. **Set Date** (DO THIS LAST - right before submit):
    - Use `find` to locate the Case Date text input by ref (do NOT use querySelectorAll index - form inputs shift)
    - Use `form_input` with the ref to set value to `date_of_surgery` in M/D/YYYY format (e.g., "1/14/2026")
    - After setting, verify the Case ID field still contains the MRN (not the date) - the form can sometimes cross-contaminate fields
    - If Case ID was overwritten, re-set it with `form_input`
    - This MUST be the last field edited before clicking Submit

12. **Submit the case**:
    - Click the "Submit" button (green button at top right)
    - Wait for confirmation (form resets, case count increases)
    - **Auto-submit**: Do not ask for user confirmation before submitting - always submit automatically

### Step 3: Mark Case as Submitted

After successful submission:
```
POST http://localhost:3000/api/cases/{id}/mark-submitted
```

### Step 4: Repeat for Next Case

After marking as submitted, the form should reset. Repeat from Step 2 for the next case.

## Field Mapping Reference

| Case Logger Field | ACGME Field | Order | Notes |
|-------------------|-------------|-------|-------|
| patient_mrn | Case ID | 1st | First text input |
| - | Case Year | - | Already "6", don't change |
| - | Role | - | Already "Lead Resident Surgeon" |
| attending_surgeon | Site | 2nd | "John H. Stroger Jr. Hospital of Cook County" if Towner/Sierens |
| attending_surgeon | Attending | 3rd | Search by last name; Wang = Wang, Timothy; fallback = Other, Attending_ |
| patient_age | Patient Type | 4th | Only change if pediatric (<18) |
| cpt_code | Code or Keyword | 5th | Search and Add |
| case_category | Microdissection | 6th | Check BEFORE Add if tumor or MVD case |
| date_of_surgery | Case Date | **LAST** | Set immediately before Submit! |

**WARNING**: The Case Date field gets reset when other fields change. Always set it LAST.

## Error Handling

- If CPT code search returns no results, log a warning and skip that case
- If attending name not found, select "Other, Attending_" and continue
- If form submission fails, do NOT mark as submitted
- Take screenshots at key steps for debugging
- **Always verify the Case Date shows the correct value before clicking Submit**
- If date appears wrong, clear and re-enter it

## Known ACGME Form Quirks

1. **Date field resets**: The Case Date input gets overwritten when other form fields change. Always set it as the very last step before Submit.
2. **Attending dropdown**: Search by last name for all attendings regardless of site. Wang means Wang, Timothy; if no result appears, use Other, Attending_.
3. **Fields persist**: Role, Site, Attending, and Patient Type carry over between submissions - only change if different from previous case.
4. **Use refs, not coordinates**: Always use `find` to get element refs rather than clicking by coordinate. The form layout shifts as sections expand/collapse.
5. **Case ID cross-contamination**: JavaScript-based date setting (via nativeInputValueSetter) can accidentally write to the Case ID field if using array index selectors. Always use `form_input` with a ref instead, and verify Case ID after setting the date.
6. **Duplicate CPT adds**: If Add is clicked but the Selected counter doesn't increment, the click may not have registered. Always verify the counter before proceeding. If duplicates appear, use the red trash icon in the Selected panel to remove extras.
