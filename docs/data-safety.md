# Data Safety

This app is intended for local use with clinical case data. Treat the local database, uploads, exports, backups, logs, screenshots, and Epic reports as sensitive.

## Do Not Commit

The following should stay out of git:
- `.env`
- `database.db`
- `database.db.bak-*`
- `acgme-queue.json`
- `uploads/`
- `epic_reports/`
- `backups/`
- `restore_tmp/`
- `case-log-export-*.xlsx`
- `procedure-update-*.csv`
- screenshots or browser captures containing case data

Run this before committing:

```bash
git status --short
```

Only commit code, docs, templates, and anonymized fixtures.

## Fixtures

Fixtures must be fake or fully de-identified. The current fixture at `fixtures/sample-cases.json` uses synthetic MRNs and no real patient names.

## Backups

Backups created with `npm run backup` contain local database and upload data. They are ignored by git, but they still need the same handling as the original clinical data.

## Automation

ACGME browser automation transmits case log data to ACGME. Use supervised pilot mode for a new machine/browser session, then full auto-submit only after explicit user authorization.
