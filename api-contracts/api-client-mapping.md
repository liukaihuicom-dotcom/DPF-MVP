# API Client Mapping

## Current Runtime Sources

| Domain | Current Source | Future API |
|---|---|---|
| Instruments | `src/domain/mockData.ts` plus quote proxy | `GET /instruments`, quote stream |
| Account | `initialAccount`, recalculated in `src/domain/trading.ts` | `GET /accounts/current` |
| Orders | Local state in `BrokerStore` | `POST /orders`, order list endpoints |
| Positions | Local state from filled orders | Position endpoints and quote stream |
| Partner clients | `partnerClients` mock data | `GET /partner/clients` |
| Upgrade request | Local state with web localStorage persistence | Partner upgrade endpoints |
| Security Center | Contract-first mock in `api-contracts/mocks/security-center-overview.mock.json`; existing device/login demo in `src/domain/securityLoginLog.ts` | `GET /api/security-center/overview`, alert, TOTP, GSL, device, login-history, anti-phishing endpoints |

## Error Mapping

API errors must return stable `code` and `messageKey` fields. UI must resolve `messageKey` through `src/i18n/translations.ts`.

## Security Notes

Before live API integration, add authentication, idempotency, audit IDs, quote freshness, and server-side margin validation.

Security Center live integration additionally requires TOTP secret custody, recovery-code hashing, GSL scheduler, mandatory-scenario DMP lock rules, notification delivery, and server-side audit logs. TOTP/MFA must not re-enable mandatory local PIN setup; local PIN remains an explicit local lock/unlock feature.
