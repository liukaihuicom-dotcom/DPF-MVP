# App Rules

- Mobile-first layout.
- Use `SafeAreaView` and shared `Screen`.
- Codex/browser product-page preview must render through `AppViewport` at the governed 390 x 844 app device canvas.
- Web-only preview safe-area metrics may be simulated in `RootLayout`; native iOS/Android must keep real device safe-area values.
- Developer tools, QA overlays, and debug panels are independent modules outside the product-page app canvas and must remain draggable/clickable when applicable.
- Minimum touch target is 44 x 44 px.
- Prefer bottom sheets for contextual mobile actions.
- Sticky footers must reserve safe-area and keyboard space.
- All new screens must handle dynamic locale length.
