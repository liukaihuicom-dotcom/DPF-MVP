---
layer: L3
category: "Supporting Rule Document"
parent: "Financial UX Copy & Localization Governance Skill v1.0.0-L5"
depends_on:
  - "English UI copy task"
standalone: false
hierarchy: "L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on > English UI Copy Capitalization Rules"
---

# English UI Copy Capitalization Rules

## Classification And Hierarchy

| Field | Value |
|---|---|
| Layer | L3 |
| Category | Supporting Rule Document |
| Parent | Financial UX Copy & Localization Governance Skill v1.0.0-L5 |
| Standalone | No |
| Hierarchy | L1 Core UI Build Production > UI Build Production Skill > Financial UX Copy & Localization Governance Add-on > English UI Copy Capitalization Rules |

Depends on:

- English UI copy task

> Scope: English UI copy for financial App, H5, Web, Admin, Broker Portal, Partner Portal, CopyTrading, trading account, funding, KYC, onboarding, table, toast, error, helper text, empty state, and i18n key copy.
> Parent add-on: Financial UX Copy & Localization Governance Skill.

This file is a rule dependency, not a standalone skill. When a task involves English UI copy, buttons, titles, form labels, tabs, table headers, toasts, errors, helper text, empty states, or i18n key copy, the Financial Copy & Localization Add-on must read and apply this file.

## Core Rule

| Surface | Capitalization | Examples |
|---|---|---|
| Page title, section title, card title, modal title, drawer title | Title Case | `Trading Account Overview`, `Confirm Withdrawal Request` |
| Button, CTA, menu label, navigation label, tab label | Title Case | `Continue with Email`, `Set Up Your PIN`, `Log In` |
| Form label, table header, metric label, status label, chip | Title Case | `Account Currency`, `Verification Status`, `In Review` |
| Description, body copy, helper text, error text, toast body | Sentence case | `Verify your identity before creating a live trading account.` |
| Placeholder, empty-state description, tooltip, banner description | Sentence case | `Enter your email address`, `You have not created any trading accounts yet.` |
| Toast or dialog title, empty-state title | Title Case | `Request Submitted`, `No Trading Accounts Yet` |

## Title Case

- Capitalize important words: nouns, verbs, adjectives, adverbs, pronouns, and product role names.
- Keep minor words lowercase in the middle of a title: `a`, `an`, `the`, `and`, `or`, `but`, `nor`, `to`, `for`, `from`, `with`, `by`, `of`, `in`, `on`, `at`, `as`, `per`, `via`.
- Capitalize minor words when they are the first or last word.
- Capitalize particles in phrasal verbs and action names: `Set Up Your PIN`, `Sign In`, `Log Out`, `Turn On Price Alerts`, `Top Up Wallet`.
- Do not use all caps except for approved abbreviations, currency codes, instrument codes, or deliberately governed eyebrow labels.

## Sentence Case

- Capitalize the first word and approved terms only.
- Use natural sentence punctuation for descriptions, helper text, errors, and toast bodies.
- Do not convert sentence-like copy into title case for visual emphasis.
- Do not remove risk or recovery detail for brevity.

## Protected Terms

The following terms must preserve official casing:

```text
KYC, AML, CDD, EDD, POA, PIN, OTP, CRM, IB, CPA, CPL,
MT4, MT5, Sub-IB, Master IB, CopyTrading,
USD, IDR, JPY, EUR, USC, BTC, ETH, USDT,
EUR/USD, XAU/USD, GBP/JPY,
FX, CFD, PnL, ROI, AI
```

Use `Live Account` and `Demo Account` in Title Case surfaces. In sentence-case descriptions, lowercase the common noun if it is not a product label, for example `Create a demo account before live trading is enabled.`

## Page Copy Review

After writing or changing English UI copy, run a Page Copy Review:

1. Classify each changed copy surface.
2. Apply Title Case or Sentence case based on the surface.
3. Verify protected terms keep official casing.
4. Check CTA safety, risk integrity, terminology consistency, and i18n readiness.
5. Automatically correct inconsistent capitalization found in the touched page, component, or i18n namespace.
6. Record the review result in the implementation summary.

## Blocking Issues

- A title, button, navigation item, tab, table header, form label, metric label, or status chip uses sentence case.
- A description, error, toast body, helper text, placeholder, or empty-state description uses title case.
- Protected terms are changed to generic casing, such as `kyc`, `pin`, `otp`, `usd`, `mt5`, or `Copytrading`.
- English UI copy is changed without Page Copy Review.
