---
name: doc-sync
description: Use whenever a change affects public-facing behavior, an API, a config option, a CLI command, or setup steps. Keeps README, changelog, and docstrings in sync with the code instead of letting docs go stale.
---

# Documentation Sync

## When this triggers
Any change to:
- Public function/class signatures
- API endpoints or CLI flags
- Environment variables or config options
- Setup/installation steps
- User-facing behavior described in the README or docs site

## Process
1. Identify which doc files describe the thing you just changed (README, `docs/`, docstrings, inline comments, CHANGELOG).
2. Update them in the same change set — not as a follow-up. If you're not going to update them, say so explicitly and why.
3. For a changelog, follow the project's existing format (fill in: e.g. Keep a Changelog style, conventional commits-derived, etc.) and add an entry under "Unreleased".
4. Keep doc updates factual and match the existing doc's tone/format — don't restructure surrounding sections unless asked.

## Checklist
- [ ] README/docs reflect new behavior, flags, or config
- [ ] Docstrings/comments updated for changed function signatures
- [ ] Changelog entry added if the project keeps one
- [ ] No stale examples left referencing old behavior
