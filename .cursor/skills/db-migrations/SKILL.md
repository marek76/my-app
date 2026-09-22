---
name: db-migrations
description: Use whenever a task requires changing the database schema, adding/removing columns or tables, or altering data. Enforces migration-first changes and blocks destructive operations without explicit confirmation.
---

# Database Migrations

## Rules
1. **Never edit the schema directly.** All schema changes go through a migration file using the project's migration tool.
2. **Migration-first:** write and run the migration before writing application code that depends on the new schema.
3. **Naming:** follow the project's migration naming convention (fill in, e.g. `YYYYMMDDHHMMSS_verb_noun.sql` or ORM-generated names — don't hand-roll timestamps that could collide).
4. **Destructive operations** (dropping a column/table, renaming with data loss, `NOT NULL` on existing data without a default) require explicit user confirmation before running. Propose the migration and stop; don't execute it automatically.
5. **Backward compatibility:** prefer additive, multi-step migrations (add new column → backfill → switch reads → drop old column) over one-shot breaking changes when the schema is used by running services.
6. **Always include a rollback path** (a down migration or documented reversal steps) unless the tool doesn't support it.

## Project specifics
Fill in:
- **Migration tool/command:** e.g. `prisma migrate dev`, `alembic revision --autogenerate`, `rails db:migrate`
- **Where migrations live:** e.g. `db/migrations/`
- **How to test a migration:** e.g. run against a local/staging DB copy first, never against prod

## Checklist before applying
- [ ] Migration is additive or has a safe multi-step plan
- [ ] Rollback exists or is documented
- [ ] Confirmed with the user if destructive
- [ ] Tested locally before suggesting it be run anywhere else
