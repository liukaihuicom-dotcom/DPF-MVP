# Test Case Mapping

| Test ID | Scenario | Expected Result | Severity |
|---|---|---|---|
| `TC-WORKSPACE-001` | Guest, KYC not started, or KYC reviewing opens `/workspace`. | Segment resolves to `new_trader`; visible bottom tabs are `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`; high-risk actions remain guarded by destination pages and production backend entitlement. | Blocker |
| `TC-WORKSPACE-002` | KYC approved user has no active live trading account and no trading activity. | Segment resolves to `kyc_approved_no_deposit`; visible bottom tabs are `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`; Workspace keeps account readiness and funding-risk status explicit in GUI. | Blocker |
| `TC-WORKSPACE-003` | User has an active live account, open positions, sample trading activity, or explicit trading usage override. | Segment resolves to `active_trader`; visible bottom tabs are `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`; Workspace shows account, margin/PnL, risk, funding record path, low-noise markets, and at most three compact actions. | Critical |
| `TC-WORKSPACE-004` | User role is `partner` and partner upgrade request is approved. | Segment resolves to `partner_mode`; visible bottom tabs are `Workspace / Clients / Growth / Wallet / Me`; Partner Workspace shows client funnel, commission, conversion focus, and Trader-mode switch entry. | Critical |
| `TC-WORKSPACE-005` | Any non-Partner Trader segment opens Workspace and checks bottom navigation or attempts a high-risk deep route. | Trader bottom tabs show `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`; full Partner tabs remain hidden unless Partner entitlement is approved. Any high-risk deep-route access remains subject to destination guards and production backend entitlement checks. | Blocker |
| `TC-WORKSPACE-006` | Potential Partner or pending/rejected Partner user opens Workspace. | User remains in Trader Workspace; full Partner Mode tabs are not shown. | Blocker |
| `TC-WORKSPACE-007` | User taps Ask / Assist from any Workspace segment. | User is routed to support/education GUI only; no trade, funding, transfer, buy/sell recommendation, profit promise, or client-message action is executed. | Blocker |
| `TC-WORKSPACE-008` | Workspace route and auxiliary tabs are checked against route registry and public-resource graph. | All 50 route-registry entries have dependency graph pages and readiness rows; Workspace uses registered public resources. | Major |
| `TC-WORKSPACE-009` | Workspace copy and icons are checked by QA. | All visible Workspace strings are i18n keyed across `zh-CN`, `en-US`, and `id-ID`; icons use existing semantic registry keys with no new runtime icon dependency. | Major |
| `TC-PERM-001` | Guest opens funding page or calls funding API. | Redirect/reject with `FUNDING_PERMISSION_DENIED`. | Blocker |
| `TC-PERM-002` | Trader tries to fund another user's account. | Reject with permission error. | Critical |
| `TC-PERM-003` | Partner attempts client withdrawal or transfer. | Reject; partner can view only authorized summary. | Critical |
| `TC-KYC-001` | Non-KYC trader submits withdrawal. | Reject with `FUNDING_KYC_REQUIRED`. | Critical |
| `TC-KYC-002` | Non-KYC trader submits internal transfer. | Reject with `FUNDING_KYC_REQUIRED`. | Critical |
| `TC-KYC-003` | Non-KYC trader submits deposit. | Allow submission, mark resulting funds restricted by risk policy. | Major |
| `TC-ACCOUNT-001` | User tries funding mutation on demo/readOnly/disabled/archived account. | Reject with `FUNDING_ACCOUNT_NOT_ACTIVE`. | Blocker |
| `TC-DEPOSIT-001` | Deposit through bank transfer, VA, and e-wallet happy paths. | State reaches `completed`; audit log and ledger entry exist. | Critical |
| `TC-DEPOSIT-002` | Deposit method in maintenance. | Method disabled; mutation blocked with `FUNDING_METHOD_UNAVAILABLE`. | Major |
| `TC-DEPOSIT-003` | Deposit payment expires. | State becomes `expired`; retry requires new request/quote. | Major |
| `TC-DEPOSIT-004` | Provider amount mismatch. | State becomes `reviewing`; admin decision required. | Critical |
| `TC-DEPOSIT-005` | Provider name mismatch. | State becomes `reviewing` or `rejected` based on risk rule. | Critical |
| `TC-WITHDRAW-001` | Withdrawal payout method unavailable. | Block with `FUNDING_METHOD_UNAVAILABLE`. | Major |
| `TC-WITHDRAW-002` | Withdrawal balance insufficient. | Reject with `WITHDRAWAL_INSUFFICIENT_BALANCE`. | Critical |
| `TC-WITHDRAW-003` | Withdrawal bank account unverified. | Reject with `WITHDRAWAL_BANK_ACCOUNT_UNVERIFIED`. | Critical |
| `TC-WITHDRAW-004` | Withdrawal enters manual review and is approved. | State progresses to `processing`, `paid`, `completed`; audit includes reviewer reason. | Critical |
| `TC-TRANSFER-001` | Same-owner active account transfer succeeds. | State reaches `completed`; source debit and target credit recorded. | Critical |
| `TC-TRANSFER-002` | Source and target are the same account. | Reject with `TRANSFER_SAME_ACCOUNT_NOT_ALLOWED`. | Critical |
| `TC-TRANSFER-003` | Cross-owner transfer attempted. | Reject with `TRANSFER_OWNER_MISMATCH`. | Critical |
| `TC-TRANSFER-004` | Target account restricted. | Reject with `TRANSFER_TARGET_RESTRICTED`. | Critical |
| `TC-LIMIT-001` | Amount exceeds configured limit. | Reject or review based on config; never auto-complete silently. | Critical |
| `TC-FEE-001` | Fee rule missing. | Block submit with `FEE_RULE_MISSING`. | Critical |
| `TC-FX-001` | FX quote expired before submit. | Block submit with `FX_QUOTE_EXPIRED`. | Critical |
| `TC-FX-002` | FX source unavailable. | Block submit with `FX_RATE_UNAVAILABLE`. | Critical |
| `TC-REVIEW-001` | AML or velocity flag hit. | State becomes `reviewing`; Risk Compliance decision required. | Critical |
| `TC-AUDIT-001` | Any transition occurs. | Audit log contains actor, reason, previousStatus, nextStatus, timestamp, requestId. | Blocker |
| `TC-API-001` | Mutation request omits idempotency or audit metadata. | Reject request. | Blocker |
| `TC-REG-001` | Existing demo account balance is shown near funding entry. | Demo remains labeled non-withdrawable; live funding mutation disabled. | Blocker |
| `TC-SEC-ALERT-001` | User has multiple active security alerts. | Security Center displays only the highest-priority alert. | Critical |
| `TC-SEC-ALERT-002` | User snoozes an unresolved alert. | Alert is hidden until snoozeUntil and can reappear after 24 hours if unresolved. | Critical |
| `TC-SEC-MFA-001` | User attempts withdrawal or adds withdrawal address without TOTP. | Operation requires TOTP binding or manual review; email-only is not accepted as long-term high-risk policy. | Blocker |
| `TC-SEC-DMP-001` | DMP admin attempts to disable verification for withdrawal, TOTP disable, or email/phone change. | Policy update is rejected and audited. | Blocker |
| `TC-SEC-TOTP-001` | User enters correct TOTP during binding. | TOTP status becomes `active`. | Critical |
| `TC-SEC-TOTP-002` | TOTP binding succeeds and recovery codes are generated. | User must confirm recovery-code save before flow completes; codes are shown once. | Critical |
| `TC-SEC-TOTP-003` | User submits five invalid TOTP codes. | TOTP verification enters `locked` for 15 minutes. | Critical |
| `TC-SEC-GSL-001` | User requests TOTP disable after verification. | GSL change is created with status `pending`; TOTP remains active. | Blocker |
| `TC-SEC-GSL-002` | User cancels a pending GSL change after verification. | GSL status becomes `cancelled` and original setting remains active. | Critical |
| `TC-SEC-GSL-003` | User submits same change type while one is pending. | Request is rejected with `SECURITY_GSL_PENDING_EXISTS`. | Critical |
| `TC-SEC-DEVICE-001` | User attempts to revoke current device. | Request is rejected with `SECURITY_CANNOT_REVOKE_CURRENT_DEVICE`. | Critical |
| `TC-SEC-DEVICE-002` | User revokes all other devices after verification. | All non-current sessions are destroyed; current device remains active. | Critical |
| `TC-SEC-RISK-001` | Login city is more than 500 km from common cities. | Login is marked remote and receives medium or higher risk according to signals. | Critical |
| `TC-SEC-RISK-002` | Remote login also uses new device or proxy IP. | TOTP is required and trusted-device waiver is not allowed. | Critical |
| `TC-SEC-RISK-003` | Remote login includes high-risk IP or repeated failures. | Login is blocked and security alert is created. | Blocker |
| `TC-SEC-PIN-001` | Signed-in user opens Security Center with no explicit local lock. | User is not forced into local PIN setup or unlock. | Blocker |
| `TC-SEC-AUDIT-001` | Any sensitive security action occurs. | Audit log contains actor, target, IP, deviceId, userAgent, location, riskLevel, result, and requestId. | Blocker |
