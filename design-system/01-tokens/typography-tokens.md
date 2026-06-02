# Typography Tokens

| Token | Size | Weight | Use |
|---|---:|---:|---|
| display.xl | 28 | 700 | Screen-level hero number or title |
| display.lg | 20 | 600 | Compact page title |
| page.title | 28 | 700 | Compatibility page title alias |
| title.md | 16 | 600 | Section title and card headline |
| title.sm | 16 | 500 | Secondary section title |
| sheet.title | 20 | 600 | Global bottom sheet title bar |
| body.md | 14 | 400 | Main body text |
| body.sm | 14 | 400 | Dense market rows and card body |
| caption | 14 | 500 | Labels and helper copy |
| caption.sm | 12 | 400 | Helper and metadata copy |
| micro.meta | 10 | 700 | Ultra-compact metadata only |
| micro.label | 12 | 700 | Status tags |
| button.sm | 14 | 600 | Compact card, list, and dense secondary action button labels |
| button.md | 16 | 600 | Primary and secondary button labels |
| button.lg | 20 | 600 | Large entry CTA button labels |
| number | 16 | 500 | Quote and compact metric values |

## Title Role Matrix

All screen, dialog, card, list, and tab titles must use a governed title role. Product UI should choose the role by component context instead of manually choosing `fontSize`, `fontWeight`, or generic text variants.

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Page title | `title.page` | `display.xl` | 28 | 700 | 40 | Root screen title, auth page title, primary page header |
| Compact page title | `title.pageCompact` | `display.lg` | 20 | 600 | 24 | Back-navigation page title, compact top bar title |
| Dialog title | `title.dialog` | `sheet.title` | 20 | 600 | 24 | Modal dialog title when a shared dialog is introduced |
| Bottom sheet title | `title.sheet` | `sheet.title` | 20 | 600 | 24 | Global bottom sheet title bar |
| Card title | `title.card` | `title.md` | 16 | 600 | 20 | Card header, empty-state card title, compact content module title |
| Section title | `title.section` | `title.md` | 16 | 600 | 20 | Screen section header above grouped content |
| List title | `title.list` | `caption` | 14 | 500 | 18 | List group title, date/group headers, sheet group title |
| List item title | `title.listItem` | `title.md` | 16 | 600 | 20 | Primary row title such as account number, instrument, transaction note |
| Segmented tab title | `title.tabs` | `caption` | 14 | 500 | 18 | In-page segmented tab labels |
| Bottom tab title | `title.bottomTabs` | `micro.label` | 12 | 700 | 16 | App-level Expo Router bottom tab labels |

## Body Role Matrix

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Primary body | `body.primary` | `body.md` | 14 | 400 | 20 | Standard paragraphs, toast titles, readable explanatory copy |
| Secondary body | `body.secondary` | `body.sm` | 14 | 400 | 20 | Dense card body, empty-state body, secondary descriptions |
| Dense body | `body.dense` | `body.sm` | 14 | 400 | 20 | Table-like rows, market rows, compact lists |
| Prominent body | `body.prominent` | `body.lg` | 16 | 400 | 22 | Auth subtitles, onboarding lead copy, long-form high-emphasis copy |

## Label And Minimum Text Matrix

| Role | Runtime variant | Source token | Size | Weight | Line height | Required use |
|---|---|---|---:|---:|---:|---|
| Default label | `label.default` | `caption` | 14 | 500 | 18 | Field labels, list group labels, chart labels |
| Helper label | `label.helper` | `caption.sm` | 12 | 400 | 16 | Helper text, secondary metadata, subtitles inside compact components |
| Metadata label | `label.metadata` | `caption.sm` | 12 | 400 | 16 | Time, reference id, auxiliary one-line data |
| Field label | `label.field` | `body.sm` | 14 | 400 | 20 | Form-field visible labels when not using compact label treatment |
| Control label | `label.control` | `caption` | 14 | 500 | 18 | Segmented tabs, text links, compact control labels |
| Large control label | `label.controlLarge` | `title.sm` | 16 | 500 | 20 | High-emphasis segmented tabs that explicitly opt into larger labels |
| Metric label | `label.metric` | `caption.regular` | 14 | 400 | 18 | Secondary metric labels beside a primary financial figure |
| Status label | `label.status` | `micro.label` | 12 | 700 | 16 | Status tags, badges, toast status word |
| Minimum label | `label.minimum` | `micro.meta` | 10 | 700 | 12 | Ultra-short metadata, chart ticks, counters, or dense control-panel details only |

## Rules

- Letter spacing should be 0 unless a token explicitly defines a label treatment.
- Button and tab text must use fixed containers and `adjustsFontSizeToFit` where labels may localize longer.
- `variant` controls size, weight, and line height. `tone` controls text color.
- Page, dialog, card, list, and tab titles must use `title.*` semantic variants through `AppText` or component-owned mappings such as `titleTypography`.
- Body text must use `body.*` semantic variants. Do not use `caption` to make body text smaller.
- Labels, helper text, metadata, statuses, and compact controls must use `label.*` semantic variants.
- Use `label.controlLarge` only through an explicit component variant such as `SegmentedTabs labelSize="large"`; do not replace all compact controls with the larger role.
- Use `label.metric` for secondary metric labels that sit next to a larger primary value; keep primary metric explanation labels on the component-owned 16px medium role.
- Minimum text is 10px through `label.minimum` only. Do not use 10px for status pills, bottom navigation labels, helper text, CTA labels, or financial risk copy.
- The active typography scale is `10 / 12 / 14 / 16 / 20 / 28 / 34 / 42`; close legacy sizes are consolidated as `13 → 12`, `17 → 16`, `18 → 16`, `22 → 20`, and `24 → 28`.
- Do not use generic `title`, `subtitle`, `body`, `caption`, `displayXl`, `displayLg`, `titleMd`, `sheetTitle`, `captionSm`, or `microLabel` for governed title/body/label roles in new code. Legacy aliases exist only for migration compatibility.
- Do not hardcode title `fontSize`, `fontWeight`, `lineHeight`, or `letterSpacing` outside `src/theme/tokens.ts` and governed typography components.
- Do not choose a larger or heavier text variant just to avoid using the correct text color level.
- Do not use `brand`, `danger`, `amber`, `up`, or `down` to repair unclear typography hierarchy. Status tones require a real business state.
- Ordinary page text should use `AppText` with a semantic `tone`; direct `style.color` belongs only in registered component-owned foreground exceptions.
- Default body text is 14px. Larger 16px tokens are reserved for titles, controls, or explicit component roles.
