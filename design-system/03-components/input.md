# Form Field Component Set

## Runtime Components

- `src/components/TextField.tsx`
- `SelectField` exported from `src/components/TextField.tsx`
- `RichTextField` exported from `src/components/TextField.tsx`

## Current Status

Production shared. Auth forms, order lot entry, market search, upgrade reason entry, and developer-panel selects use the global form field component set.

## Shared Visual Model

- Default style is `variant="neutral"` with a token-bound floating label inside the field shell.
- Empty fields show only the label inside the input box at the default 16px field text size.
- Focused, inputting, or populated fields move the label to the upper area of the same shell and place input text below it; the floating label must not use all-uppercase treatment.
- Field labels use the primary neutral text token in both initial and focused states.
- Field shell horizontal content inset uses `layout.formFieldTextInset` / 12px.
- Focused text input and populated values use the default 16px field size with medium weight, including after blur.
- Default and blurred populated field shells use `lineWidth.strong` with `palette.line` for a visible 1px boundary that remains recognizable before interaction.
- Default, focused, inputting, validating, success, and error states use transparent shell backgrounds; only disabled and readonly states use a filled shell background.
- Focused, selected / open, inputting, and error states use `lineWidth.selected` for a 2px border without changing field height.
- Validating and success states use their registered state colors, remain 1px when blurred, and can become 2px only while focused or explicitly inputting.
- `variant="stage"` is the approved high-emphasis numeric input mode for amount-entry surfaces. It keeps the same shell, feedback, and border rules as `neutral`, but uses `typography.quoteLg` and `size.input.multilineMinHeight` to create a focused amount-entry stage without page-local `TextInput` styling.
- `shape="pill"` is the approved full-radius shell shape for compact search fields and similar utility controls. It keeps the same field state, border, feedback, and label rules as the default shell while binding the shell radius to `radius.full`.
- `sizePreset="sm"`, `sizePreset="md"`, and `sizePreset="lg"` are approved field heights. `sm` binds to `size.control.sm`, `md` binds to `size.control.md`, `default` binds to `size.input.floatingMinHeight`, and `lg` binds to `size.input.largeFloatingMinHeight`.

## Required TextField API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Visible field label |
| value | string | no | Controlled value |
| onChangeText | function | yes | Change handler |
| placeholder | string | no | Placeholder from i18n |
| error | string | no | Error message from i18n |
| successText | string | no | Success helper text from i18n |
| disabled | boolean | no | Disabled state |
| readonly | boolean | no | Read-only state |
| fieldState | enum | no | Explicit field state override |
| variant | `neutral` / `stage` | no | Visual variant; `stage` is approved for high-emphasis numeric amount fields |
| keyboardType | string | no | Platform keyboard hint |
| secureTextEntry | boolean | no | Password input |
| multiline | boolean | no | Long-form reason/comment input |
| icon | PhosphorIconName or ReactNode | no | Leading field icon |
| rightSlot | ReactNode | no | Trailing control or adornment, such as password visibility |
| rightSlotFlush | boolean | no | Enlarges trailing control hit area while preserving visible right inset |
| helperText | string | no | Non-error supporting text |
| labelHidden | boolean | no | Visually hidden label for compact/search fields |
| shape | `default` / `pill` | no | Shell shape; `pill` is approved for compact search fields |
| sizePreset | `default` / `sm` / `md` / `lg` | no | Shell height preset; compact utility fields may use `sm` or `md`, high-emphasis auth or amount fields may use `lg` |

## Required SelectField API

| Prop | Type | Required | Description |
|---|---|---:|---|
| label | string | yes | Floating field label |
| value | string | yes | Selected option value |
| options | array | yes | `{ label, value, disabled? }` options |
| onChangeValue | function | yes | Selection handler |
| placeholder | string | no | Empty select text |
| error / helperText / successText | string | no | Field feedback |
| disabled / readonly | boolean | no | Non-editable states |
| fieldState | enum | no | Explicit field state override |
| variant | `neutral` / `stage` | no | Visual variant; `SelectField` keeps neutral behavior until a governed stage select pattern is added |
| icon | PhosphorIconName or ReactNode | no | Leading field icon |
| shellStyle | StyleProp<ViewStyle> | no | Governed shell override for product-specific surfaces; must stay token-bound |
| menuStyle | StyleProp<ViewStyle> | no | Governed web menu surface override for background, border, or shadow tokens |
| optionTextStyle | StyleProp<TextStyle> | no | Governed web option text override; must use registered typography tokens |

## Phone Country Code Variant

`CountryPhoneField` composes a country / dial-code chip with `AuthTextField`.

- The country / dial-code chip is a form field variant and must align with `TextField` shell height, radius, border width, padding, and default border contrast.
- The country / dial-code chip is a button and must show the registered `expandDown` icon on the right side.
- The arrow is a disclosure affordance only; it must use the text-dim token and must not replace the accessible label.
- Page code must not create a custom country-code chip when `CountryPhoneField` can express the interaction.

## Required RichTextField API

`RichTextField` inherits `TextField` props, forces multiline usage, and adds:

| Prop | Type | Required | Description |
|---|---|---:|---|
| toolbarSlot | ReactNode | no | Reserved toolbar area for formatting controls |
| footerSlot | ReactNode | no | Reserved footer area for counters or metadata |

## States

default, focused, inputting, selected/open, validating, success, error, disabled, readonly.

State priority is fixed: disabled > error > focused/inputting > validating > success > default.

## Governance

- Page code must not import `TextInput` directly unless building a low-level input wrapper.
- Approved low-level wrappers are `TextField`, `SelectField`, `RichTextField`, and the legacy-compatible `AuthTextField` adapter inside `AuthShell`.
- Page code must not build page-local select, textarea, or rich-text field shells when a shared field wrapper can express the state.
- Error copy must be passed through `error`, not rendered as a detached page-local pattern.
- Visual values must come from `palette` and `src/theme/tokens.ts` through the shared component.
- Text, select, and rich-text field horizontal padding must bind to `layout.formFieldTextInset`; selected/open/focused/error border compensation must subtract the border delta from that token.
- Trailing `rightSlot` controls must preserve a visible right inset inside the field shell and must bind their minimum hit area to `layout.touchTargetMin`; `rightSlotFlush` may expand the hit area but must not visually place the control on the shell edge.
- Focused, selected/open, inputting, and error field borders must use `lineWidth.selected`; default and blurred populated fields must use `lineWidth.strong`.
- The shared shell must offset inner padding when switching between `lineWidth.strong` and `lineWidth.selected` so focus, selected/open, inputting, and error feedback cannot change field height or width.
- Default form field borders must use at least `palette.line` contrast; reserve `palette.lineSoft` for disabled or lower-emphasis non-input surfaces.
- Default field text and empty-state in-field labels use the 16px field text treatment; helper and error copy keep their own compact text roles.
- Populated field text keeps the focused/inputting medium-weight treatment after blur; do not tie text weight to border width.
- Disabled and readonly are the only form states that may use field shell background fill because they communicate non-interactive behavior.
- `labelHidden` is allowed only for compact controls such as search fields and stepper inputs where a visible label would break the control pattern.
- `shape="pill"` must be used through the shared `TextField`/`AuthTextField` API, not via page-local radius overrides.
- Compact field heights must use `sizePreset`; page code must not override form shell height locally when a registered preset can express it.
