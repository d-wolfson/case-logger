# Case Logger - Claude Instructions

## Overview

Case Logger is a local neurosurgery case logging app. It runs at `http://localhost:3000` with a Node.js/Express backend, SQLite database, Gemini extraction, and vanilla JS frontend.

## Quick Start

```bash
npm install
npm start
```

The app expects `.env` to contain `GEMINI_API_KEY`; copy `.env.example` if needed.

## Canonical Documentation

Use these docs as source of truth:
- `docs/setup.md` - fresh clone, health checks, backups, fixtures
- `docs/acgme-workflow.md` - ACGME submission rules and safety checks
- `docs/browser-automation.md` - Claude/Codex browser automation paths
- `docs/data-safety.md` - what must not be committed

## Common User Requests

### "submit acgme" / "submit acgme log" / "process acgme queue"

Run the `/submit-acgme` slash command. Follow `docs/acgme-workflow.md` for clinical mappings, browser prerequisites, validation, submit verification, and local marking.

## Useful Commands

```bash
npm run doctor
npm run validate
npm run acgme:next
npm run acgme:sample
npm run acgme:chrome:check
```

## Key API Endpoints

- `GET /api/acgme-queue` - queued case IDs and full case details
- `POST /api/cases/:id/mark-submitted` - mark a case submitted and remove it from the queue
- `GET /api/cases/pending-acgme` - unsubmitted cases
- `POST /api/upload` - upload images for AI extraction
- `POST /api/cases` - save a case
- `GET /api/cases` - get all cases
- `PUT /api/cases/:id` - update a case

## Safety

Do not commit PHI-bearing local files. See `docs/data-safety.md`.

Never mark a case submitted locally until ACGME success is clear.
