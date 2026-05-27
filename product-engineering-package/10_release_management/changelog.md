# Changelog

## v1.0.12-card-axis-padding

- Added the full-site card horizontal inset rule: card-like content surfaces use 12px left/right padding while retaining existing vertical rhythm.
- Preserved the trading order list edge-to-edge contract so reusable order rows remain controlled by the outer container width.

## v1.0.10-register-phone-first-pin-entry

- Changed registration to start with phone verification, continue through email verification, then route password completion into optional local PIN setup.
- Added the Me profile settings menu entry for managing the local 6-digit security code with visible unset, skipped, and set states.
- Kept PIN optional and local-only; production device trust, re-auth, and server audit remain integration gaps.

## v1.0.11-screen-safe-bottom

- Added the full-site route content bottom safety rule through shared `Screen`.
- Kept business flow, copy, route, and risk behavior unchanged.

## v1.0.10-quick-profile-menu-card-edge

- Removed the extra horizontal wrapper inset from the `/quick` profile settings and support menu cards.
- Kept `GlobalMenuList` row padding governed by the shared list-row contract so only the selected card wrapper moves to edge-to-edge within its card.

## v1.0.9-pin-default-off

- Changed the local PIN gate to be optional by default so signed-in users are not sent to PIN setup on normal app entry.
- Kept PIN unlock behavior only for explicit local lock states with an enabled 6-digit PIN.
- Updated login, registration, and developer-console auth presets so PIN setup is skipped unless deliberately enabled.

## v1.0.8-design-system-compliance-remediation

- Added route-level Page Contract coverage for all 42 runtime routes registered in `src/navigation/routeRegistry.ts`.
- Replaced the Portfolio close-position native alert/window confirmation with the shared governed `ConfirmActionSheet`.
- Updated modal governance so `portfolio.closePositionConfirm` is a registered high-risk confirmation sheet with explicit cancel and confirm behavior.
- Registered priority business compositions for Portfolio, Funding, Account Ledger, and Instrument Detail workspaces to keep repeated sheet, list, detail, filter, and chart structures tied to common resources.

## v1.0.7-dev-console-select-dropdown-polish

- Updated developer-console select fields to render on the theme panel surface for a white field background in light mode.
- Added governed `SelectField` web menu overrides for dropdown shadow and 14px option text.

## v1.0.6-dev-console-select-field-alignment

- Aligned developer-console select controls with the governed shared `SelectField` form shell.
- Removed local compact select shell overrides from the developer tool so labels, values, borders, height, and insets follow the form component standard.

## v1.0.5-pin-skip-control-label

- Updated the PIN setup top-right skip action to the governed 14px control-label typography.

## v1.0.4-single-select-check-indicator

- Updated single-select selected indicators to use the governed plain check mark icon.
- Added the global usage rule that selected rows should not use radio dots or circled check icons when the selected row container already communicates state.

## v1.0.3-provider-safe-root-error-boundary

- Added a provider-safe root error boundary for Expo Router web fallback rendering.
- Prevented route errors from escalating into `useProductSettings` provider crashes on the error surface.

## v1.0.2-markets-featured-cards

- Added the Markets page featured instrument-card module for five configurable hot trading symbols with horizontal scrolling.
- Reused governed instrument identity, sparkline, typography, spacing, radius, and market quote semantics.

## v1.0.0-contract

- Added funding Product Kernel for Indonesia-first direct-to-trading-account model.
- Added module, RBAC, business rules, state machines, page contracts, API draft, error mapping, QA gates, traceability, and test mapping.
- Marked provider, KYC, ledger, AML thresholds, limits, fees, FX source, UI, copy, UX, and production implementation as next-stage blockers.

## v1.0.1-production-structure

- Added `11_validation_scripts/` ownership mapping to align the package with L5 product delivery structure.
- Clarified shared QA entrypoints and pnpm/Corepack fallback behavior.
