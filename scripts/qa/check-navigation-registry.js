const path = require('path');

const { complete, fail, pass, read, walk } = require('./qa-utils.cjs');

const routeRegistryFile = 'src/navigation/routeRegistry.ts';
const modalRegistryFile = 'src/navigation/modalRegistry.ts';
const rootLayoutFile = 'src/screens/navigation/RootLayout.tsx';

const routeRegistryText = read(routeRegistryFile);
const modalRegistryText = read(modalRegistryFile);
const rootLayoutText = read(rootLayoutFile);

const checks = [
  ...checkAppRoutesRegistered(),
  ...checkRouteNavigationPolicies(),
  ...checkRelatedModalsRegistered(),
  ...checkModalRouteability(),
  ...checkRouteableModalCloseFallbacks(),
  ...checkTransparentModalRoutes(),
  ...checkUnsafeRouterBackUsage(),
  ...checkRequiredDocsFields(),
];

complete('qa:navigation-registry', checks);

function checkAppRoutesRegistered() {
  const routePaths = collectRouteRegistryPaths();
  const appRoutes = walk('app')
    .filter((file) => file.endsWith('.tsx'))
    .filter((file) => !isInfrastructureRoute(file))
    .map(appFileToRoutePath);

  return appRoutes.map((routePath) =>
    routePaths.has(routePath)
      ? pass(`QA_NAV_ROUTE_${routePath}`, `Registered route ${routePath}`, routeRegistryFile)
      : fail(`QA_NAV_ROUTE_${routePath}`, `Missing routeRegistry entry for ${routePath}`, routeRegistryFile),
  );
}

function checkRelatedModalsRegistered() {
  const modalIds = collectModalIds();
  const relatedIds = collectRelatedModalIds();

  return relatedIds.map((modalId) =>
    modalIds.has(modalId)
      ? pass(`QA_NAV_MODAL_REF_${modalId}`, `Registered related modal ${modalId}`, modalRegistryFile)
      : fail(`QA_NAV_MODAL_REF_${modalId}`, `relatedModals references missing modalRegistry id ${modalId}`, modalRegistryFile),
  );
}

function checkRouteNavigationPolicies() {
  const entries = collectRouteEntryObjects();
  const checks = [];
  const authCloseRoutes = new Set(['/auth', '/auth/register', '/auth/onboarding', '/auth/forgot-password']);
  const authBackRoutes = new Set(['/auth/register-email-code', '/auth/register-phone', '/auth/register-phone-code', '/auth/register-password']);

  for (const entry of entries) {
    if (!entry.topNavBehavior) {
      checks.push(fail(`MISSING_NAV_BEHAVIOR_${entry.path}`, `${entry.path} must declare topNavBehavior`, routeRegistryFile));
      continue;
    }

    checks.push(pass(`QA_NAV_BEHAVIOR_${entry.path}`, `${entry.path} declares topNavBehavior ${entry.topNavBehavior}`, routeRegistryFile));

    if (entry.topNavBehavior === 'back' && !entry.backTarget) {
      checks.push(fail(`MISSING_BACK_FALLBACK_${entry.path}`, `${entry.path} uses back navigation without backTarget`, routeRegistryFile));
    }

    if (entry.topNavBehavior === 'close' && !entry.closeTarget) {
      checks.push(fail(`MISSING_CLOSE_FALLBACK_${entry.path}`, `${entry.path} uses close navigation without closeTarget`, routeRegistryFile));
    }

    if (authCloseRoutes.has(entry.path) && entry.topNavBehavior !== 'close') {
      checks.push(fail(`AUTH_CLOSE_BACK_MISMATCH_${entry.path}`, `${entry.path} must use close top navigation`, routeRegistryFile));
    }

    if (authBackRoutes.has(entry.path) && entry.topNavBehavior !== 'back') {
      checks.push(fail(`AUTH_CLOSE_BACK_MISMATCH_${entry.path}`, `${entry.path} must use back top navigation`, routeRegistryFile));
    }
  }

  return checks;
}

function checkModalRouteability() {
  const routePaths = collectRouteRegistryPaths();
  const entries = collectModalEntryObjects();
  const checks = [];

  for (const entry of entries) {
    if (entry.routeable === false && entry.routePath) {
      checks.push(fail(`QA_NAV_MODAL_NON_ROUTEABLE_${entry.id}`, `${entry.id} is routeable false but defines routePath`, modalRegistryFile));
      continue;
    }

    if (entry.routeable === false) {
      checks.push(pass(`QA_NAV_MODAL_NON_ROUTEABLE_${entry.id}`, `${entry.id} is non-routeable and has no routePath`, modalRegistryFile));
      continue;
    }

    if (!entry.routePath) {
      checks.push(fail(`QA_NAV_MODAL_ROUTEABLE_PATH_${entry.id}`, `${entry.id} is routeable true but has no routePath`, modalRegistryFile));
      continue;
    }

    checks.push(
      routePaths.has(entry.routePath)
        ? pass(`QA_NAV_MODAL_ROUTEABLE_PATH_${entry.id}`, `${entry.id} routePath exists in routeRegistry`, modalRegistryFile)
        : fail(`QA_NAV_MODAL_ROUTEABLE_PATH_${entry.id}`, `${entry.id} routePath ${entry.routePath} is missing from routeRegistry`, modalRegistryFile),
    );
  }

  return checks;
}

