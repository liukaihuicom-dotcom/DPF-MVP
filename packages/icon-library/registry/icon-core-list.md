# Icon Core List

The v4 core set contains semantic `icon.*` keys rendered by local Iconsax assets.

## Source Strategy

- Primary functional source: Iconsax, vendored as local components under `src/icons/local/iconsax`.
- Runtime source packages are blocked; `iconsax-react-native` is allowed only as a temporary extraction source outside production dependencies.
- Linear is the default icon style; Bold is used for active, selected, and emphasized states through `styleVariant="fill"`.
- Custom: retained brand assets or approved owned glyphs only.

## Core Categories

- Navigation: `icon.navigation.discover`, `icon.navigation.function_center`.
- System: `icon.system.back`, `icon.system.chevron_down`, `icon.system.chevron_right`, `icon.system.close`, `icon.system.delete`, `icon.system.keyboard_digits`, `icon.system.logout`, `icon.system.more`, `icon.system.password_visible`, `icon.system.password_hidden`, `icon.system.search`, `icon.system.settings`.
- Wallet and account: `icon.wallet.deposit`, `icon.wallet.withdrawal`, `icon.wallet.transfer`, `icon.wallet.balance`, `icon.account.trading`, `icon.account.user`, `icon.account.avatar`, `icon.account.add_user`, `icon.account.archive`, `icon.account.phone_verified`.
- Trading and market: `icon.trading.market`, `icon.trading.order_ticket`, `icon.trading.order`, `icon.trading.history`, `icon.trading.volume`, `icon.trading.group_by_symbol`, `icon.trading.close_position`, `icon.trading.close_losing_position`, `icon.trading.buy`, `icon.trading.sell`, `icon.market.global`, `icon.market.gold`, `icon.market.index`, `icon.market.stock`, `icon.market.watchlist`.
- Security, risk, and KYC: `icon.security.lock`, `icon.security.password_rules`, `icon.security.key_access`, `icon.security.risk_shield`, `icon.kyc.identity`, `icon.risk.info`, `icon.status.verified`, `icon.status.rejected`, `icon.status.check`.
- Support, copy, and growth: `icon.support.headset`, `icon.support.help_center`, `icon.support.about`, `icon.notification.bell`, `icon.notification.email`, `icon.notification.feedback`, `icon.copy.community`, `icon.ib.network`, `icon.education.academy`, `icon.promotion.reward`, `icon.promotion.ticket`, `icon.promotion.achievement`, `icon.feedback.rating`.
- Brand retained as custom local asset: `icon.brand.apple`.

No unused functional icon should remain in the registry without a release note and migration reason.

## Runtime Delivery

All functional icon glyphs are stored in the local project under `src/icons/local/iconsax` and rendered only through `src/components/AppIcon.tsx`. Source-library package names are retained only as license/source metadata.

## Flag Assets

- Source: `flag-icons` v7.5.0, MIT license, vendored under `src/assets/flags/flag-icons`.
- Coverage: 271 flag asset codes, including 249 ISO country/territory entries from `country.json`.
- Shapes: `circle` and `square` use 1x1 SVG assets; `rectangle` uses 4x3 SVG assets.
- Runtime: flags render through `src/components/FlagIcon.tsx`; `CurrencyFlag` is a governed wrapper.
- Default shape: `circle`.
