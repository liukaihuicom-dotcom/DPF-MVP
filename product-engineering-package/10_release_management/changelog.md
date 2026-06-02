# Changelog

## v1.1.13-bottom-sheet-public-resource-migration-and-scenario-dev-console

- Added public BottomSheet scene openers: `openActionSheet`, `openDetailSheet`, `openSelectionSheet`, `openConfirmSheet`, `openFixedListSheet`, and `openScrollableDetailSheet`.
- Migrated page-scattered BottomSheet calls and private sheet bodies to governed public business components for funding methods, security device detail, account transaction/menu sheets, Discover profile sheets, and Auth country/language pickers.
- Preserved business flows, routes, copy semantics, icon semantics, and risk levels while unifying backdrop dismiss, pan-down, Android Back, fixed-height scrolling, surface, content padding, and footer safe-area behavior through the shared BottomSheet lifecycle.
- Synced overlay registry, page overlay matrix, public resource graph, modal registry, QA guards, and component-library `2.5.8` version records.
- Refactored the web-only `ProductControlPanel` developer tool into a scenario-driven console with six user-journey groups, persona/state/route scenario cards, runtime simulated identity metrics, secondary Page Map diagnostics, and fine-tune state controls.
- Scenario application remains limited to existing local product settings, Broker demo state setters, and `applyMockFundingPreset`; `quote_failed_state` is recorded as a scenario gap because quote status has no public scenario setter.

## v1.1.12-instrument-chart-embedded-flush-surface

- Removed the extra embedded chart outer padding from `/instrument/[id]` so the chart block aligns flush inside the governed instrument detail workspace.
- Kept quote header, scroll-revealed header summary, buy/sell routing, chart fullscreen behavior, and risk copy unchanged.
- Synced component-library `2.5.7`, release notes, design-system records, and component manifest wording for the embedded chart flush-surface contract.

## v1.1.11-instrument-detail-header-disclosure

- Changed `/instrument/[id]` header behavior so the default header does not expose instrument fields and the compact symbol, current price, percentage change, and price change summary appears only after scroll.
- Registered the instrument detail page contract against the `instrumentDetailTrading` pattern: identity header, quote/status context, Bid/Ask/Spread/Leverage decision strip, chart-first embedded workspace, auxiliary tabs, compact risk copy, and fixed buy/sell quote action bar.
- Kept embedded chart tools compact while preserving fullscreen terminal access for indicators and drawing tools.
- Kept buy/sell routing, unified back handling, quote data, chart behavior, risk copy, and order-ticket route shape unchanged.
- Synced component-library `2.5.6`, release notes, public-resource impact record, and QA guards for the adaptive header icon background correction.

## v1.1.10-instrument-detail-public-workspace

- Changed `/instrument/[id]` to consume the governed `InstrumentDetailWorkspace` public business skeleton instead of owning the full page structure locally.
- Added adaptive `HeaderIconButton` surface governance so white panel/raised header contexts can use the governed neutral icon background while gray canvas contexts keep panel contrast.
- Synced component manifests, public-resource dependency graph, business-component governance, QA guards, release records, and TypeScript cleanup for the order-ticket bottom sheet close path.

## v1.1.9-order-ticket-global-bottom-sheet

- Changed `/order/[id]` to render the order operation page through `GlobalBottomSheetHost` as a route-backed fixed BottomSheet modal page.
- Preserved route recovery, direct entry, high-risk submit confirmation, invalid-submit blocking alerts, dirty-state leave confirmation, one-click trading confirmation, and toast submit feedback.
- Added guarded BottomSheet close support so backdrop tap, Header Close, Android Back, and enabled pan-down enter the shared close guard before dismissal.
- Synced route, modal, overlay matrix, component manifest, page contract, and release records.

## v1.1.6-order-ticket-toast-feedback

- Changed `/order/[id]` successful market order and pending-order feedback from queued result Alert Dialog to the governed global Toast feedback path.
- Preserved pre-submit high-risk confirmation, invalid-submit blocking alerts, dirty-state leave confirmation, and one-click trading switch confirmation.
- Kept users on the current order ticket after successful submit instead of replacing the route with `/trade`.
- Synced route, modal, page contract, and release records for `global.toastFeedback`.

