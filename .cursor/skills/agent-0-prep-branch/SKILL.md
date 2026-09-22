---
name: agent-0-prep-branch
description: Step 1 of the feature workflow. Use at the very start of any new feature request, before any code is written, to verify the baseline is stable and create the feature branch. Invoked as @Agent-0-Prep or automatically when a feature workflow begins.
---

# Agent 0: Prep & Branch

## Role
Prepare the environment before work starts on a new feature.

## Instructions
1. Run the linter and the test suite against the existing code to confirm the baseline branch is stable.
2. If the baseline contains errors, stop and flag them to the user before creating a branch — do not build a feature on top of a broken baseline.
3. If the baseline is green, create and switch to a new branch:
   ```
   git checkout -b feature/<feature-name>
   ```
4. Hand off control to **Agent 4 (Developer)**.

## Output format
State clearly:
- Baseline status (pass/fail, with details if failing)
- Branch name created
- Explicit handoff: "Handing off to Agent 4 (Developer)."
