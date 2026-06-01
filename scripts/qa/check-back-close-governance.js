const path = require('path');

const { complete, fail, pass, read, walk } = require('./qa-utils.cjs');

const checks = [
  ...checkPrimaryTabsDoNotRenderBackOrClose(),
  ...checkModalRoutesUseCloseSemantics(),
  ...checkPrivateOverlaysAreBlocked(),
  ...checkDirtyGuardCopy(),
  ...checkNavigationPolicyContracts(),
  ...checkModalStackSemantics(),
];

complete('qa:back-close-governance', checks);

function checkPrimaryTabsDoNotRenderBackOrClose() {
  const files = [
    'src/screens/workspace/WorkspaceScreen.tsx',
    'src/screens/markets/MarketsScreen.tsx',
    'src/screens/portfolio/PortfolioScreen.tsx',
    'src/screens/accounts/AccountScreen.tsx',
    'src/screens/discover/DupoinDiscoverScreen.tsx',
    'src/screens/workspace/WorkspaceTabRoutes.tsx',
  ];
  const checks = [];

  for (const file of files) {
    const text = read(file);
    const hasBackScreen = /<Screen\b[^>]*(\bback\b(?!=\{showBack\})|back=\{true\}|leftAction=["']back["'])/.test(text);
    const hasCloseScreen = /<Screen\b[^>]*leftAction=["'](?:close|cancel)["']/.test(text);

    if (hasBackScreen || hasCloseScreen) {
      checks.push(fail('PRIMARY_TAB_LEFT_ACTION', `${file} must not render Back or Close on a primary tab route`, file));
    } else {
      checks.push(pass(`QA_PRIMARY_TAB_LEFT_ACTION_${path.basename(file)}`, `${file} does not render Back or Close for primary tab entry`, file));
    }
  }

  const workspaceRoutes = read('src/screens/workspace/WorkspaceTabRoutes.tsx');
  checks.push(
    workspaceRoutes.includes('<SettingsScreen showBack={false} />')
      ? pass('QA_ME_ROUTE_NO_BACK', '/me route disables SettingsScreen Back action', 'src/screens/workspace/WorkspaceTabRoutes.tsx')
      : fail('ME_ROUTE_SHOWS_BACK', '/me route must render SettingsScreen with showBack={false}', 'src/screens/workspace/WorkspaceTabRoutes.tsx'),
  );

  return checks;
}

function checkModalRoutesUseCloseSemantics() {
  const routeRegistry = read('src/navigation/routeRegistry.ts');
  const discoverLayout = read('src/screens/discover/DiscoverLayoutScreen.tsx');
  const orderTicket = read('src/screens/trading/OrderTicketScreen.tsx');
  const checks = [];

  checks.push(
    hasRoutePolicy(routeRegistry, '/discover-layout', 'topNavBehavior', 'close')
      ? pass('QA_DISCOVER_LAYOUT_ROUTE_CLOSE', '/discover-layout declares close top navigation', 'src/navigation/routeRegistry.ts')
      : fail('DISCOVER_LAYOUT_ROUTE_BACK', '/discover-layout must use close top navigation', 'src/navigation/routeRegistry.ts'),
  );
  checks.push(
    hasRoutePolicy(routeRegistry, '/order/[id]', 'topNavBehavior', 'close')
      ? pass('QA_ORDER_TICKET_ROUTE_CLOSE', '/order/[id] declares close top navigation', 'src/navigation/routeRegistry.ts')
      : fail('ORDER_TICKET_ROUTE_BACK', '/order/[id] must use close top navigation', 'src/navigation/routeRegistry.ts'),
  );
  checks.push(
    /<Screen\b[\s\S]*leftAction=["']close["']/.test(discoverLayout) && !/<Screen\b[^>]*\bback\b/.test(discoverLayout)
      ? pass('QA_DISCOVER_LAYOUT_CLOSE_ICON', 'DiscoverLayoutScreen uses Close instead of Back', 'src/screens/discover/DiscoverLayoutScreen.tsx')
      : fail('DISCOVER_LAYOUT_BACK_ICON', 'DiscoverLayoutScreen root modal must use Close, not Screen back', 'src/screens/discover/DiscoverLayoutScreen.tsx'),
  );
  checks.push(
    /<Screen\b[\s\S]*leftAction=["']close["']/.test(orderTicket)
      ? pass('QA_ORDER_TICKET_CLOSE_ICON', 'OrderTicketScreen uses Close on full-screen modal root', 'src/screens/trading/OrderTicketScreen.tsx')
      : fail('ORDER_TICKET_MISSING_CLOSE', 'OrderTicketScreen full-screen modal root must use Close', 'src/screens/trading/OrderTicketScreen.tsx'),
  );

  return checks;
}

function checkPrivateOverlaysAreBlocked() {
  const files = walk('src')
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter((file) => !file.includes(`${path.sep}components${path.sep}BottomSheet.tsx`))
    .filter((file) => !file.includes(`${path.sep}components${path.sep}ProductControlPanel.tsx`));
  const checks = [];
  const privateOverlayPatterns = [
    { id: 'PRIVATE_PAN_RESPONDER_SHEET', pattern: /PanResponder\.create/, message: 'must not create private PanResponder sheet interactions' },
    { id: 'PRIVATE_MODAL_BACKDROP', pattern: /modalBackdrop|backdropPressTarget|sheetMotionLayer|ticketSheet|handleWrap/, message: 'must not create private modal backdrop or sheet shell' },
  ];

  for (const file of files) {
    const text = read(file);
    for (const item of privateOverlayPatterns) {
      if (item.pattern.test(text)) {
        checks.push(fail(item.id, `${file} ${item.message}`, file));
      }
    }
  }

  if (!checks.length) {
    checks.push(pass('QA_PRIVATE_OVERLAY_BLOCKED', 'No private sheet/backdrop/PanResponder overlay implementation outside registered public hosts', 'src/design-public-assets/overlays/registry/overlay-registry.json'));
  }

  return checks;
}

function checkDirtyGuardCopy() {
  const translations = read('src/i18n/translations.ts');
  const orderTicket = read('src/screens/trading/OrderTicketScreen.tsx');
  const discoverLayout = read('src/screens/discover/DiscoverLayoutScreen.tsx');
  const checks = [];
  const keys = [
    'overlay.dirty.generic.title',
    'overlay.dirty.generic.body',
    'overlay.dirty.continueEditing',
    'overlay.dirty.leave',
  ];

  for (const key of keys) {
    checks.push(
      translations.includes(`"${key}"`)
        ? pass(`QA_DIRTY_COPY_${key}`, `i18n contains ${key}`, 'src/i18n/translations.ts')
        : fail(`DIRTY_COPY_MISSING_${key}`, `i18n must contain ${key}`, 'src/i18n/translations.ts'),
    );
  }

  checks.push(
    orderTicket.includes('t("overlay.dirty.continueEditing")') && orderTicket.includes('t("overlay.dirty.leave")')
      ? pass('QA_ORDER_DIRTY_COPY_STANDARD', 'OrderTicketScreen uses standardized dirty action labels', 'src/screens/trading/OrderTicketScreen.tsx')
      : fail('ORDER_DIRTY_COPY_LEGACY', 'OrderTicketScreen must use standardized dirty action labels', 'src/screens/trading/OrderTicketScreen.tsx'),
  );
  checks.push(
    discoverLayout.includes("t('overlay.dirty.generic.title')") && discoverLayout.includes("t('overlay.dirty.generic.body')")
      ? pass('QA_DISCOVER_LAYOUT_DIRTY_COPY_STANDARD', 'DiscoverLayoutScreen uses standardized generic dirty copy', 'src/screens/discover/DiscoverLayoutScreen.tsx')
      : fail('DISCOVER_LAYOUT_DIRTY_COPY_MISSING', 'DiscoverLayoutScreen must use standardized generic dirty confirmation copy', 'src/screens/discover/DiscoverLayoutScreen.tsx'),
  );

  return checks;
}

function checkNavigationPolicyContracts() {
  const text = read('src/navigation/navigationPolicy.ts');
  const required = [
    'export type ScreenType',
    'export type LeftAction',
    'export type BackBehavior',
    'export type GesturePolicy',
    'export type NavigationContract',
    'export type OverlayContract',
    'export async function handleGlobalBack',
    'export async function handleCloseIntent',
    'export function handleCancelIntent',
  ];

  return required.map((value) =>
    text.includes(value)
      ? pass(`QA_NAV_POLICY_${value}`, `navigationPolicy contains ${value}`, 'src/navigation/navigationPolicy.ts')
      : fail(`NAV_POLICY_MISSING_${value}`, `navigationPolicy must contain ${value}`, 'src/navigation/navigationPolicy.ts'),
  );
}

function checkModalStackSemantics() {
  const text = read('src/components/ModalStack.tsx');
  const required = ['backInModal', 'closeRootModal', 'dismissModalStack'];

  return required.map((value) =>
    text.includes(value)
      ? pass(`QA_MODAL_STACK_${value}`, `ModalStack exposes ${value}`, 'src/components/ModalStack.tsx')
      : fail(`MODAL_STACK_MISSING_${value}`, `ModalStack must expose ${value}`, 'src/components/ModalStack.tsx'),
  );
}

function hasRoutePolicy(text, routePath, field, expected) {
  const routeIndex = text.indexOf(`path: '${routePath}'`);
  if (routeIndex < 0) {
    return false;
  }

  const nextRouteIndex = text.indexOf('\n  {', routeIndex + 1);
  const body = nextRouteIndex < 0 ? text.slice(routeIndex) : text.slice(routeIndex, nextRouteIndex);

  if (body.includes(`${field}: '${expected}'`)) {
    return true;
  }

  if (routePath === '/order/[id]' && expected === 'close' && body.includes('...closeToTrade')) {
    return true;
  }

  if (routePath === '/discover-layout' && expected === 'close' && body.includes('...closeToDiscover')) {
    return true;
  }

  return false;
}
