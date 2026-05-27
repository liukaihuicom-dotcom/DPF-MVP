# Page Audit

Use this audit before marking a page production-ready.

| Check | Pass |
|---|---|
| Page goal and user role are explicit | [ ] |
| Business rules and exceptions are mapped | [ ] |
| Permission behavior is mapped | [ ] |
| State matrix is complete | [ ] |
| Component usage points to design-system docs | [ ] |
| Typography uses `AppText` variants or `src/theme/tokens.ts` | [ ] |
| Page and global sheet module horizontal padding uses `layout.screenPaddingX` = 16px | [ ] |
| Other spacing and radius use shared components or runtime tokens | [ ] |
| Semantic statuses use `StatusPill` or registered business components | [ ] |
| Inputs use `TextField` or approved low-level wrappers | [ ] |
| Global bottom sheets declare explicit header mode and use component-owned footer/backdrop | [ ] |
| All page sheet entrances pass component-owned header occupancy: headed sheets reserve the 56px title bar, headerless sheets keep no title-bar gap | [ ] |
| All page sheet entrances pass backdrop close, pan-down close, dynamic height, max-height, fixed footer visibility, and width alignment | [ ] |
| API or mock source is defined | [ ] |
| i18n keys are complete | [ ] |
| A11y baseline is complete | [ ] |
| Performance and retry strategy is defined | [ ] |
| Security and risk notes are complete | [ ] |
| Visual QA report is complete | [ ] |

## Style Gate

`pnpm run qa:style` must pass before a page is marked production-ready. Raw colors, direct page typography literals, direct `TextInput` usage, legacy `bottomSheet.show(...)` / `bottomSheet.push(...)` option objects, page-owned global sheet header/footer/backdrop patterns, and page padding or empty views used to fake global sheet header height are blockers.
