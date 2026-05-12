# Case Logger

AI-powered surgical case logging app for neurosurgery residents. Upload OR screenshots or case cards, let the model extract key fields, and keep a clean, searchable case database for ACGME compliance.

## Features
- Single or batch image upload with AI extraction
- Manual case entry
- CPT inference and ACGME category suggestions
- Duplicate detection (MRN + date)
- Searchable case list with bulk actions
- Table view with sorting, filters, and infinite scroll rendering
- Attach imaging to cases
- Analytics dashboard with monthly trends
- ACGME queue + browser automation workflow
- CSV import/export for ACGME
- Full backup/restore (database, queue, attachments)

## Tech Stack
- Backend: Node.js + Express
- Database: SQLite via sql.js
- AI: Google Gemini 3 Flash Preview API
- Frontend: Vanilla HTML/CSS/JavaScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup
1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd case-logger
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `GEMINI_API_KEY`.
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000

### Reproducibility Checks

Run these on a fresh clone:

```bash
npm run doctor
npm run validate
```

`doctor` checks local readiness, data-safety ignore patterns, server reachability, and Chrome automation configuration. `validate` runs offline syntax checks and verifies the anonymized ACGME fixture.

## Step-by-Step Usage (New User)

### 1) Upload Epic Screenshots (or OR Boards / Case Cards)
1. In your EHR (Epic), open the case details page and take a screenshot (or export as image).
2. In the app, go to the **Upload** tab.
3. Drag and drop one or multiple screenshots.
4. Wait for the AI extraction to finish.
5. Review the extracted fields and edit if needed.
6. Click **Save Case**.

Tips:
- You can upload multiple images for the same case. The app will auto-group by MRN + date.
- If extraction is off, just edit before saving.

### 2) Manual Case Entry (No Image)
1. Click **Enter Manually** on the Upload tab.
2. Fill in the fields (Date, MRN, Attending, Procedure, CPT, etc.).
3. Click **Save Case**.

### 3) Review, Edit, and Attach Imaging
- **My Cases** tab: search, bulk select, or edit cases.
- **Table** tab: sort, filter, and edit cases in a compact view.
- Click the 📎 icon to attach pre/post-op imaging to a case.

### 4) Import Historical ACGME Cases (Optional)
1. Export your ACGME case log as CSV.
2. Go to **Export/Import** tab.
3. Click **Select CSV File** and choose the export.
4. Review the preview and click **Import All**.

### 5) Export Cases to CSV
1. Go to **Export/Import** tab.
2. Click **Download CSV**.

### 6) Full Backup / Restore
1. Go to **Export/Import** tab.
2. Click **Download Backup** to save a zip of `database.db`, `uploads/`, and `acgme-queue.json`.
3. To restore, click **Restore Backup** and select the zip (this replaces current data).

## ACGME Submission Workflow (Claude Or Codex)
This project supports Claude or Codex browser automation to submit queued cases into ACGME.

1. In the app, select cases in **My Cases** and click **Submit to ACGME**.
2. This adds them to a local queue.
3. Log into ACGME in Chrome and open the Case Entry page.
4. In Claude or Codex, say:
   ```
   process ACGME queue
   ```
5. The agent will validate the queue, control Chrome, and autofill each case.
6. On success, cases are marked as submitted in the local database.

The first run on a new machine/browser session should use supervised pilot mode: the agent fills one case and pauses before final submit so you can verify the ACGME form. After that, you can authorize full auto-submit for the queue.

Note: attending-to-site mapping is automatic and documented in `docs/acgme-workflow.md`.

Canonical workflow docs:
- `docs/acgme-workflow.md`
- `docs/browser-automation.md`
- `AGENTS.md` for Codex
- `CLAUDE.md` for Claude

## Data Notes
- Dates are standardized to YYYY-MM-DD.
- Attending names are stored as last name only.
- Local data lives in `database.db` and `uploads/`.
- Sensitive local data is ignored by git. See `docs/data-safety.md`.

## Useful Commands

```bash
npm run doctor
npm run validate
npm run backup
npm run restore -- backups/example.zip
npm run acgme:sample
npm run acgme:next
npm run acgme:chrome:check
npm run acgme:chrome:fill-next
npm run acgme:chrome:run-queue
```

## Project Structure
```
case-logger/
├── server.js
├── docs/
├── fixtures/
├── scripts/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── AGENTS.md
├── CLAUDE.md
└── .env.example
```

## Environment Variables
- `GEMINI_API_KEY`: Google AI API key
- `PORT`: Optional server port override; defaults to `3000`

## License
Private / internal use.
