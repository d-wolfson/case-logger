---
description: Submit pending cases to ACGME website
---

# Submit ACGME Queue With Claude

Submit queued Case Logger cases to the ACGME Case Logs site using Claude browser automation.

## Source Of Truth

Follow `docs/acgme-workflow.md` exactly for:
- operating mode
- queue validation
- field mapping
- Wang/Sierens/Towner/Other attending rules
- microdissection logic
- submit verification
- local `mark-submitted` behavior

## Recommended Flow

Start or verify Case Logger:

```bash
npm start
npm run acgme:next
```

If terminal access and macOS Chrome Apple Events are available, Claude may use the same helper scripts:

```bash
npm run acgme:chrome:check
npm run acgme:chrome:fill-next
```

After explicit user authorization for full auto-submit:

```bash
npm run acgme:chrome:run-queue
```

If using the Claude-in-Chrome extension or other browser tools, manually follow `docs/acgme-workflow.md`. Stop before final Submit unless the user has explicitly authorized submission in the current conversation.
