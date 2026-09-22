---
name: debugging-loop
description: Use when the user reports a bug, an error, unexpected behavior, or asks the agent to "fix" or "debug" something. Enforces a structured diagnose-before-fix loop instead of guessing at fixes.
---

# Debugging Loop

Do not start editing code to "try things" until step 1–3 are done.

## Process
1. **Reproduce.** Find or write the minimal steps/input that trigger the bug. If it can't be reproduced, say so and ask for more detail (exact steps, error message, environment) rather than guessing.
2. **Isolate.** Narrow down the failure to the smallest unit responsible — a function, a component, a query — using logging, a debugger, or bisection (e.g. `git bisect`, commenting out code paths).
3. **Form a hypothesis.** State in one sentence what you believe is causing the bug and why, before changing code.
4. **Fix.** Make the smallest change that addresses the root cause, not just the symptom.
5. **Verify.** Confirm the original repro no longer fails, and add a regression test that would have caught this bug.
6. **Check for siblings.** Search the codebase for the same pattern elsewhere that might have the same bug.

## Rules
- Don't apply a fix you can't explain the mechanism for.
- If after isolation the root cause is still unclear, say so explicitly rather than shipping a speculative fix.
- Prefer fixing root cause over adding defensive checks that mask the symptom, unless the root cause is out of scope — in which case say that too.
