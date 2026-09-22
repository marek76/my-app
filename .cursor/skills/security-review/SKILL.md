---
name: security-review
description: Use before finishing any task that touches user input, authentication, authorization, credentials, file uploads, or third-party dependencies. Runs a focused security pass rather than skipping straight to "done".
---

# Security Review Pass

Run this before marking a task complete if it touches any of the trigger areas above.

## Checklist
- [ ] **Input validation:** all user-supplied input is validated/sanitized server-side, not just client-side
- [ ] **Injection:** no string-concatenated SQL/shell/HTML from user input; parameterized queries / proper escaping used
- [ ] **Auth checks:** every new endpoint or action checks authentication and authorization, not just that a user is logged in but that they're allowed to do *this*
- [ ] **Secrets:** no hardcoded credentials, API keys, or tokens; secrets loaded from env/secret manager
- [ ] **Dependencies:** any new third-party package is from a reputable source, actively maintained, and not obviously redundant with something already in the project
- [ ] **File handling:** uploads validate type/size and don't allow path traversal
- [ ] **Error messages:** don't leak stack traces, internal paths, or sensitive data to end users
- [ ] **Least privilege:** new code/service accounts request only the permissions they need

## Rules
- Flag anything you're unsure about rather than assuming it's fine — this skill is a checklist, not a substitute for a real security review on sensitive changes.
- If a fix requires a broader architectural change than the current task scope, say so and describe the risk rather than silently leaving it.
