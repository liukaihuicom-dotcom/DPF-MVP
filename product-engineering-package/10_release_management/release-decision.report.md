# Release Decision Report

Decision: `conditional_allow_for_contract_review`

## Allowed Next Stage

- Product review.
- Backend/API architecture review.
- Risk and compliance review.
- Design System and UI Build planning.
- QA test-plan drafting.
- Production directory governance can enter next-stage review after `node scripts/qa/qa-all.js` and TypeScript checks pass.
- Security Center can enter product, backend/API, risk/compliance, Design System, Financial Copy, Icon Governance, and UX Gate review as a contract-first package.
- GlobalDialog and BottomSheet governance can enter implementation validation after TypeScript, component QA, style QA, public-resource QA, and full QA pass.

## Blocked

- Production release.
- Live payment provider integration.
- Live payout provider integration.
- Live funding UI marked production-ready.
- Any flow that treats demo balances as withdrawable funds.
- Security Center production UI release until `/settings/security-center` route, backend identity/session/TOTP/GSL/audit services, notification delivery, and risk policy are implemented and approved.
- Any implementation that treats TOTP/MFA as a reason to force local PIN setup by default.
- Any page-owned business `Modal` or bottom-sheet shell that bypasses `GlobalDialog` or the global `BottomSheet` preset system.

## Required Human Review

- Indonesia compliance and legal review.
- AML threshold and manual review policy.
- Provider contract and SLA review.
- Finance/accounting ledger and reconciliation review.
- Native-language and compliance copy review before UI release.
- Security/risk owner review for TOTP storage, recovery-code hashing, GSL scheduler, remote login thresholds, mandatory DMP lock rules, withdrawal verification, and audit export policy.

## Validation Gate

- Standard command: `corepack enable && pnpm qa:all`
- Direct fallback: `node scripts/qa/qa-all.js`
- TypeScript gate: `pnpm exec tsc --noEmit` or `./node_modules/.bin/tsc --noEmit`
- Validation ownership map: `product-engineering-package/11_validation_scripts/README.md`
