# Security, Compliance, and Risk

## Sensitive Data Rules

- Do not store card, bank, KYC, document, password, access token, or live trading credentials in localStorage or sessionStorage.
- Do not log order payloads that contain future real account identifiers.
- Do not add real payment, deposit, withdrawal, or KYC integrations without API contract, audit logging, and risk review.

## Financial Operation Rules

| Operation | Required Rule |
|---|---|
| Demo order | Validate lots, margin, instrument, and quote freshness |
| Future live order | Require risk warning, confirmation, audit log, and idempotency key |
| Deposit or withdrawal | Require KYC, ownership check, review state, and error code mapping |
| Partner upgrade | Require permission, status transition log, and rejection reason |
| Security Center high-risk action | Require TOTP or approved fallback, explicit consequence copy, audit log, and recoverable error path |
| TOTP disable / email-phone change / withdrawal address change | Require 24-hour GSL cooling period and cancellation path before effective change |
| DMP security policy | Mandatory security scenarios cannot be disabled; non-mandatory changes require audit reason and policy version record |

## Copy Rules

- Always label the current product as simulated where trading or account funds are discussed.
- Do not describe demo balances as withdrawable funds.
- Do not present educational content as investment advice.
- Do not weaken TOTP, GSL, withdrawal verification, remote login, or account freeze risk copy for visual simplicity.
- Do not describe local PIN as server-side account security. PIN remains a local optional lock/unlock feature unless explicit lock state is active.
