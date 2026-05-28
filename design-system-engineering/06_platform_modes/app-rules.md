# App Rules

Source of truth: `design-system/06-platform/app-rules.md`.

Expo App delivery must keep route files thin, use `src/screens` for screen composition, and consume shared tokens, components, icons, and patterns.

Codex/browser product-page preview must use the governed 390 x 844 native app simulation canvas through `AppViewport`. Web-only safe-area metrics are injected from `RootLayout`; native iOS/Android devices must continue using real safe-area values. Developer tools such as `ProductControlPanel` are independent draggable debug modules outside the product-page canvas and must not be clipped by `AppViewport`.
