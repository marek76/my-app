---
name: destructive-action-guard
description: Always active. Forces the agent to stop and get explicit confirmation before running any irreversible or destructive command, rather than executing it automatically.
---

# Destructive Action Guard

## Trigger on any of these before executing
- `rm -rf`, `rm` on directories, or bulk file deletion
- `git push --force` / `git push -f`, rewriting shared history, deleting branches/tags
- Dropping or truncating database tables, deleting rows in bulk, running raw destructive SQL
- Deleting cloud resources (buckets, instances, DNS records, deployments)
- Revoking credentials, rotating keys, or changing access control in ways that could lock someone out
- Overwriting files without a backup when the change is not easily reversible via version control
- Any command run against a production environment

## Rule
**Stop before executing.** Show the user exactly what will run (the command or the scope of the change) and what it will affect, and wait for explicit confirmation. Do not proceed on an assumed "yes."

Exceptions: none by default. If a project wants to allow-list specific destructive commands (e.g. resetting a local dev DB), that exception should be added explicitly to this file, scoped as narrowly as possible (e.g. "only for the local/dev database, never staging or prod").

## Good practice
- Prefer reversible alternatives when they exist (e.g. soft delete instead of hard delete, `git revert` instead of force-push, disabling instead of deleting a resource).
- When a destructive action is necessary, suggest a backup/export step first if one is feasible.
