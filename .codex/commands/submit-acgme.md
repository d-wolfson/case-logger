# Submit ACGME Queue With Codex

Submit queued Case Logger cases to the ACGME Case Logs site using Codex-controlled Chrome.

## Source Of Truth

Follow `docs/acgme-workflow.md` exactly for:
- operating mode
- queue validation
- field mapping
- Wang/Sierens/Towner/Other attending rules
- microdissection logic
- submit verification
- local `mark-submitted` behavior

## Codex Fast Path

Start or verify Case Logger:

```bash
npm start
npm run acgme:next
```

Verify Chrome Apple Events automation:

```bash
npm run acgme:chrome:check
```

Supervised pilot:

```bash
npm run acgme:chrome:fill-next
```

After explicit user authorization for full auto-submit:

```bash
npm run acgme:chrome:run-queue
```

## Fallback

If the Chrome bridge is unavailable, use Computer Use/browser tooling manually and follow `docs/acgme-workflow.md`. Stop before final Submit unless the user has explicitly authorized submission in the current conversation.
