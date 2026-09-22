---
name: pr-review-checklist
description: Use before declaring any coding task finished, opening a PR, or asking the user to review a diff. Runs a self-review pass so obvious issues are caught before the human looks at it.
---

# Pre-PR Review Checklist

Before telling the user a task is done, run through this checklist against the actual diff — don't skip it because the change "felt small."

## Checklist
- [ ] **Scope match:** the diff only touches what the task asked for; no drive-by changes left unexplained
- [ ] **Lint & typecheck** pass with the project's actual commands
- [ ] **Tests** run and pass; new/changed behavior has test coverage
- [ ] **No dead code:** no commented-out blocks, unused imports, or leftover debug logging (`console.log`, `print`, etc.)
- [ ] **No secrets:** no API keys, tokens, or credentials in the diff, including in test fixtures
- [ ] **Error handling:** new code paths handle failure cases, not just the happy path
- [ ] **Naming & style** match `codebase-conventions`
- [ ] **Migration/schema changes** (if any) are backward compatible or flagged as breaking
- [ ] **Docs/comments** updated if public behavior changed

## Output
Summarize the diff in a short PR-style description: what changed, why, how it was tested, and anything the reviewer should pay special attention to. Flag anything on the checklist you couldn't verify (e.g. "tests pass locally but I couldn't run the E2E suite").
