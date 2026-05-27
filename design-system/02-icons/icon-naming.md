# Icon Naming

Icon names must use product semantics, not provider glyph names.

Format:

```text
icon.{category}.{meaning}.{variant?}.{state?}
```

| Product Meaning | Icon |
|---|---|
| Markets | `icon.navigation.markets` |
| Trade | `icon.navigation.trade` |
| Accounts | `icon.navigation.accounts` |
| Discover | `icon.navigation.discover` |
| Partner | `icon.navigation.partner` |
| Deposit | `icon.wallet.deposit` |
| Withdrawal | `icon.wallet.withdrawal` |
| Trading account | `icon.account.trading` |
| Search | `icon.system.search` |
| Row disclosure | `icon.system.chevron_right` |
| Expandable control | `icon.system.chevron_down` |

## Rules

- Use `icon.*` semantic keys in app code.
- Keep the source glyph name inside the registry only.
- Do not use visual names such as `blue-wallet`, `thin-arrow`, or `icon1`.
- Do not use legacy provider names in page code.
- Keep states explicit when the same concept has active, disabled, danger, or success variants.
