# Acceptance Criteria

- Funding contract includes kernel, module, RBAC, business rules, state machine, page contracts, API draft, error codes, QA gates, traceability, and test mapping.
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
