# Page Contract Index

| Page Group | Contract | Purpose | Next Stage |
|---|---|---|---|
| App Route Coverage | `pages/app-route-coverage.page-contract.json` | Minimum route-level coverage for all 42 current Expo Router product routes from `src/navigation/routeRegistry.ts`. | Promote high-risk route entries into page-specific contracts as production APIs and compliance rules land. |
| App/H5 Funding | `pages/app-funding.page-contract.json` | Trader deposit, withdrawal, transfer, and funding history. | Requires Design System, Financial Copy, UI Build, UX Gate before implementation. |
| App Security Login Log | `pages/app-security-login-log.page-contract.json` | Customer-facing device, session, and local security-event review surface. | Requires production identity/session service, server audit, and re-auth policy before production. |
| Admin Funding | `pages/admin-funding.page-contract.json` | Manual review, channel config, limit/fee config, exception reconciliation. | Requires Admin permission design and risk/compliance approval. |

## Required States

Every page must support:

- default
- loading
- empty
- error
- disabled
- submitting
- success
- failed
- permission-denied
- restricted

## Implementation Note

The full runtime page list is traced from `src/navigation/routeRegistry.ts` into `pages/app-route-coverage.page-contract.json`.
Route ids are mirrored in `01_modules_and_navigation/route.map.json`.