function checkRouteableModalCloseFallbacks() {
  const entries = collectModalEntryObjects();

  return entries
    .filter((entry) => entry.routeable)
    .map((entry) =>
      entry.modalCloseBehavior === 'backOrFallback' && entry.closeFallback
        ? pass(`QA_ROUTEABLE_MODAL_CLOSE_FALLBACK_${entry.id}`, `${entry.id} declares close fallback ${entry.closeFallback}`, modalRegistryFile)
        : fail(
            `ROUTEABLE_MODAL_MISSING_CLOSE_FALLBACK_${entry.id}`,
            `${entry.id} must use modalCloseBehavior backOrFallback and define closeFallback`,
            modalRegistryFile,
          ),
    );
}

function checkUnsafeRouterBackUsage() {
  const files = walk('src')
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
    .filter((file) => file !== 'src/navigation/navigationPolicy.ts')
    .filter((file) => !file.includes(`${path.sep}assets${path.sep}`));
  const checks = [];

  for (const file of files) {
    const text = read(file);
    if (text.includes('router.back(') || text.includes('router.canGoBack(')) {
      checks.push(fail('UNSAFE_ROUTER_BACK', `${file} must use navigationPolicy fallback helpers instead of direct router.back/canGoBack`, file));
    }
  }

  if (checks.length === 0) {
    checks.push(pass('QA_UNSAFE_ROUTER_BACK', 'No direct router.back/canGoBack usage outside navigationPolicy', 'src/navigation/navigationPolicy.ts'));
  }

  return checks;
}

function checkTransparentModalRoutes() {
  const transparentRoutes = [...rootLayoutText.matchAll(/<Stack\.Screen\s+name="([^"]+)"(?:(?!<Stack\.Screen)[\s\S])*?presentation:\s*'transparentModal'(?:(?!<Stack\.Screen)[\s\S])*?\/>/g)]
    .map((match) => stackNameToRoutePath(match[1]));
  const routeableModalPaths = collectModalEntryObjects()
    .filter((entry) => entry.routeable)
    .map((entry) => entry.routePath)
    .filter(Boolean);

  const checks = transparentRoutes.map((routePath) =>
    routeableModalPaths.includes(routePath)
      ? pass(`QA_NAV_TRANSPARENT_${routePath}`, `${routePath} has routeable modal registry entry`, modalRegistryFile)
      : fail(`QA_NAV_TRANSPARENT_${routePath}`, `${routePath} uses transparentModal but has no routeable modalRegistry entry`, modalRegistryFile),
  );

  for (const routePath of routeableModalPaths) {
    checks.push(
      transparentRoutes.includes(routePath)
        ? pass(`QA_NAV_ROUTEABLE_PRESENTATION_${routePath}`, `${routePath} routeable modal matches RootLayout transparentModal`, rootLayoutFile)
        : fail(`QA_NAV_ROUTEABLE_PRESENTATION_${routePath}`, `${routePath} is routeable but RootLayout does not declare transparentModal`, rootLayoutFile),
    );
  }

  return checks;
}

function checkRequiredDocsFields() {
  const pageMap = read('docs/02-page-map.md');
  const modalMap = read('docs/modal-map.md');
  const triggerMap = read('docs/page-modal-trigger-map.md');
  const checks = [];

  [
    'Route path',
    'Page component',
    'Module',
    'Permission',
    'Navigation level',
    'Primary actions',
    'Related modals',
    'Empty / loading / error states',
  ].forEach((field) => {
    checks.push(
      pageMap.includes(field)
        ? pass(`QA_NAV_PAGE_FIELD_${field}`, `Page map includes ${field}`, 'docs/02-page-map.md')
        : fail(`QA_NAV_PAGE_FIELD_${field}`, `Page map missing ${field}`, 'docs/02-page-map.md'),
    );
  });

  [
    'Modal id',
    'Modal component',
    'Trigger page',
    'Trigger action',
    'Routeable',
    'Close behavior',
    'Confirm behavior',
    'Risk level',
  ].forEach((field) => {
    checks.push(
      modalMap.includes(field)
        ? pass(`QA_NAV_MODAL_FIELD_${field}`, `Modal map includes ${field}`, 'docs/modal-map.md')
        : fail(`QA_NAV_MODAL_FIELD_${field}`, `Modal map missing ${field}`, 'docs/modal-map.md'),
    );
  });

  ['Page route', 'Trigger action', 'Modal id', 'Result / routeability'].forEach((field) => {
    checks.push(
      triggerMap.includes(field)
        ? pass(`QA_NAV_TRIGGER_FIELD_${field}`, `Trigger map includes ${field}`, 'docs/page-modal-trigger-map.md')
        : fail(`QA_NAV_TRIGGER_FIELD_${field}`, `Trigger map missing ${field}`, 'docs/page-modal-trigger-map.md'),
    );
  });

  return checks;
}

