# Case Logger - Handoff Notes

*Last updated: January 3, 2026*

**GitHub**: https://github.com/d-wolfson/case-logger (private)

## What We Completed Today

### Core Features
1. **Image Upload with AI Extraction** - Upload OR screenshots, AI (Gemini 2.5 Flash) extracts case data
2. **Batch Upload** - Multiple images processed together, auto-grouped by MRN + date
3. **Manual Case Entry** - Option to enter cases without images
4. **Case List View** - Searchable, with checkboxes for batch selection
5. **Table View** - Compact summary table with hover tooltips showing full CPT descriptions
6. **Stats/Analytics Dashboard** - Breakdowns by category, attending, CPT code (with avg duration), anesthesia staff
7. **ACGME Submission Queue** - Select cases in webapp, queue them, then say "process ACGME queue" to submit via browser automation
8. **CSV Export** - Download all cases for ACGME compliance

### ACGME Browser Automation
- Fills Case ID, Date, Case Year (6), Role (Lead Resident Surgeon), Site, Attending, Patient Type, CPT Code
- **Microdissection**: Auto-checks for tumor cases
- **Site Logic**: "Other" for Towner/Sierens, "Rush University Medical Center" for all others
- Marks cases as submitted in local database after successful submission

### UI Improvements
- Clickable ACGME badges to toggle submitted/pending status
- Raw database entry shown with low opacity on case cards
- Wider layout (1200px container)
- Smaller fonts on table view for better fit
- Full text wrapping in analytics (no truncation)

---

## Immediate Next Steps

### 1. Pre/Post-Op Imaging (From Roadmap)
Allow attaching full-quality images to existing cases for documentation.

### 2. Duplicate Detection
Detect and warn when uploading an image that matches an existing case (by MRN + date).

---

## Known Bugs / Loose Ends

1. **No duplicate detection** - Uploading the same image twice creates duplicate cases
2. **No edit from table view** - Must go to "My Cases" tab to edit
3. **No date range filtering** in stats dashboard
4. **Slash command `/submit-acgme` doesn't work** - Use "process ACGME queue" instead
5. **Server must be manually restarted** after code changes (no hot reload)
6. **No backup/restore** functionality for database

---

## Architectural Decisions

### Tech Stack
- **Backend**: Node.js + Express (single server.js file)
- **Database**: SQLite via sql.js (in-memory, persisted to database.db)
- **AI**: Google Gemini 2.5 Flash API for image extraction and CPT matching
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
├── public/
│   ├── index.html         # Main UI (5 tabs: Upload, My Cases, Table, Stats, Export)
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
```

### Neurosurgery Attendings
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
