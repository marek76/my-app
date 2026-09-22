---
name: api-contract-consistency
description: Use when creating or modifying an API endpoint, request/response shape, or error format. Keeps new endpoints consistent with the existing contract instead of introducing one-off shapes.
---

# API Contract Consistency

## Process
1. Before adding an endpoint, look at 2–3 existing endpoints of the same kind (same resource type, same HTTP method) and match their shape.
2. If the project has a spec (OpenAPI/Swagger, GraphQL schema, protobuf), **update the spec first**, then generate or hand-write the implementation to match it — don't let code and spec drift.
3. Reuse existing shared types/schemas for request/response bodies rather than redefining inline shapes.

## Conventions to enforce
Fill in for this project:
- **Success response shape:** e.g. `{ data: T }` vs bare object
- **Error response shape:** e.g. `{ error: { code, message, details? } }` — must be identical across all endpoints
- **Status codes:** which codes mean what in this API (e.g. 422 vs 400 for validation)
- **Pagination pattern:** cursor vs offset, field names
- **Versioning:** how breaking changes are introduced (new version path, header, etc.)
- **Auth:** how endpoints declare required auth/permissions

## Checklist
- [ ] Spec updated if one exists
- [ ] Error responses match the standard shape
- [ ] Reused existing types instead of duplicating them
- [ ] Breaking changes flagged explicitly and versioned appropriately
