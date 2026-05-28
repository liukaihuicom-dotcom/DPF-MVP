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

`ActionButton` supports `label`, `onPress`, `tone`, `variant`, `disabled`, `loading`, `accessibilityLabel`, `style`, optional `icon`, and optional `sizePreset`.

`variant` is the locked two-style contract. Use `variant="filled"` for the single primary action in a fixed operation area, such as order submission or a destructive confirmation. Use `variant="outline"` for bounded secondary actions.

Do not add text, soft, ghost, or mixed background plus outline button variants. Background-free text actions must be implemented as text action patterns with `NativePressable` and `AppText`, not as `ActionButton` variants.

Use `icon` with a registered `AppIconName` for bottom-sheet footer operations, destructive actions, edit/modify actions, and dense action rows where fast scanning matters. Destructive sheet footer actions use `tone="danger"` so the label and icon share the danger color.

## Sizes

| Size | Prop | Use |
|---|---|---|
| default | `sizePreset="default"` | Standard form footer, sheet footer, card, and dense action buttons |
| large | `sizePreset="lg"` | Launch, onboarding, or other primary entry CTAs that need a stronger touch target |

## Icon Treatment

Financial action tiles and quick-action entries render icons as quiet standalone glyphs. Do not wrap decorative action icons in tinted circular backgrounds, outline rings, or token-derived color frames.

Funding action glyphs use a 24px icon inside a 40px reserved visual box. Deposit maps to the green/down semantic color, withdraw maps to amber/yellow, and transfer maps to blue. Page code should use the business tones `deposit`, `withdraw`, and `transfer` instead of reusing market movement tone names.

Header icon buttons may keep a soft hit area for accessibility, but the button frame must not draw an outlined circle. The visual priority should stay on the icon, label, and surrounding financial data rather than on decorative icon badges.

## Token Binding

| Part | Token |
|---|---|
| Label | default `typography.buttonMd` at 16px, large `typography.buttonLg` at 20px, through `AppText`, semibold `600` |
| Icon | `AppIcon` registered asset, matching label foreground |
| Radius | `radius.full` |
| Border | `variant="filled"` uses `lineWidth.none`; `variant="outline"` uses `lineWidth.hairline` |
| Height | default `size.button.minHeight`, large `size.control.lg` |
| Padding | default `space.18` horizontal equivalent, large `spacing.xl`, `space.12` vertical |
| Colors | `ThemePalette` semantic fields; disabled uses `disabledSurface`, `disabledBorder`, and `disabledText` |

## States

| State | Prop or Trigger | Requirement |
|---|---|---|
| default | no flags | Enabled and labeled |
| loading | `loading` | Shows spinner, sets busy state, disables press |
| disabled | `disabled` | Filled buttons use `palette.disabledSurface`; outline buttons use transparent background and `palette.disabledBorder`; text, icons, and loading spinner use `palette.disabledText` |
| pressed | touch down | Uses `NativePressable` pressed feedback without leaving token governance |
| success | caller-owned | Show toast or result block |
| failed | caller-owned | Show validation or error toast |

## A11y

- Must set `accessibilityRole="button"`.
- Must set label from explicit `accessibilityLabel` or visible label.
- Busy and disabled must be reflected through `accessibilityState`.
