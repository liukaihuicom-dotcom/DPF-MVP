# Scenario Coverage Report

| Scenario Group | Covered | Notes |
|---|---:|---|
| Permission | yes | Guest, trader, partner, admin roles mapped. |
| KYC | yes | Required for withdrawal and transfer; deposit restriction rule documented. |
| Deposit channels | yes | Bank Transfer, VA, E-wallet abstractions covered. |
| Withdrawal | yes | Balance, payout ownership, review, provider failure covered. |
| Internal transfer | yes | Same-owner active account rule covered. |
| FX and fee | yes | Fields and error codes covered; values TBD. |
| Audit | yes | State transition and review audit required. |
| Provider callback | no | Out of scope; blocker before production. |
| Ledger implementation | no | Out of scope; blocker before production. |
| Security Center alerts | yes | Priority, snooze, resolve, and 24-hour reappearance rules mapped. |
| TOTP and recovery codes | yes | Bind, verify, lockout, recovery-code visibility, and disable pending rules mapped. |
| GSL security changes | yes | Pending, cancel, effective, failed, duplicate prevention, and audit mapped. |
| Device and login history | yes | Current device protection, revoke others, high-risk device labels, and 90-day history mapped. |
| Remote login detection | yes | City, distance, country, high-risk IP/ASN, user confirmation, and block paths mapped. |
| DMP security policy | partial | Mandatory vs non-mandatory boundaries mapped; admin approval workflow remains review-required. |
| Security notification delivery | partial | Channels and event matrix mapped in PRD; retry/compensation service remains blocker before production. |
| Security Center runtime route | no | `/settings/security-center` is contract-first and must be implemented in the next App stage. |
