# Case Logger - Neurosurgery Case Logging App

## Project Overview
AI-powered surgical case logging application for neurosurgery residents. Built for Daniel Wolfson, neurosurgery resident, to streamline ACGME case log documentation.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (via sql.js)
- **AI Vision**: Google Gemini 3 Flash Preview API
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Image Processing**: Client-side resize before upload (1600px max, 85% JPEG quality)

## Key Features (v1.0)
- Upload single or multiple images per case (Epic screenshots, OR board photos, case cards)
- AI extracts and consolidates data from multiple images
- Auto-infers CPT codes from procedure descriptions using neurosurgery CPT reference
- Auto-infers ACGME case categories (Cranial, Spinal, Peripheral Nerve, Pediatric)
- Batch upload: process many images at once, AI auto-groups by MRN + date
- Manual case entry option (no image required)
- Edit existing case entries
- Searchable case database with batch selection
- Table view with hover tooltips for CPT descriptions
- Stats/Analytics dashboard (by category, attending, CPT with avg duration, anesthesia)
- ACGME submission queue with browser automation
- CSV export for ACGME compliance

## Database Schema
```sql
cases (
  id, date_of_surgery, patient_mrn, patient_age, patient_gender,
  attending_surgeon, procedure_name, cpt_code, cpt_inferred_note,
  case_category, laterality, case_duration, anesthesia_staff,
  other_details, raw_extracted_text, image_filename, created_at
)
```

## File Structure
```
case-logger/
├── server.js           # Express server, API routes, Gemini integration
├── package.json        # Dependencies
├── .env                # GEMINI_API_KEY (do not commit)
├── database.db         # SQLite database file (auto-created)
├── acgme-queue.json    # Persisted queue for ACGME submission
├── public/
│   ├── index.html      # Main UI (5 tabs: Upload, My Cases, Table, Stats, Export)
│   ├── style.css       # Green/sage theme styling
│   └── app.js          # Frontend logic, image resize, form handling, stats
└── .claude/
    └── commands/
        └── submit-acgme.md  # Instructions for ACGME browser automation
```

## API Endpoints
- `POST /api/upload` - Upload images, returns AI-extracted data
- `POST /api/cases` - Save a case to database
- `GET /api/cases` - Get all cases
- `GET /api/cases/search?q=` - Search cases
- `GET /api/cases/pending-acgme` - Get cases not yet submitted to ACGME
- `PUT /api/cases/:id` - Update a case
- `DELETE /api/cases/:id` - Delete a case
- `POST /api/cases/:id/mark-submitted` - Mark case as submitted to ACGME
- `POST /api/cases/:id/unmark-submitted` - Mark case as pending ACGME
- `POST /api/acgme-queue` - Add case IDs to submission queue
- `GET /api/acgme-queue` - Get queued cases
- `DELETE /api/acgme-queue` - Clear the queue
- `GET /api/export/csv` - Export all cases as CSV

## Running the App
```bash
cd ~/Documents/Projects/case-logger
node server.js
# Open http://localhost:3000
```

## Environment Variables
- `GEMINI_API_KEY` - Google AI API key (stored in .env)

## Neurosurgery Attendings
Munich, Fontes, Sani, Mallela, Wang, Dewald, Deutsch, O'Toole, Munoz, Chen, Crowley, Traynelis, Jimenez, Zelby, Luken, Boco, Towner, Sierens

*Note: Towner and Sierens cases use Site = "Other" in ACGME (not Rush)*

## CPT Code Reference
The app includes a comprehensive neurosurgery CPT code reference for AI inference:
- Cranial procedures (61xxx)
- Spine procedures - Cervical, Thoracic, Lumbar (22xxx, 63xxx)
- Instrumentation (22840-22854)
- Peripheral nerve (64xxx)
- Shunts/CSF (62xxx)
- Stereotactic procedures (61796-61800)

## Future Features (Prioritized)

### Completed
- [x] Batch upload - multiple cases at once (AI auto-groups by MRN + Date)
- [x] Edit existing entries
- [x] Case categories (ACGME-aligned taxonomy, AI infers + user confirms)
- [x] Manual case entry (no image required)
- [x] Neurosurgery attending filter (ignores co-attendings from other services)
- [x] Case statistics dashboard (totals, breakdowns by category/attending/CPT/anesthesia)
- [x] Table view with hover tooltips
- [x] ACGME submission queue with browser automation
- [x] Microdissection auto-check for tumor cases

### High Priority
- [ ] Attach pre/post-op imaging to cases (full quality storage)
- [ ] Duplicate detection on upload

### Nice to Have
- [ ] Date range filtering in stats
- [ ] Edit from table view (click row to edit)

### Not Needed
- ~~Role tracking~~ (not relevant for workflow)
- ~~Cloud backup/sync~~ (local is fine)

## Case Category Taxonomy (ACGME-Aligned)

### Cranial
- Cranial: Tumor General
- Cranial: Tumor Sellar/Parasellar
- Cranial: Trauma/Other
- Cranial: Vascular Open
- Cranial: Vascular Endovascular
- Cranial: Vascular Total
- Cranial: CSF Diversion/ETV/Other
- Cranial/Extracranial: Pain
- Cranial/Extracranial: Functional Disorders
- Cranial/Extracranial: Epilepsy

### Spinal
- Spinal: Anterior Cervical
- Spinal: Posterior Cervical
- Spinal: Thoracic/Lumbar/Sacral Instrumentation Fusion
- Spinal: Lumbar Laminectomy/Laminotomy
- Spinal: Stimulation/Lesion/Pump/Other

### Peripheral Nerve
- Peripheral Nerve (single category, or add subcategories if needed)

### Pediatric
- Pediatric: Cranial Tumor
- Pediatric: Cranial Trauma/Other
- Pediatric: CSF Diversion/ETV/Other
- Pediatric: Spine
