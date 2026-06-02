# Accessibility Rules

## Baseline

- All pressable actions must expose `accessibilityRole` and a clear label.
- Disabled and loading controls must set `accessibilityState`.
- Icon-only controls require accessible labels.
- Form fields require labels, error messages, and focus order.
- Color cannot be the only signal for up, down, warning, error, or success.
- Text must support dynamic sizing without clipping important actions.

## Current Shared Components

| Component | A11y Rule |
|---|---|
| `ActionButton` | Role button, label fallback, busy and disabled state, optional disabled reason, and loading label support |
| `Screen` | Keyboard dismissal must not trap focus |
| `AppTopBar` | Back action must be labeled and reachable |
| `BottomSheet` | Must provide title, dismiss path, and focus-safe interactions before live workflows |
