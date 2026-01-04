# Case Logger - Handoff Notes

*Last updated: January 4, 2026*

**GitHub**: https://github.com/d-wolfson/case-logger (private)

## What We Completed Today (Jan 4)

### New Features
1. **Duplicate Detection** - Warns when saving a case with same MRN + date as existing case
2. **ACGME CSV Import** - Import historical cases from ACGME case log export (Export/Import tab)
3. **Monthly Trends Line Graph** - SVG line chart showing case volume over entire residency
4. **Table Sorting** - Click column headers to sort (Date, MRN, Procedure, CPT, Attending, Category, ACGME)
5. **Edit from Table View** - Edit button in table rows

### Improvements
- **Standardized Date Format** - All dates now YYYY-MM-DD (Gemini extraction + imports)
- **Attending Names** - Now uses last name only throughout (consistent for stats grouping)
- **Vascular Category Fix** - Import strips ", Cranial: Vascular Total" suffix from ACGME exports
- **CPT Descriptions** - Stats now show descriptions for imported cases (uses cpt_inferred_note)
- **Tab Renamed** - "Export" tab is now "Export/Import"
- **JSON Payload Limit** - Increased to 10MB for large ACGME imports
- **JSON Parsing** - More robust extraction of JSON from Gemini responses

---

## Previous Session (Jan 3)

### Core Features
1. **Image Upload with AI Extraction** - Upload OR screenshots, AI (Gemini 3 Flash Preview) extracts case data
2. **Batch Upload** - Multiple images processed together, auto-grouped by MRN + date
3. **Manual Case Entry** - Option to enter cases without images
4. **Case List View** - Searchable, with checkboxes for batch selection
5. **Table View** - Compact summary table with hover tooltips showing full CPT descriptions
6. **Stats/Analytics Dashboard** - Breakdowns by category, attending, CPT code (with avg duration), monthly trends
7. **ACGME Submission Queue** - Select cases in webapp, queue them, then say "process ACGME queue" to submit via browser automation
8. **CSV Export** - Download all cases for ACGME compliance
9. **Image Attachments** - Attach pre/post-op imaging to cases (full quality, stored in uploads/)

### ACGME Browser Automation
- Fills Case ID, Date, Case Year (6), Role (Lead Resident Surgeon), Site, Attending, Patient Type, CPT Code
- **Microdissection**: Auto-checks for tumor cases
- **Site Logic**: "Other" for Towner/Sierens, "Rush University Medical Center" for all others
- Marks cases as submitted in local database after successful submission

---

## Remaining Todo Items

### Pending
- [ ] Attach images directly from table view (quick attachment)
- [ ] Date range filtering in stats dashboard
- [ ] Quick filters on case list (by attending, category, status)
- [ ] Mobile-friendly responsive design

### Not Needed
- ~~Role tracking~~ (not relevant for workflow)
- ~~Cloud backup/sync~~ (local is fine)
- ~~ACGME requirements tracker~~ (user declined)
- ~~Bulk edit~~ (low priority)

---

## Known Issues / Notes

1. **Slash command `/submit-acgme` doesn't work** - Use "process ACGME queue" instead
2. **Server must be manually restarted** after code changes (no hot reload)
3. **Existing imported data** - Re-import needed to fix old vascular categories or get CPT descriptions

---

## Architectural Decisions

### Tech Stack
- **Backend**: Node.js + Express (single server.js file)
- **Database**: SQLite via sql.js (in-memory, persisted to database.db)
- **AI**: Google Gemini 3 Flash Preview API for image extraction and CPT matching
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Browser Automation**: Claude-in-Chrome MCP extension

### Data Flow
1. User uploads image(s) → client resizes to 1600px max
2. Server sends to Gemini for extraction → returns structured JSON
3. Second Gemini call for CPT code matching (batched for multiple cases)
4. User reviews/edits in webapp → saves to SQLite
5. ACGME submission via browser automation (separate from webapp)

### Key Files
```
case-logger/
├── server.js              # All backend logic, API routes, Gemini integration
├── database.db            # SQLite database (auto-created)
├── acgme-queue.json       # Persisted queue for ACGME submission
├── uploads/               # Case image attachments (uploads/{case_id}/)
├── public/
│   ├── index.html         # Main UI (5 tabs: Upload, My Cases, Table, Stats, Export/Import)
│   ├── style.css          # All styling (green/sage theme)
│   └── app.js             # Frontend logic, form handling, stats rendering
└── .claude/
    └── commands/
        └── submit-acgme.md  # Instructions for ACGME browser automation
```

### Database Schema
```sql
cases (
  id INTEGER PRIMARY KEY,
  date_of_surgery, patient_mrn, patient_age, patient_gender,
  attending_surgeon, procedure_name, cpt_code, cpt_inferred_note,
  case_category, laterality, case_duration, anesthesia_staff,
  other_details, raw_extracted_text, image_filename, created_at,
  submitted_to_acgme INTEGER DEFAULT 0
)

case_images (
  id, case_id, filename, original_name, mime_type, size_bytes, created_at
  -- Foreign key to cases(id) with CASCADE delete
)
```

### API Endpoints
- `POST /api/upload` - Upload images, returns AI-extracted data
- `POST /api/cases` - Save a case to database
- `GET /api/cases` - Get all cases (includes image_count)
- `GET /api/cases/:id` - Get single case by ID
- `GET /api/cases/search?q=` - Search cases
- `GET /api/cases/check-duplicate?mrn=&date=` - Check for duplicate cases
- `PUT /api/cases/:id` - Update a case
- `DELETE /api/cases/:id` - Delete a case
- `POST /api/cases/:id/mark-submitted` - Mark case as submitted to ACGME
- `POST /api/cases/:id/unmark-submitted` - Mark case as pending ACGME
- `POST /api/cases/:id/images` - Upload image attachments
- `GET /api/cases/:id/images` - Get images for a case
- `GET /api/images/:imageId` - Serve an image file
- `DELETE /api/images/:imageId` - Delete an image
- `POST /api/import` - Bulk import cases from ACGME CSV
- `POST /api/acgme-queue` - Add case IDs to submission queue
- `GET /api/acgme-queue` - Get queued cases
- `DELETE /api/acgme-queue` - Clear the queue
- `GET /api/export/csv` - Export all cases as CSV

### Neurosurgery Attendings (Last Name Only)
Munich, Fontes, Sani, Mallela, Wang, Dewald, Deutsch, O'Toole, Munoz, Chen, Crowley, Traynelis, Jimenez, Zelby, Luken, Boco, **Towner**, **Sierens**

*Note: Towner and Sierens cases use Site = "Other" in ACGME*

---

## Environment Setup

```bash
# Prerequisites
node --version  # v18+
npm install

# Environment variables (.env file)
GEMINI_API_KEY=your_api_key_here

# Run the server
node server.js
# Opens at http://localhost:3000
```

## ACGME Submission Workflow

1. In webapp: Select cases → Click "Submit to ACGME" → Cases added to queue
2. In Claude Code: Say "process ACGME queue"
3. Browser automation fills ACGME form for each case
4. Cases marked as submitted in local database

## ACGME Import Workflow

1. Export case log from ACGME website as CSV
2. Go to Export/Import tab → Click "Select CSV File"
3. Review preview of cases to import
4. Click "Import All" - cases imported and marked as already submitted
