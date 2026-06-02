# Button Component

## Runtime Component

`src/components/ActionButton.tsx`

Exports `ActionButtonTone` for shared footer/action typing.

## Variants

| Variant | Prop | Use |
|---|---|---|
| filled | `variant="filled"` | Solid primary CTA or explicit high-emphasis action; no border stroke |
| outline | `variant="outline"` | Secondary action with transparent background and visible boundary |

## Tones

| Tone | Prop | Use |
|---|---|---|
| neutral | `tone="neutral"` | Secondary action |
| brand | `tone="brand"` | Primary product CTA |
| up | `tone="up"` | Buy or upward market context |
| down | `tone="down"` | Sell or downward market context |
| blue | `tone="blue"` | Informational action |
| amber | `tone="amber"` | Pending, review, or caution action |
| danger | `tone="danger"` | Destructive operations such as close position or delete |

## Props

`ActionButton` supports `label`, `onPress`, `tone`, `variant`, `disabled`, `disabledReason`, `loading`, `loadingLabel`, `accessibilityLabel`, `style`, optional `icon`, optional `leadingIcon`, optional `trailingIcon`, optional `reserveLeadingIcon`, optional `reserveTrailingIcon`, and optional `sizePreset`.

`variant` is the locked two-style contract. Use `variant="filled"` for the single primary action in a fixed operation area, such as order submission or a destructive confirmation. Use `variant="outline"` for bounded secondary actions.

Do not add text, soft, ghost, or mixed background plus outline button variants. Background-free text actions must be implemented as text action patterns with `NativePressable` and `AppText`, not as `ActionButton` variants.

Use `leadingIcon` with a registered `AppIconName` for action semantics such as logout, upload, password/security, edit/modify, funding operations, destructive actions, and dense action rows where fast scanning matters. The legacy `icon` prop remains supported as a `leadingIcon` alias.

Use `trailingIcon` for directional or destination semantics such as continue, open detail, external link, or next-step actions. Do not use trailing icons for destructive submit actions.

Use `reserveLeadingIcon` or `reserveTrailingIcon` only inside aligned button groups where labels must stay visually aligned across buttons with and without icons. Do not create page-local spacer views around button labels.

## Sizes

| Size | Prop | Use |
|---|---|---|
| small | `sizePreset="sm"` | 40px compact card, list, and dense secondary actions |
| medium | `sizePreset="md"` or `sizePreset="default"` | 48px standard form footer, sheet footer, card, and dense action buttons |
| large | `sizePreset="lg"` | 56px login, funding submit, and fixed bottom primary CTA buttons |
| extra large | `sizePreset="xl"` | 64px Launch / Onboarding first-screen primary CTA; one per screen maximum |

## Icon Treatment

`ActionButton` icon slots render quiet standalone `AppIcon` glyphs matching the button foreground. Do not wrap button slot icons in tinted circular backgrounds, outline rings, or token-derived color frames.

Icon-only buttons do not use `ActionButton`; use `HeaderIconButton`, `StepperButton`, or a governed icon action pattern.

Financial action tiles and quick-action entries render icons as quiet standalone glyphs.

Funding action glyphs use a 24px icon inside a 40px reserved visual box. Deposit maps to the green/down semantic color, withdraw maps to amber/yellow, and transfer maps to blue. Page code should use the business tones `deposit`, `withdraw`, and `transfer` instead of reusing market movement tone names.

Header icon buttons may keep a soft hit area for accessibility, but the button frame must not draw an outlined circle. The visual priority should stay on the icon, label, and surrounding financial data rather than on decorative icon badges.

## Token Binding

| Part | Token |
|---|---|
| Label | small `typography.buttonSm` at 14px, medium `typography.buttonMd` at 16px, large/xl `typography.buttonLg` at 20px, through `AppText`, semibold `600` |
| Icon | `AppIcon` registered asset, small `size.icon.xs`, medium `size.icon.sm`, large/xl `size.icon.md`, matching label foreground |
| Radius | `radius.full` |
| Border | `variant="filled"` uses `lineWidth.none`; `variant="outline"` uses `lineWidth.hairline` |
| Height | small `size.button.sm`, medium/default `size.button.md` / `size.button.minHeight`, large `size.button.lg`, xl `size.button.xl` |
| Padding | small `spacing.md`, medium `layout.actionButtonPaddingX`, large/xl `spacing.xl`; vertical padding uses `spacing.none` so token heights remain exact |
| Colors | `ThemePalette` semantic fields; disabled uses `disabledSurface`, `disabledBorder`, and `disabledText` |

## States

| State | Prop or Trigger | Requirement |
|---|---|---|
| default | no flags | Enabled and labeled |
| loading | `loading` | Shows spinner, sets busy state, disables press |
| disabled | `disabled` | Filled buttons use `palette.disabledSurface`; outline buttons use transparent background and `palette.disabledBorder`; text, icons, and loading spinner use `palette.disabledText` |
| pressed | touch down | Uses `NativePressable` pressed feedback without leaving token governance |
| hover | web pointer hover | Uses `NativePressable` hover feedback without changing variant semantics |
| focus | keyboard or accessibility focus | Uses the semantic focus border token |
| success | caller-owned | Show toast or result block |
| failed | caller-owned | Show validation or error toast |

`success` and `failed` are not internal `ActionButton` visual states. `selected` and `toggle` controls must use `SegmentedTabs`, `FilterPillGroup`, `SwitchControl`, or another governed selection component.

## A11y

- Must set `accessibilityRole="button"`.
- Must set label from explicit `accessibilityLabel` or visible label.
- Busy and disabled must be reflected through `accessibilityState`.
- Disabled reason should be supplied through `disabledReason` when the cause is not obvious from nearby validation or status copy.
- Loading may use `loadingLabel` when a visible busy label improves clarity; otherwise the old spinner-only loading behavior remains valid.
