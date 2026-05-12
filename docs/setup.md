# Setup

## Fresh Clone

```bash
git clone https://github.com/d-wolfson/case-logger.git
cd case-logger
npm install
cp .env.example .env
```

Edit `.env` and set `GEMINI_API_KEY`.

Start the app:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Health Checks

Run:

```bash
npm run doctor
npm run validate
```

`doctor` checks local readiness and may warn if the server is not running or Chrome is not configured for fast ACGME automation. `validate` is offline and uses anonymized fixtures.

## Sample Data

Use `fixtures/sample-cases.json` to test ACGME queue normalization without patient data:

```bash
npm run acgme:sample
```

The sample fixture is intentionally fake. Do not replace it with real cases.

## Backup And Restore

Create a local backup:

```bash
npm run backup
```

Restore from a local backup:

```bash
npm run restore -- backups/case-logger-backup-example.zip
```

Backups contain PHI when the local database does. They are ignored by git and should be handled accordingly.
