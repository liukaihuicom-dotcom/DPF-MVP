# Acceptance Criteria

- Funding contract includes kernel, module, RBAC, business rules, state machine, page contracts, API draft, error codes, QA gates, traceability, and test mapping.
- Workspace contract includes `WorkspaceSegment`, role/KYC/account/partner entitlement rules, dynamic bottom tab combinations, Assist safety boundary, public-resource dependency graph coverage, i18n copy governance, and route registry coverage.
- All non-Partner Trader states show `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`.
- Trader destination pages and production backend entitlement still enforce KYC, account, trading, funding, account-scope, and high-risk action permissions.
- Active Trader shows account, margin/PnL, risk, funding record path, low-noise markets, and at most three compact actions through governed Workspace components.
- Approved Partner Mode requires `role === partner` and approved Partner entitlement, shows `Workspace / Clients / Growth / Wallet / Me`, and includes a switch back to Trader Mode.
- Workspace Assist remains a weak support/education entry and must not recommend buy/sell direction, submit trades, move funds, send client messages, or promise returns.
- All requested mutation APIs require idempotency and audit metadata.
- Deposit, withdrawal, and transfer each have success and failure state coverage.
- Withdrawal and transfer require approved KYC.
- Internal transfer is same-owner only.
- Configurable limits, fees, FX source, and channel maintenance are represented without inventing unapproved values.
- Production release remains blocked until provider, ledger, KYC, compliance copy, UI, UX, and QA gates are complete.
- Security Center contract includes module, RBAC, business rules, state machines, page contract, API draft, schema, error codes, audit requirements, QA gates, traceability, and test mapping.
- Security Center canonical route `/settings/security-center` remains contract-first until the next App implementation stage adds runtime route files and public-resource graph page coverage.
- TOTP, GSL, remote login, device revoke, anti-phishing code, DMP mandatory locks, and audit operations are represented without inventing backend thresholds or bypass rules.
- Security Center TOTP/MFA does not force local PIN setup by default; local PIN remains optional unless explicit local lock/unlock state is active.
- Security Center production release remains blocked until backend identity/session, TOTP secret custody, recovery-code hashing, GSL scheduler, notification delivery, risk policy, copy review, UX Gate, and route implementation are complete.
