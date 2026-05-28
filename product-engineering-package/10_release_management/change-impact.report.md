# Change Impact Report

| Area | Impact |
|---|---|
| Global dialog governance | Adds `GlobalDialog` as the centered feedback/confirmation host and removes auth-owned business Modal shells. |
| BottomSheet governance | Page bottom sheets must continue through the global BottomSheet preset system; no product flow change. |
| QA | Static checks now block unregistered business `Modal` and page-local bottom sheet shells. |
| Existing Expo runtime | No code changes. |
| Account Assets product docs | Future funding entry points must comply with this contract. |
| Backend | New API, ledger, provider, KYC, audit, review, and config services required before production. |
| Frontend | Future App/H5/Admin UI must consume Page Contracts and Design System inputs. |
| Compliance | Indonesia funding rules, KYC, AML, fee, FX, and risk copy require approval. |
| QA | New blocker/critical funding test suite required. |
| Security Center product package | Adds contract-first module, page contract, API draft, schema, RBAC rules, business rules, state machines, exception paths, and test mappings for canonical `/settings/security-center`. |
| Existing `/settings/security-log` | No runtime code change; remains compatibility/detail surface until Security Center route is implemented. |
| Security / risk policy | TOTP, GSL, remote login, withdrawal verification, DMP mandatory-lock boundaries, and audit logging require security owner confirmation before production. |
| Local PIN behavior | No runtime change; Security Center TOTP/MFA contract explicitly preserves optional-default local PIN behavior. |
