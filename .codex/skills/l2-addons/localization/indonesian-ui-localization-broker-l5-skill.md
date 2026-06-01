---
name: indonesian-ui-localization-broker-l5
description: Use when auditing, fixing, or generating Bahasa Indonesia UI copy for broker, trading, wallet, KYC, deposit, withdrawal, Partner, IB, CRM, Admin, App, Web, or Mini Program experiences. Applies Indonesian financial product localization, Sentence case, terminology consistency, i18n governance, risk-copy controls, and L5 acceptance standards.
layer: L2
category: "Localization Add-on"
parent: "Financial UX Copy & Localization Governance Skill v1.0.0-L5"
depends_on:
  - "Indonesian UI Localization Broker L5 Reference"
  - "financial terminology"
  - "i18n copy context"
standalone: false
hierarchy: "L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on > Indonesian UI Localization Broker L5 Skill"
---

# Indonesian UI Localization Broker L5

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L2 |
| Category | Localization Add-on |
| Parent | Financial UX Copy & Localization Governance Skill v1.0.0-L5 |
| Standalone | No |
| Hierarchy | L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on > Indonesian UI Localization Broker L5 Skill |

Depends on:

- Indonesian UI Localization Broker L5 Reference
- financial terminology
- i18n copy context

Use this skill when the task involves Indonesian UI localization for financial, broker, trading, wallet, KYC, deposit, withdrawal, Partner, IB, CRM, Admin, App, Web, or Mini Program copy.

## Source of truth

Before auditing or changing copy, read:

- `.codex/skills/l3-supporting-references/localization/indonesian-ui-localization-broker-l5-skill-zh-v2.0.0.md`

That reference is the only authoritative standard for this skill. Do not replace it with generic Indonesian translation rules or unrelated localization guidance.

## Required workflow

1. Classify the localization scope: pages, components, i18n files, mock data, API-facing UI messages, and runtime formatting.
2. Read the source-of-truth reference.
3. Scan for user-facing Indonesian copy, English fallback shown to Indonesian users, mixed-language strings, hardcoded UI text, and terminology drift.
4. Fix copy according to the reference:
   - Bahasa Indonesia for Indonesian users.
   - Sentence case, not English-style Title Case.
   - Formal financial tone using `Anda`.
   - Consistent broker, trading, wallet, KYC, deposit, withdrawal, Partner, and IB terminology.
   - No exaggerated profit claims or weakened risk disclosure.
   - User-facing copy must be governed through i18n keys when the project structure supports it.
5. Validate with the project's i18n, typecheck, lint, and relevant QA commands when available.
6. Report changed files, terminology decisions, QA results, remaining risks, and whether native Indonesian or compliance review is still required.

## Output expectations

For audit-and-fix tasks, produce:

- Indonesian Localization Audit Report
- Updated UI copy and i18n entries
- Terminology Mapping
- Risk Copy Review
- CTA Safety Review
- i18n Governance Notes
- QA Gate result
- Release Decision
