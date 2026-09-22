---
name: codebase-conventions
description: Use whenever writing or editing code in this repo, so the agent follows the project's naming, structure, and style conventions instead of inventing its own. Trigger on any file creation, refactor, or new module/component.
---

# Codebase Conventions

Apply these conventions automatically to every code change in this repo. Do not ask permission to follow them — just follow them.

## 1. Fill in your project's actual conventions here
Replace the placeholders below with what's true for this codebase. A skill with placeholders left in is worse than no skill — the agent will follow them literally.

- **File/folder structure:** e.g. `src/features/<feature>/{components,hooks,api}`
- **Naming:** e.g. components `PascalCase`, hooks `useCamelCase`, files match default export name
- **Exports:** e.g. named exports only, no default exports except pages/entry points
- **Import order:** e.g. external packages → internal aliases → relative imports, blank line between groups
- **State management:** where server state, client state, and form state each live
- **Error handling:** how errors are thrown/caught/surfaced (e.g. typed error classes, no bare `throw string`)
- **Styling:** e.g. Tailwind only, no inline styles, design tokens from `theme.ts`

## 2. Process
1. Before creating a new file, check for an existing file of the same kind and mirror its structure.
2. Before adding a new pattern (e.g. a new state library, a new folder shape), search the repo to confirm one doesn't already exist.
3. If a change requires deviating from a listed convention, say so explicitly and explain why, rather than deviating silently.

## 3. Checklist before finishing
- [ ] New files follow the naming and folder rules above
- [ ] No duplicate patterns introduced for something the repo already solves
- [ ] Imports ordered per convention
- [ ] Lint/format command run and passing