function collectRouteRegistryPaths() {
  return new Set([...routeRegistryText.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]));
}

function collectRouteEntryObjects() {
  const entries = [];
  const entryRegex = /\{\s*path:\s*'([^']+)'([\s\S]*?)(?=\n\s*\},|\n\s*\] as const)/g;
  let match;

  while ((match = entryRegex.exec(routeRegistryText)) !== null) {
    const [, path, body] = match;
    const spreadPolicy = resolveRoutePolicySpread(body);
    entries.push({
      path,
      topNavBehavior: body.match(/topNavBehavior:\s*'([^']+)'/)?.[1] ?? spreadPolicy.topNavBehavior,
      backTarget: body.match(/backTarget:\s*'([^']+)'/)?.[1] ?? spreadPolicy.backTarget,
      closeTarget: body.match(/closeTarget:\s*'([^']+)'/)?.[1] ?? spreadPolicy.closeTarget,
    });
  }

  return entries;
}

function resolveRoutePolicySpread(body) {
  const spreads = {
    backToAccounts: { backTarget: '/accounts', topNavBehavior: 'back' },
    backToDiscover: { backTarget: '/discover', topNavBehavior: 'back' },
    backToFunding: { backTarget: '/funding', topNavBehavior: 'back' },
    backToMarkets: { backTarget: '/markets', topNavBehavior: 'back' },
    backToSettings: { backTarget: '/settings', topNavBehavior: 'back' },
    backToTrade: { backTarget: '/trade', topNavBehavior: 'back' },
    closeToLaunch: { closeTarget: '/launch', topNavBehavior: 'close' },
    noTopNav: { topNavBehavior: 'none' },
    systemTopNav: { topNavBehavior: 'system' },
  };

  for (const [name, policy] of Object.entries(spreads)) {
    if (body.includes(`...${name}`)) {
      return policy;
    }
  }

  return {};
}

function collectRelatedModalIds() {
  const ids = new Set();
  const relatedBlocks = [...routeRegistryText.matchAll(/relatedModals:\s*\[([\s\S]*?)\]/g)].map((match) => match[1]);

  for (const block of relatedBlocks) {
    for (const match of block.matchAll(/'([^']+)'/g)) {
      ids.add(match[1]);
    }
  }

  return [...ids];
}

function collectModalIds() {
  return new Set([...modalRegistryText.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]));
}

function collectModalEntryObjects() {
  const entries = [];
  const entryRegex = /\{\s*id:\s*'([^']+)'([\s\S]*?)(?=\n\s*\},|\n\s*\] as const)/g;
  let match;

  while ((match = entryRegex.exec(modalRegistryText)) !== null) {
    const [, id, body] = match;
    const routeableMatch = body.match(/routeable:\s*(true|false)/);
    const routePathMatch = body.match(/routePath:\s*'([^']+)'/);

    entries.push({
      id,
      routeable: routeableMatch ? routeableMatch[1] === 'true' : undefined,
      routePath: routePathMatch?.[1],
      modalCloseBehavior: body.match(/modalCloseBehavior:\s*'([^']+)'/)?.[1],
      closeFallback: body.match(/closeFallback:\s*'([^']+)'/)?.[1],
    });
  }

  return entries;
}

function isInfrastructureRoute(file) {
  const normalized = file.split(path.sep).join('/');

  return normalized === 'app/_layout.tsx' || normalized === 'app/(tabs)/_layout.tsx' || normalized === 'app/+html.tsx';
}

function appFileToRoutePath(file) {
  const normalized = file.split(path.sep).join('/');

  if (normalized === 'app/+not-found.tsx') {
    return '/(not-found)';
  }

  const segments = normalized
    .replace(/^app\//, '')
    .replace(/\.tsx$/, '')
    .split('/')
    .filter((segment) => !segment.startsWith('(') || !segment.endsWith(')'));
  const withoutIndex = segments[segments.length - 1] === 'index' ? segments.slice(0, -1) : segments;

  return `/${withoutIndex.join('/')}`;
}

function stackNameToRoutePath(name) {
  if (name === 'index') {
    return '/';
  }

  return `/${name}`;
}
