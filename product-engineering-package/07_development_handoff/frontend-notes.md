# Frontend Notes

- Funding screens must use i18n keys for all visible copy.
- Error handling must map stable backend error codes to user-safe copy.
- Quote expiry and method maintenance must be visible before submit.
- Forms must prevent duplicate submit and preserve entered values after recoverable errors.
- Sticky submit footers must not cover form fields on App/H5.

## Security Center Implementation Notes

- Add `/settings/security-center` only in the App implementation stage, with a thin route wrapper and route registry entry; keep `/settings/security-log` working as a compatibility detail page.
- `SecurityCenterScreen` must consume `app-security-center.page-contract.json`, `security-center.openapi.yaml`, and `security-center.schema.json`; page code must not compute final risk policy locally.
- Reuse governed components: `Screen`, `Card`, `AppText`, `ActionButton`, `StatusPill`, `IconSurface`, `AppIcon`, `BottomSheet`, `ConfirmActionSheet`, `SegmentedTabs`, `KeyValueList`, and `Metric`.
- Use only registered security icons: `icon.security.lock`, `icon.security.password_rules`, `icon.security.key_access`, and `icon.security.risk_shield`.
- TOTP/MFA must not force local PIN setup; local PIN remains optional unless explicit local lock/unlock state is active.
- High-risk actions need explicit cancel paths, verification feedback, recoverable error copy, audit context, and no native `Alert.alert` / `window.confirm` fallback.
