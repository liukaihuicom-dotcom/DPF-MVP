# Public Resource QA Checklist

Version: `0.2.0`
Date: `2026-05-28`

- `public-asset-registry.json` exists and every asset has source, owner, status, sync policy, and QA status.
- `asset-dependency-graph.json` contains every route registered in `src/navigation/routeRegistry.ts`.
- Every page has token, component, pattern, and copy dependencies declared.
- Codex/browser product-page preview uses `AppViewport` with the governed 390 x 844 app canvas.
- Developer tools such as `ProductControlPanel` remain outside `AppViewport` and preserve drag interactions.
- Card, page card-like panels, sheet cards, dialog cards, and business card surfaces remain borderless and do not carry `borderWidth` or `borderColor`.
- Filled `HeaderIconButton` action containers on gray page, sheet, or canvas backgrounds use `color.surface.panel`; page-local hardcoded white and gray subtle filled backgrounds are blocked.
- Discover entry-card title and description stacks use `spacing.xs` as the governed 4px layer.
- Discover entry and campaign cards use data-driven governed `IconSurfaceTone` values for warmer left-side icon expression instead of defaulting every card to neutral.
- Shared `BottomSheet` footer action areas start hidden and follow the shared sheet entrance progress instead of appearing at the bottom by default.
- High-risk pages include business component dependencies.
- Icon surfaces depend on the local icon registry and must continue to pass `pnpm qa:icons`.
- Route/page files must not import `react-native-svg`; registered public chart/gauge components may use SVG internally as data visualization.
- User-visible financial copy depends on copy-table / i18n and must continue to pass `pnpm qa:i18n`.
- Draft or manual-migration assets are allowed only when they are explicitly marked as out-of-batch follow-up, such as planned illustrations or `LocalPinSecurityFlow`.
- First-batch migrated pages must remain `reference_migration_complete` in `asset-dependency-graph.json`.
