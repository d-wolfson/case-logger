# Browser Automation

Case Logger supports both Claude and Codex workflows. The shared ACGME rules live in `docs/acgme-workflow.md`.

## Codex

Codex uses:
- `AGENTS.md`
- `.codex/commands/submit-acgme.md`
- `scripts/acgme-chrome.mjs`
- `scripts/acgme-worklist.mjs`

Recommended checks:

```bash
npm run acgme:chrome:check
npm run acgme:next
```

Single supervised fill:

```bash
npm run acgme:chrome:fill-next
```

Full queue after explicit authorization:

```bash
npm run acgme:chrome:run-queue
```

## Claude

Claude uses:
- `CLAUDE.md`
- `.claude/commands/submit-acgme.md`

Claude can either use browser extension tooling manually or call the same repo scripts when it has terminal access. The clinical and ACGME form rules are the same as Codex because both agents reference `docs/acgme-workflow.md`.

## Chrome Fast Automation

On macOS Chrome, the Codex fast path requires:

```text
Google Chrome > View > Developer > Allow JavaScript from Apple Events
```

If this is disabled, `npm run acgme:chrome:check` will tell the user to enable it.

## Safety Rule

Never mark a case submitted locally until ACGME success is clear. The preferred success signal is an increment in ACGME's submitted-case count.
