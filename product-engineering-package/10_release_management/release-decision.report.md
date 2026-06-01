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
- GlobalDialog, BottomSheet governance, and trading order sheet governance can enter implementation validation after TypeScript, component QA, style QA, public-resource QA, i18n QA, and browser smoke verification pass.
- BottomSheet dismissal/reserve governance can enter device QA after TypeScript, component QA, public-resource QA, and the focused overlay close-path checks pass.
- Agentic Workspace Trader six-tab navigation can enter product/UI QA after TypeScript, navigation, i18n, icon, version, public-resource, workspace-boundary, and browser smoke checks pass.

## Blocked

- Production release.
- Live payment provider integration.
- Live payout provider integration.
- Live funding UI marked production-ready.
- Any flow that treats demo balances as withdrawable funds.
- Security Center production UI release until `/settings/security-center` route, backend identity/session/TOTP/GSL/audit services, notification delivery, and risk policy are implemented and approved.
- Any implementation that treats TOTP/MFA as a reason to force local PIN setup by default.
- Any page-owned business `Modal`, bottom-sheet shell, or trading order option sheet body that bypasses `GlobalDialog`, the global `BottomSheet` preset system, or registered order business components.
- Production release of BottomSheet dismissal governance until iOS and Android close-path smoke checks confirm footer/content sync, measured footer reserve, and no residual backdrop after cleanup.
- Production release of Workspace remains blocked until backend identity, KYC, trading-account, funding, trading, and Partner entitlement services enforce destination permissions and high-risk action boundaries server-side.
- Any Workspace Assist behavior that recommends buy/sell direction, submits orders, moves funds, sends client messages, or promises returns is blocked.

## Required Human Review

- Indonesia compliance and legal review.
- AML threshold and manual review policy.
- Provider contract and SLA review.
- Finance/accounting ledger and reconciliation review.
- Native-language and compliance copy review before UI release.
- Native-language and compliance copy review for Workspace Assist, funding, trading, Partner commission, and risk-boundary copy before production release.
- Security/risk owner review for TOTP storage, recovery-code hashing, GSL scheduler, remote login thresholds, mandatory DMP lock rules, withdrawal verification, and audit export policy.

## Validation Gate

- Standard command: `corepack enable && pnpm qa:all`
- Direct fallback: `node scripts/qa/qa-all.js`
- TypeScript gate: `pnpm exec tsc --noEmit` or `./node_modules/.bin/tsc --noEmit`
- Validation ownership map: `product-engineering-package/11_validation_scripts/README.md`
