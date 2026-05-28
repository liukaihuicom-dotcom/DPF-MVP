# Module Map

| Module | Purpose | Platforms | Primary Roles | Notes |
|---|---|---|---|---|
| Funding | Deposit, withdraw, transfer, review, ledger, and reconciliation contracts for trading accounts. | App, H5, Admin | Trader, Funding Reviewer, Risk Compliance | Product contract only. |
| Security Center | Account security overview, TOTP, GSL, devices, login history, anti-phishing code, alerts, and security policy contracts. | App, H5, Web, Admin, DMP | Trader, Partner, Customer Support, Risk Compliance, System Admin, DMP Admin | Contract-first package; canonical `/settings/security-center` route is planned for the next App implementation stage. |
| Account Assets | Existing account overview and transaction preview surface. | App, H5 | Trader, Partner | Must remain demo-labeled until live funding is connected. |
| Auth / KYC | Eligibility gate for withdrawal and transfer. | App, H5, Admin | Trader, Risk Compliance | KYC provider not defined in this package. |
| Admin Operations | Review and configuration operations for funding. | Admin | Funding Reviewer, Risk Compliance, Internal Operator | Needs permission service before build. |
