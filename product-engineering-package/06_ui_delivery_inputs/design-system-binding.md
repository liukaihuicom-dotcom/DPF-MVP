# Design System Binding

No UI is implemented by this package.

Before UI Build, funding pages must consume the existing design-system assets and produce:

- Component usage map for forms, status timelines, transaction rows, warning banners, review panels, empty/error states, and confirmation dialogs.
- Token usage report for color, spacing, radius, typography, status tones, and risk states.
- Icon registry review if funding icons are added or changed.
- Financial copy and localization package for English, Chinese, and Indonesia-specific copy if Bahasa Indonesia is introduced.

## Security Center Binding

The Security Center package is contract-ready but not UI-implemented in this stage.

- Planned canonical route: `/settings/security-center`.
- Compatibility route: `/settings/security-log`, reused as a device/login detail surface.
- Required base components: `Screen`, `Card`, `AppText`, `ActionButton`, `StatusPill`, `IconSurface`, `AppIcon`, `BottomSheet`, `ConfirmActionSheet`, `SegmentedTabs`, `KeyValueList`, `Metric`.
- Required icons: `icon.security.lock`, `icon.security.password_rules`, `icon.security.key_access`, `icon.security.risk_shield`.
- Required copy namespace: `securityCenter`; high-risk security copy requires Financial Copy Review and UX Gate.
- Required patterns: security overview, security verification, GSL cooling, list/detail, empty/error.
- Forbidden: page-local risk policy, page-local SVG, third-party icon imports, local PIN mandatory setup caused by TOTP/MFA.
