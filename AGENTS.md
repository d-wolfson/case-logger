# Case Logger - Codex Instructions

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

## ACGME Queue Automation

When the user says "submit acgme", "submit acgme log", or "process ACGME queue", follow `.codex/commands/submit-acgme.md`.

The user must be logged into ACGME before browser automation starts. Use the user's real Chrome browser for the ACGME site.

Do not mark a case submitted locally until ACGME success is clear.

## Useful Commands

```bash
npm run doctor
npm run validate
npm run acgme:next
npm run acgme:sample
npm run acgme:chrome:check
npm run acgme:chrome:fill-next
npm run acgme:chrome:run-queue
```

## Data Safety

Do not commit PHI-bearing local files. See `docs/data-safety.md`.
