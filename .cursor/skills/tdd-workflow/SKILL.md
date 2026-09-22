---
name: tdd-workflow
description: Use when implementing new behavior, fixing a bug, or asked to "write tests" or "use TDD". Enforces a test-first loop so the agent proves behavior with a failing test before writing implementation code.
---

# Test-Driven Development Workflow

## Process
1. **Write a failing test first.** Express the desired behavior as a test using the project's test runner and conventions (see below). Do not write implementation code yet.
2. **Run the test and confirm it fails** for the expected reason (not a typo, import error, or syntax error).
3. **Write the minimum implementation** needed to make the test pass. Avoid adding untested behavior "while you're in there."
4. **Run the full test suite**, not just the new test, to catch regressions.
5. **Refactor** if needed, keeping tests green throughout.
6. Repeat for the next piece of behavior.

## Project specifics
- **Test runner / command:** Vitest (`jsdom`) via `pnpm test` (`vitest run`). Config lives in `vite.config.ts` (`include: src/**/*.test.{ts,tsx}`, setup `src/test/setup.ts` with jest-dom + RTL `cleanup`).
- **Test file location/naming:** Colocate next to the source: `Foo.ts` → `Foo.test.ts`, `Foo.tsx` → `Foo.test.tsx`. No separate `tests/` tree.
- **Mocking conventions:** Do not `vi.mock` modules. Use `vi.fn()` for component callbacks, `vi.useFakeTimers()` / `vi.setSystemTime` for dates (restore with `vi.useRealTimers()` in `afterEach`). Prefer real reducers, helpers, and `JobProvider`; seed `localStorage` (`job_app_items`) for list/integration tests. Query with Testing Library roles/labels and drive UI with `userEvent` (`fireEvent` only for `input[type=date]`).
- **Coverage expectations:** New reducer/helper logic needs unit tests. New UI (dialogs, list, controls) needs Testing Library tests for the user-visible behavior. No coverage threshold is configured — do not skip tests to go green.

## Rules
- Never mark a task complete with failing or skipped tests without flagging it explicitly.
- If a bug is being fixed, the first test written must reproduce the bug (i.e., fail against the old code).
- Don't delete or weaken an existing test to make it pass — fix the code or flag the test as wrong and ask.
