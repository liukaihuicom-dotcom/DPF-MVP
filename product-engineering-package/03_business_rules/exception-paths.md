# Exception Paths

| Exception | Applies To | Required State | User / Admin Behavior |
|---|---|---|---|
| Amount mismatch | Deposit | `reviewing` | Hold credit; show pending review; admin compares provider amount and requested amount. |
| Name mismatch | Deposit, Withdrawal | `reviewing` or `rejected` | Require ownership check; reject if third-party funding is detected. |
| FX quote expired | Deposit, Withdrawal | `expired` or `failed` | Require refreshed quote before retry. |
| Limit exceeded | All | `rejected` or `reviewing` | Block or route to manual review based on configured rule. |
| KYC missing | Withdrawal, Transfer | `rejected` | Show KYC required next step. |
| Payout ownership unverified | Withdrawal | `rejected` | Require bank/e-wallet ownership verification. |
| Provider maintenance | Deposit, Withdrawal | `disabled` before submit | Disable method and show alternate available methods. |
| Ledger failure | All | `failed` | Prevent duplicate mutation; require reconciliation. |
| AML hit | All | `reviewing` | Risk Compliance decision required. |
| Account frozen by admin | Security Center | `restricted` / alert `active` | Block security mutations and show support contact; audit every attempted action. |
| Existing GSL pending change | Security Center GSL | `pending` | Reject same-type new change with `SECURITY_GSL_PENDING_EXISTS`; user must cancel or wait for effective/final state. |
| TOTP invalid 5 times | Security Center TOTP | `locked` | Lock TOTP verification for 15 minutes; allow retry after lock window or recovery/support path. |
| Lost authenticator with recovery code | Security Center TOTP | `reviewing` | Accept single-use recovery code, audit IP/device/risk, and guide user to rebind TOTP. |
| Recovery codes exhausted | Security Center TOTP | `reviewing` | Route to manual identity review; do not expose secret or bypass high-risk verification. |
| Current device revoke attempted | Security Center Devices | `blocked` | Reject with `SECURITY_CANNOT_REVOKE_CURRENT_DEVICE`; offer normal sign-out path instead. |
| High-risk remote login | Security Center Remote Login | `blocked` or `restricted` | Require TOTP for high risk; block critical risk and send security alert/notification. |
| DMP attempts to disable mandatory scenario | Security Center DMP | `failed` | Reject policy change, require admin audit reason, and preserve mandatory verification. |
| Security Center attempts to force local PIN setup | Security Center App | `blocked` | Reject requirement; local PIN remains optional unless explicit local lock is active. |
