# Traceability Matrix

| Goal / Rule | Page Contract | API Contract | Error Codes | Test Cases |
|---|---|---|---|---|
| Workspace segment routing (`BR-WORKSPACE-001`) | `app-workspace.page-contract.json` | Future identity/KYC/account/partner entitlement services | `WORKSPACE_SEGMENT_UNRESOLVED` | `TC-WORKSPACE-001`, `TC-WORKSPACE-002`, `TC-WORKSPACE-003`, `TC-WORKSPACE-004` |
| Trader-mode tab safety (`BR-WORKSPACE-002`) | Workspace + bottom tab contract | Future navigation and trading/funding entitlement services | `WORKSPACE_TAB_NOT_ALLOWED` | `TC-WORKSPACE-005` |
| Approved Partner Mode only (`BR-WORKSPACE-003`) | Workspace + Partner tab contract | Future partner entitlement service | `PARTNER_PERMISSION_DENIED` | `TC-WORKSPACE-006` |
| Workspace Assist weak-entry boundary (`BR-WORKSPACE-004`) | Workspace Assist copy/interaction contract | Support/education routes only | `WORKSPACE_ASSIST_ACTION_BLOCKED` | `TC-WORKSPACE-007` |
| Workspace public-resource governance (`BR-WORKSPACE-005`) | Workspace page contract + public resource graph | N/A | N/A | `TC-WORKSPACE-008`, `TC-WORKSPACE-009` |
| Guest cannot access funding (`BR-FUND-001`) | App funding pages | All `/funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-001` |
| Trader own-account scope (`BR-FUND-002`) | Deposit, withdrawal, transfer forms | `POST /funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-002` |
| Partner cannot initiate funding (`BR-FUND-003`) | App funding pages | `POST /funding/*` | `FUNDING_PERMISSION_DENIED` | `TC-PERM-003` |
| KYC required for withdrawal/transfer (`BR-FUND-004`) | Withdrawal, transfer forms | `POST /funding/withdrawals`, `POST /funding/transfers` | `FUNDING_KYC_REQUIRED` | `TC-KYC-001`, `TC-KYC-002` |
| Deposit can be submitted before KYC with restrictions (`BR-FUND-005`) | Deposit form/detail | `POST /funding/deposits` | Review/status codes | `TC-KYC-003` |
| Active account required (`BR-FUND-006`) | All funding forms | `GET /trading-accounts`, `POST /funding/*` | `FUNDING_ACCOUNT_NOT_ACTIVE` | `TC-ACCOUNT-001` |
| Same-owner transfer (`BR-FUND-007`) | Transfer form/detail | `POST /funding/transfers` | `TRANSFER_OWNER_MISMATCH`, `TRANSFER_SAME_ACCOUNT_NOT_ALLOWED` | `TC-TRANSFER-001`, `TC-TRANSFER-003` |
| Method availability (`BR-FUND-008`) | Deposit/withdrawal forms | `GET /funding/payment-methods` | `FUNDING_METHOD_UNAVAILABLE` | `TC-DEPOSIT-002`, `TC-WITHDRAW-001` |
| Limits and fees (`BR-FUND-009`) | All forms | `GET /funding/rules` | `FUNDING_LIMIT_EXCEEDED`, `FEE_RULE_MISSING` | `TC-LIMIT-001`, `TC-FEE-001` |
| FX quote required (`BR-FUND-010`) | Deposit/withdrawal forms/details | `GET /funding/rules`, mutation APIs | `FX_QUOTE_EXPIRED`, `FX_RATE_UNAVAILABLE` | `TC-FX-001`, `TC-FX-002` |
| Manual review (`BR-FUND-011`) | Admin review pages | Admin review APIs | Review-required operation codes | `TC-REVIEW-001` |
| Audit required (`BR-FUND-012`) | Admin review/detail | All mutation APIs | N/A | `TC-AUDIT-001` |
| Mutation metadata (`BR-FUND-013`) | All submit pages | All mutation APIs | Validation error | `TC-API-001` |
| Demo funds not withdrawable (`BR-FUND-014`) | Existing account assets and future funding entry | `GET /trading-accounts` | `FUNDING_ACCOUNT_NOT_ACTIVE` | `TC-REG-001` |
| Security alert priority (`BR-SEC-001`) | App Security Center | `GET /api/security-center/alerts`, `POST /api/security-center/alerts/*` | N/A | `TC-SEC-ALERT-001`, `TC-SEC-ALERT-002` |
| Mandatory high-risk MFA (`BR-SEC-002`) | App Security Center, verification modal | TOTP/GSL/device/security APIs | `SECURITY_TOTP_REQUIRED`, `SECURITY_RISK_BLOCKED` | `TC-SEC-MFA-001`, `TC-SEC-DMP-001` |
| TOTP binding and recovery (`BR-SEC-003`) | TOTP binding flow | `POST /api/security-center/totp/bind/*` | `SECURITY_OTP_INVALID` | `TC-SEC-TOTP-001`, `TC-SEC-TOTP-002` |
| TOTP lockout (`BR-SEC-004`) | Verification modal | TOTP APIs | `SECURITY_OTP_LOCKED` | `TC-SEC-TOTP-003` |
| GSL cooling and cancel (`BR-SEC-005`) | GSL list, GSL cancel sheet | `GET/POST /api/security-center/gsl/changes/*` | `SECURITY_GSL_PENDING_EXISTS` | `TC-SEC-GSL-001`, `TC-SEC-GSL-002` |
| Same-type GSL duplicate prevention (`BR-SEC-006`) | Security setting actions | GSL and account security APIs | `SECURITY_GSL_PENDING_EXISTS` | `TC-SEC-GSL-003` |
| Device revoke rules (`BR-SEC-007`) | Device and login section, Security Login Log compatibility page | Device APIs | `SECURITY_CANNOT_REVOKE_CURRENT_DEVICE`, `SECURITY_DEVICE_NOT_FOUND` | `TC-SEC-DEVICE-001`, `TC-SEC-DEVICE-002` |
| Remote login risk (`BR-SEC-008`) | Alert banner, login history, device details | Login history/risk APIs | `SECURITY_RISK_BLOCKED` | `TC-SEC-RISK-001`, `TC-SEC-RISK-002`, `TC-SEC-RISK-003` |
| Local PIN boundary (`BR-SEC-009`) | App Security Center, Auth PIN flow | No Security Center API should force PIN | N/A | `TC-SEC-PIN-001` |
| Security audit required (`BR-SEC-010`) | All sensitive Security Center actions | All Security Center mutation APIs | N/A | `TC-SEC-AUDIT-001` |
