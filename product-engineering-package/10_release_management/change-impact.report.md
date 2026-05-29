# Change Impact Report

| Area | Impact |
|---|---|
| Header icon neutral surface governance | Adds an optional `surface=neutral` mode to shared `HeaderIconButton` and applies it to `/instrument/[id]` back navigation; no navigation, trading, quote, copy, API, or risk-rule behavior changes. |
| BottomSheet dismissal and footer reserve governance | Internal-only fix to the shared `BottomSheet` implementation: gorhom owns the container slide via 220ms `Easing.out(Easing.cubic)` `animationConfigs`, header/content/footer share one internal `sheetEntranceProgress` with a symmetric 18px exit translate and late footer opacity fade, content reserves dynamic measured footer height (48px floor, 148px first-frame fallback), and footer pointer events follow a 0.4 progress threshold on close. No public API signature, prop, preset, copy, route, or business-rule change. Affects every bottom-sheet caller (position/pending-order detail, close confirmation, trading action menus, quick/filter sheets, account switch, country picker, auth error sheet) — all require close-rhythm and footer-reserve regression. |
| Trading order sheet governance | Moves Portfolio position and pending-order option sheet bodies into the governed `TradingOrderActionSheet` business component; no product flow change. |
| Global dialog governance | Adds `GlobalDialog` as the centered feedback/confirmation host and removes auth-owned business Modal shells. |
| BottomSheet governance | Page bottom sheets must continue through the global BottomSheet preset system; no product flow change. |
| QA | Static checks now block unregistered business `Modal` and page-local bottom sheet shells. |
| Existing Expo runtime | No code changes. |
| Account Assets product docs | Future funding entry points must comply with this contract. |
| Backend | New API, ledger, provider, KYC, audit, review, and config services required before production. |
| Frontend | Future App/H5/Admin UI must consume Page Contracts and Design System inputs. |
| Compliance | Indonesia funding rules, KYC, AML, fee, FX, and risk copy require approval. |
| QA | New blocker/critical funding test suite required. |
| Security Center product package | Adds contract-first module, page contract, API draft, schema, RBAC rules, business rules, state machines, exception paths, and test mappings for canonical `/settings/security-center`. |
| Existing `/settings/security-log` | No runtime code change; remains compatibility/detail surface until Security Center route is implemented. |
| Security / risk policy | TOTP, GSL, remote login, withdrawal verification, DMP mandatory-lock boundaries, and audit logging require security owner confirmation before production. |
| Local PIN behavior | No runtime change; Security Center TOTP/MFA contract explicitly preserves optional-default local PIN behavior. |
