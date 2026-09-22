# Multi-Agent Workflow Configuration (`AGENTS.md`)

This document defines the architecture, roles, and rules for autonomous AI agents in this project.

---

## Feature Development Workflow

When developing a new feature, agents proceed in this sequential order:

1. **Agent 0 (Prep & Branch):** Tests the baseline code and creates a new feature branch.
2. **Agent 4 (Developer):** Writes the new functionality and its corresponding tests.
3. **Agent 1 (Tester):** Tests the whole application (linter, types, tests).
4. **Agent 2 (Fixer):** If errors appear, fixes them and hands the code back to Agent 1.
5. **Agent 3 (Git & PR):** Once everything passes, creates a commit, pushes the branch, and prepares a PR.

---

## Agent Definitions

Each agent below is implemented as a Cursor Agent Skill in `.cursor/skills/`. This file is the always-loaded index; the individual `SKILL.md` files contain the full instructions and are loaded on demand.

### 0. Agent 0: Prep & Branch (`@Agent-0-Prep`)
- **Role:** Prepare the environment before starting work on a new feature.
- See `.cursor/skills/agent-0-prep-branch/SKILL.md`.

### 4. Agent 4: Developer (`@Agent-4-Developer`)
- **Role:** Design and implement new functionality, including automated tests.
- See `.cursor/skills/agent-4-developer/SKILL.md`.

### 1. Agent 1: Tester (`@Agent-1-Tester`)
- **Role:** Static analysis, linter checks, and running the automated test suite.
- See `.cursor/skills/agent-1-tester/SKILL.md`.

### 2. Agent 2: Fixer (`@Agent-2-Fixer`)
- **Role:** Diagnose and fix failing tests or type errors after implementation.
- See `.cursor/skills/agent-2-fixer/SKILL.md`.

### 3. Agent 3: Git & PR (`@Agent-3-GitPR`)
- **Role:** Versioning, pushing, and creating the Pull Request.
- See `.cursor/skills/agent-3-git-pr/SKILL.md`.

---

## Baseline Rules for All Agents
- Never run destructive commands without user confirmation (e.g. `git reset --hard`, `rm -rf`).
- Keep change output clean and readable.
- Always use a formatted message structure that clearly states which agent is currently working.
