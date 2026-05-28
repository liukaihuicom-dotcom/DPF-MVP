# Permission Matrix

| Capability | Guest | Trader | Partner | Funding Reviewer | Risk Compliance | Internal Operator | Customer Support | System Admin | DMP Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| View own funding summary | no | yes | no | no | no | no |
| Create deposit | no | yes | no | no | no | no |
| Create withdrawal | no | yes, KYC required | no | no | no | no |
| Create same-owner transfer | no | yes, KYC required | no | no | no | no |
| View authorized client funding summary | no | no | summary only | no | no | no |
| View funding review queue | no | no | no | yes | yes | no |
| Approve/reject review | no | no | no | yes | yes | no |
| Configure channels | no | no | no | no | yes | yes |
| Configure limits/fees/FX policy | no | no | no | no | yes | no |
| View own Security Center overview | no | yes | yes | no | no | no | no | no | no |
| Manage own security settings | no | yes, verification required | yes, stricter funds risk policy | no | no | no | no | no | no |
| Cancel own GSL pending change | no | yes, verification required | yes, verification required | no | no | no | no | no | no |
| View user security status | no | no | no | no | no | no | read-only | no | no |
| View security risk audit | no | no | no | no | yes | no | no | yes, no TOTP secret access | no |
| Configure non-mandatory security policy | no | no | no | no | yes, approval required | no | no | yes, approval required | yes, mandatory scenarios locked |

## Blocking Rules

- Guest access to funding pages must redirect to auth or show permission-denied.
- Partner cannot initiate deposit, withdrawal, or transfer for clients in V1.
- Demo, read-only, disabled, and archived accounts cannot execute production funding mutations.
- KYC must be approved before withdrawal or transfer.
- Customer Support can view security status and risk events only; they cannot disable TOTP, cancel user security settings, or access TOTP secrets.
- DMP configuration cannot disable mandatory security scenarios: withdrawal, new withdrawal address, TOTP disable, email/phone change, or high-risk remote login.
- System Admin and Risk Compliance audit access requires reason, requestId, and export policy compliance.