## v1.1.5-trading-account-sheet-bottom-spacing

- Aligned trading account switch sheet content-bottom reserve with the shared BottomSheet specification.
- Kept `/trade`, `/markets`, and funding account switchers on the governed `sheetSurface='canvas'` plus `contentPadding='card'` path.
- Added static QA coverage so `TradingAccountSwitchSheet` cannot add local bottom padding or margin beyond `layout.sheetContentPaddingBottom`.

## v1.1.4-bottom-sheet-footer-divider-removal

- Removed the shared BottomSheet Footer action-area divider so bottom actions sit on the same sheet surface without a hairline separator.
- Preserved BottomSheet API, routes, business flows, copy, icons, safe-area padding, in-Panel Footer layout, and shared close lifecycle.
- Added static QA coverage to block future footer divider regressions in the global BottomSheet implementation.
- Restored every non-Partner Trader Workspace segment to the unified bottom navigation `Workspace / Markets / Trade / Accounts / Discover / Dynamic Discover Module`.
- Reordered Expo Router JavaScript Tabs so Trader visible order is `workspace`, `markets`, `trade`, `accounts`, `discover`, and `quick`.
- Kept approved Partner Mode on `Workspace / Clients / Growth / Wallet / Me` and preserved `/quick` as the dynamic Discover module carrier with selected-module label and icon.
- Synced Workspace page contract, route map, routing docs, test mapping, acceptance criteria, public-resource rules, and release decision notes.

## v1.1.3-agentic-workspace-shell

- Introduced the Agentic Workspace shell and a lifecycle-tab experiment that is superseded by the v1.1.4 Trader six-tab navigation patch.
- Reframed Workspace as an Agentic work area where financial status remains explicit GUI information and Assist only explains, diagnoses, suggests, generates, or summarizes paths.
- Synced Workspace page contract, route map, routing docs, test mapping, acceptance criteria, public-resource graph, i18n copy, and release records.

## v1.1.2-trader-dynamic-discover-carrier

- Restored Trader Mode's rightmost bottom tab as the dynamic `/quick` Discover module carrier instead of the fixed `/me` route.
- Kept the rightmost Trader label and icon bound to the selected Discover module short label and registered module icon, including `我的` when the selected module is `profile`.
- Preserved Partner Mode bottom navigation as `Workspace / Clients / Growth / Wallet / Me`.

## v1.1.1-trader-mode-bottom-navigation-patch

- Updated every Trader Workspace segment to the unified bottom navigation `Workspace / 行情 / 交易 / 账号 / 发现 / 我的`.
- Clarified that `Trade` is visible in Trader Mode, while high-risk trading and funding actions remain blocked or guided inside destination pages until entitlement checks pass.
- Updated Workspace header mode copy so Trader shows `交易模式` and approved Partner shows `Partner 模式`.
- Preserved Partner Mode bottom navigation as `Workspace / Clients / Growth / Wallet / Me` and kept `me` as the final profile/settings/support carrier route.

## v1.1.0-workspace-bottom-navigation

- Added the Broker App Workspace as the first bottom navigation entry and introduced `WorkspaceSegment` states for new Trader, KYC-approved no-deposit Trader, Active Trader, and approved Partner Mode.
- Updated Trader Mode to use one bottom tab combination for every Trader segment: `Workspace / 行情 / 交易 / 账号 / 发现 / 我的`; Partner Mode remains `Workspace / Clients / Growth / Wallet / Me`.
- Added Workspace domain aggregation, Workspace route, semantic auxiliary tab routes, Workspace public components, page contract, traceability, test mapping, public-resource graph coverage, i18n copy governance, and version records.
- Preserved existing Accounts, Markets, Trade, Profile, Partner client list, Partner tools, and commission wallet capabilities; Copy Trading is not added to the default bottom navigation.

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
