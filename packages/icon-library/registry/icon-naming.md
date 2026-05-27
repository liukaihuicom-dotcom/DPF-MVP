# Icon Naming

## Semantic Key Format

Use `icon.{category}.{meaning}.{variant?}.{state?}`.

Examples:

- `icon.wallet.deposit`
- `icon.trading.order_ticket`
- `icon.kyc.identity`
- `icon.system.search`
- `icon.status.verified`

## Rules

- Name by product meaning, not vendor glyph name.
- Store vendor names only in `source_icon_name`.
- Do not use visual names such as `blueIcon`, `thinWallet`, or `prettyChart`.
- Do not use temporary names such as `icon1`, `newDeposit`, or `testIcon`.
- Preserve old names only in `migration` and `legacy_names`; app code should use `icon.*` keys.
- New icons must be added to `icon-registry.json` before page or component usage.
