# Case Logger - Codex Instructions

## Overview
Case Logger is a neurosurgery case logging app. It runs locally at `http://localhost:3000` with a Node.js/Express backend, SQLite database, Gemini extraction, and vanilla JS frontend.

## Quick Start
```bash
cd /Users/danielwolfson/Documents/Projects/case-logger
node server.js
```

The app expects `.env` to contain `GEMINI_API_KEY`.

## ACGME Queue Automation
When the user says "submit acgme", "submit acgme log", or "process ACGME queue", follow `.codex/commands/submit-acgme.md`.

Use the user's real Chrome browser for the ACGME site. The user should already be logged in before automation starts.

Do not mark a case as submitted locally until the ACGME submission visibly succeeds.

## Key API Endpoints
- `GET /api/acgme-queue` - queued case IDs and full case details
- `POST /api/cases/:id/mark-submitted` - mark a case submitted and remove it from the queue
- `GET /api/cases/pending-acgme` - unsubmitted cases
- `POST /api/acgme-queue` - add cases to the submission queue
- `DELETE /api/acgme-queue` - clear or remove cases from the queue

## Domain Rules
- Towner and Sierens use Site = `John H. Stroger Jr. Hospital of Cook County`.
- All other attendings use Site = `Rush University Medical Center`.
- If Case Logger has attending `Wang`, select `Wang, Timothy` in ACGME. Do not select `Wang, Dian`.
- If an attending does not appear in the ACGME Attending dropdown, select `Other, Attending_`.
- Case Year should be `6`.
- Role should be `Lead Resident Surgeon`.
- Patient Type is `Adult` for age 18 or older, `Pediatric` for age under 18.
- Check Microdissection for tumor-category cases or MVD cases, including CPT `61458`.
- ACGME dates should be entered as `M/D/YYYY`.
- Set Case Date last, immediately before submit, because the ACGME form can reset it.
