# Changelog

## v1.0.20-instrument-detail-redesign

- Redesigned `/instrument/[id]` into a clearer trading analysis page with Quote Hero, Trade Snapshot, Risk Strip, focused Chart tab, and grouped Contract Specs.
- Moved long-form price range, contract, cost, and trading-limit fields out of the first screen and into the Specs tab groups.
- Preserved order ticket routing, instrument data shape, registered components, embedded/fullscreen chart behavior, and financial risk copy.

## v1.0.19-instrument-detail-visual-rhythm

- Refined the `/instrument/[id]` detail page visual rhythm with a clearer quote metadata row, grouped market metrics, a lighter risk strip, and embedded chart density.
- Preserved instrument data, order ticket routing, ModalStack fullscreen chart behavior, registered icon usage, and existing i18n keys.
- Completed zh-CN copy cleanup for instrument tabs and 52-week labels.

## v1.0.18-bottom-sheet-dismissal-governance

- Fixed public BottomSheet close behavior so position and pending-order detail/action sheets keep content and footer moving as one panel.
- Changed fixed-footer content reserve to follow measured footer height with the existing first-frame fallback, covering single-button, double-button, and no-footer sheet paths.
- Preserved order, pending-order, confirmation, filter, and metric-detail product flows while changing only the shared overlay component implementation.

## v1.0.17-auth-phone-country-validation

- Added country-aware phone validation across login, registration, and password reset so phone accounts must match the selected country / region code before continuing.
- Standardized phone account handoff to E.164 format for OTP routes and remembered-account storage.
- Updated login to use explicit email / phone modes and the governed `CountryPhoneField` instead of guessing phone validity from a single account input.

## v1.0.16-trading-order-sheet-governance

- Moved Portfolio position and pending-order bottom-sheet option bodies into the governed `TradingOrderActionSheet` business component.
- Kept order detail, pending-order detail, close confirmation, and mutation feedback on registered BottomSheet, ConfirmActionSheet, and OverlayQueue paths.
- Preserved trading data, order mutation behavior, routes, icons, and i18n copy while removing page-local order option sheet shells.

## v1.0.15-global-dialog-bottom-sheet-governance

- Added the governed `GlobalDialog` centered feedback host and migrated auth feedback/confirmation dialogs to consume it without changing the user-facing centered visual.
- Reinforced the product rule that page bottom sheets must call the global BottomSheet component system through `bottomSheetPresets`.
- Added QA blockers for page-owned business Modal and bottom-sheet shells, preserving only registered technical exceptions.
- Registered the local `/markets-account-demo` design review route in route governance and public-resource coverage so `qa:all` validates all 43 runtime routes.

## v1.0.14-discover-emotional-icon-tones

- Added governed semantic icon tones to Discover entry and campaign cards so the content area feels warmer and less tool-like.
- Reused existing registered icons and `IconSurface`; no route, copy, business rule, API, or product flow changed.

## v1.0.13-security-center-contract

- Added contract-first Security Center product module for TOTP, GSL, alerts, security score, devices, login history, anti-phishing code, DMP policy boundaries, and audit requirements.
- Added `app-security-center.page-contract.json`, `security-center.openapi.yaml`, security-center schema, root API overview schema/mock, security error codes, RBAC entries, business rules, state machines, exception paths, UI Build inputs, and test mappings.
- Preserved `/settings/security-log` as the current compatibility device/login detail surface; `/settings/security-center` remains planned for the next App implementation stage.
- Reconfirmed TOTP/MFA does not force local PIN setup by default; local PIN remains optional unless explicit local lock/unlock is active.

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
