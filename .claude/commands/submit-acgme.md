---
description: Submit pending cases to ACGME website
---

Submit all pending surgical cases from Case Logger to the ACGME website using browser automation.

## Prerequisites

1. Case Logger server must be running at http://localhost:3000
2. User must already be logged into ACGME at https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert
3. The claude-in-chrome MCP browser extension must be connected

## Workflow

### Step 1: Get Pending Cases

Fetch cases that haven't been submitted yet:
```
GET http://localhost:3000/api/cases/pending-acgme
```

This returns an array of case objects with fields:
- `id`: Database ID (used to mark as submitted later)
- `patient_mrn`: Goes into "Case ID" field
- `date_of_surgery`: Goes into date picker (format: MM/DD/YYYY)
- `attending_surgeon`: Search in Attending dropdown (last name only)
- `patient_age`: Determines Patient Type (Adult if >= 18, Pediatric if < 18)
- `cpt_code`: Search in CPT Code field

### Step 2: For Each Case, Fill the ACGME Form

Use browser automation tools in this order:

1. **Navigate** to https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert (if not already there)

2. **Take screenshot** to verify the page loaded

3. **Fill Case ID** (the MRN):
   - Find the first text input at the top of the form
   - Set its value to the `patient_mrn`

4. **Set Date** (usually auto-fills to today, may need adjustment):
   - Find the date input field
   - Set value to `date_of_surgery`

5. **Case Year**: Always set to "6" (dropdown)

6. **Role**: Always set to "Lead Resident Surgeon" (dropdown)

7. **Site**:
   - If attending is "Towner" or "Sierens": set to "Other"
   - Otherwise: set to "Rush University Medical Center"

8. **Attending**: This is a searchable dropdown
   - Click on the Attending dropdown to open it
   - Type the attending's last name (extract from `attending_surgeon`)
   - Wait for search results
   - Click on the matching result
   - **If attending not found**: Select "Other Attending" from the dropdown instead

9. **Patient Type**: Set based on age
   - If `patient_age` >= 18 or unknown: "Adult"
   - If `patient_age` < 18: "Pediatric"

10. **CPT Code Search**:
    - Click on "Area/Type/Code" tab if not already there
    - Find the "Code or Keyword" text input
    - Type the `cpt_code`
    - Click the Search button (magnifying glass)
    - Wait for results to load
    - Click the "Add" button next to the matching CPT code

11. **Microdissection Checkbox**:
    - If the case category contains "Tumor" (e.g., "Cranial: Tumor General", "Cranial: Tumor Sellar/Parasellar", "Pediatric: Cranial Tumor")
    - AND a "Microdissection" checkbox appears next to the added CPT code
    - Check the Microdissection checkbox

12. **Submit the case**:
    - Click the "Submit" button (green button at top right)
    - Wait for confirmation
    - **Auto-submit**: Do not ask for user confirmation before submitting - always submit automatically

### Step 3: Mark Case as Submitted

After successful submission:
```
POST http://localhost:3000/api/cases/{id}/mark-submitted
```

### Step 4: Repeat for Next Case

After marking as submitted, the form should reset. Repeat from Step 2 for the next case.

## Field Mapping Reference

| Case Logger Field | ACGME Field | Notes |
|-------------------|-------------|-------|
| patient_mrn | Case ID | First text input |
| date_of_surgery | Date | Date picker, MM/DD/YYYY |
| - | Case Year | Always "6" |
| - | Role | Always "Lead Resident Surgeon" |
| attending_surgeon | Site | "Other" if Towner/Sierens, else "Rush University Medical Center" |
| attending_surgeon | Attending | Search by last name |
| patient_age | Patient Type | Adult (>=18) or Pediatric (<18) |
| cpt_code | Code or Keyword | Search and Add |
| case_category | Microdissection | Check if category contains "Tumor" |

## Error Handling

- If CPT code search returns no results, log a warning and skip that case
- If attending name not found, try partial match or skip
- If form submission fails, do NOT mark as submitted
- Take screenshots at key steps for debugging
