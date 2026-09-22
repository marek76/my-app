---
name: safe-refactor
description: Use when asked to refactor, clean up, restructure, or rename code without changing behavior. Enforces behavior-preserving, incremental changes with proof via tests.
---

# Safe Refactor

## Rules
1. **No behavior change without a test proving equivalence.** Before refactoring, ensure there's test coverage for the current behavior; if there isn't, add characterization tests first.
2. **Small, incremental diffs.** Prefer several small refactor commits/steps over one giant rewrite — each step should leave the code in a working, tested state.
3. **Separate refactoring from feature work.** If a refactor is needed to support a new feature, do the refactor as its own step with its own tests passing, then add the feature.
4. **Preserve public interfaces** unless the task explicitly asks to change them; if a signature must change, note every call site updated.

## Process
1. Confirm test coverage exists for the code being touched (add characterization tests if not).
2. Make the smallest possible change toward the goal.
3. Run tests. Confirm green.
4. Repeat until the refactor is complete.
5. Summarize what moved/renamed vs. what actually changed in behavior (should be "nothing").

## Output
When done, explicitly state: "No behavior change" or list any behavior changes that were unavoidable and why.
