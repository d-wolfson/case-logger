# Case Logger - Neurosurgery Case Logging App

## Overview
AI-powered surgical case logging app. Node.js + Express backend, SQLite database, Gemini AI for image extraction, vanilla JS frontend. Runs at http://localhost:3000.

## Quick Start
```bash
cd ~/Documents/Projects/case-logger
node server.js
```
Requires `.env` with `GEMINI_API_KEY`.

## Common User Requests

### "submit acgme" / "submit acgme log" / "process acgme queue"
Run the `/submit-acgme` slash command. This uses browser automation (Claude-in-Chrome) to submit queued cases to the ACGME portal. See `.claude/commands/submit-acgme.md` for full instructions.

## Key API Endpoints
- `GET /api/acgme-queue` - Get queued cases with full details
- `POST /api/cases/:id/mark-submitted` - Mark case as submitted
- `GET /api/cases/pending-acgme` - Get unsubmitted cases
- `POST /api/upload` - Upload images for AI extraction
- `POST /api/cases` - Save a case
- `GET /api/cases` - Get all cases
- `PUT /api/cases/:id` - Update a case

## File Structure
```
server.js              # All backend routes + Gemini AI integration
public/app.js          # Frontend logic
public/index.html      # UI (Upload, My Cases, Table, Stats, ACGME Queue, Follow-Up, Export)
public/style.css       # Styling
database.db            # SQLite database
acgme-queue.json       # Persisted ACGME submission queue (array of case IDs)
cpt-reference.json     # Neurosurgery CPT code reference
.claude/commands/submit-acgme.md  # ACGME browser automation instructions
```

## Database Schema
```sql
cases (
  id, date_of_surgery, patient_mrn, patient_age, patient_gender,
  attending_surgeon, procedure_name, cpt_code, cpt_inferred_note,
  case_category, laterality, case_duration, anesthesia_staff,
  other_details, raw_extracted_text, image_filename, created_at,
  submitted_to_acgme INTEGER DEFAULT 0,
  follow_up_note, follow_up_status, follow_up_due_date
)
```

## Key Domain Knowledge

### Attendings (Last Name Only)
Munich, Fontes, Sani, Mallela, Wang, Dewald, Deutsch, O'Toole, Munoz, Chen, Crowley, Traynelis, Jimenez, Zelby, Luken, Boco, Towner, Sierens

- **Towner and Sierens** use Site = "John H. Stroger Jr. Hospital of Cook County" in ACGME (not Rush)
- All others use Site = "Rush University Medical Center"
- If attending is **Wang**, select "Wang, Timothy" in ACGME (not "Wang, Dian")
- If an attending does not appear in the ACGME dropdown, select "Other, Attending_"

### ACGME Submission Rules
- Date field must be set LAST (form resets it when other fields change)
- Date format: M/D/YYYY (e.g., "1/14/2026")
- Check Microdissection for any "Tumor" category case OR microvascular decompression (MVD/CPT 61458)
- Case Year = 6, Role = Lead Resident Surgeon
- If Site = "John H. Stroger Jr. Hospital of Cook County", search for attending by last name (same as Rush)

### Data Formats
- Dates in database: YYYY-MM-DD
- Attending names: last name only
- Case duration: stored in minutes
