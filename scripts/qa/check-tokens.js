const { complete, exists, fail, pass, read, requireFiles } = require('./qa-utils.cjs');

const packageJsonPath = 'packages/design-tokens/package.json';
const tokenIndexPath = 'packages/design-tokens/registry/tokens.json';
const colorTokenPath = 'packages/design-tokens/registry/tokens.color.json';
const modeMatrixPath = 'packages/design-tokens/registry/token-mode.matrix.json';
const exportMapPath = 'packages/design-tokens/registry/token-export.map.json';
const runtimeTokenPath = 'packages/design-tokens/src/tokens.ts';
const compatibilityRuntimeTokenPath = 'src/theme/tokens.ts';
const runtimeColorPath = 'packages/design-tokens/src/colors.ts';
const compatibilityRuntimeColorPath = 'src/theme/colors.ts';
const changelogPath = 'packages/design-tokens/CHANGELOG.md';

function readJson(path) {
  return JSON.parse(read(path));
}

const checks = [
  ...requireFiles([
    packageJsonPath,
    'packages/design-tokens/VERSION.md',
    changelogPath,
    'packages/design-tokens/README.md',
    tokenIndexPath,
    colorTokenPath,
    'packages/design-tokens/registry/token.schema.json',
    modeMatrixPath,
    exportMapPath,
    'packages/design-tokens/registry/token-alias.map.json',
    'packages/design-tokens/qa/token-qa.rules.json',
    runtimeTokenPath,
    runtimeColorPath,
    'packages/design-tokens/mappings/css-variable.mapping.css',
    'packages/design-tokens/mappings/tailwind.mapping.js',
  ], 'QA_TOKENS_FILE'),
];

if (exists(packageJsonPath) && exists(tokenIndexPath) && exists(changelogPath)) {
  const packageJson = readJson(packageJsonPath);
  const tokenIndex = readJson(tokenIndexPath);
  const changelog = read(changelogPath);

  checks.push(
    packageJson.name === '@dpf/design-tokens'
      ? pass('QA_TOKENS_PACKAGE_NAME', 'Token package name is governed', packageJsonPath)
      : fail('QA_TOKENS_PACKAGE_NAME', 'Token package name must be @dpf/design-tokens', packageJsonPath),
  );

  checks.push(
    packageJson.version === tokenIndex.version || changelog.includes(packageJson.version)
      ? pass('QA_TOKENS_VERSION', 'Token package version is recorded in package metadata or changelog', packageJsonPath)
      : fail('QA_TOKENS_VERSION', 'Token package version must match token index or be recorded in CHANGELOG.md', packageJsonPath),
  );
}

if (exists(modeMatrixPath)) {
  const matrix = readJson(modeMatrixPath);
  for (const mode of ['darkTerminal', 'lightBroker', 'midnightBlue']) {
    checks.push(
      matrix.modes?.[mode]
        ? pass('QA_TOKENS_MODE', `${mode} mode exists`, modeMatrixPath)
        : fail('QA_TOKENS_MODE', `${mode} mode is required`, modeMatrixPath),
    );
  }
}

if (exists(exportMapPath)) {
  const exportMap = readJson(exportMapPath);
  const text = JSON.stringify(exportMap);
  for (const required of ['src/theme/tokens.ts', 'src/theme/colors.ts']) {
    checks.push(
      text.includes(required)
        ? pass('QA_TOKENS_COMPAT_EXPORT', `${required} compatibility export is mapped`, exportMapPath)
        : fail('QA_TOKENS_COMPAT_EXPORT', `${required} compatibility export must be mapped`, exportMapPath),
    );
  }
}

if (exists(runtimeTokenPath) && exists(compatibilityRuntimeTokenPath) && exists(tokenIndexPath) && exists(exportMapPath)) {
  const runtimeText = read(runtimeTokenPath);
  const compatibilityRuntimeText = read(compatibilityRuntimeTokenPath);
  const tokenIndexText = read(tokenIndexPath);
  const exportMapText = read(exportMapPath);
  const cssMappingText = read('packages/design-tokens/mappings/css-variable.mapping.css');
  const tailwindMappingText = read('packages/design-tokens/mappings/tailwind.mapping.js');
  const engineeringCssMappingText = read('design-system-engineering/08_code_mapping/css-variable.mapping.css');
  const engineeringTailwindMappingText = read('design-system-engineering/08_code_mapping/tailwind.mapping.js');
  const radiusDocsText = exists('design-system/01-tokens/radius-tokens.md') ? read('design-system/01-tokens/radius-tokens.md') : '';
  const semanticSpacingRoles = [
    'contentCardPaddingX',
    'contentPlainPaddingX',
    'topBarPaddingX',
    'screenBottomPadding',
    'safeAreaBottom',
    'moduleGap',
    'sectionGap',
    'sectionGapLarge',
    'cardPaddingX',
    'cardPaddingY',
    'cardPaddingCompactX',
    'cardPaddingCompactY',
    'cardPadding',
    'cardPaddingCompact',
    'listRowPaddingX',
    'listRowPaddingY',
    'formFieldTextInset',
    'formGroupGap',
    'fieldGap',
    'inlineGap',
    'controlGap',
    'sheetContentGap',
    'sheetContentPaddingX',
    'sheetContentPaddingBottom',
    'sheetFooterGap',
    'sheetFooterPaddingBottom',
    'quoteGroupGap',
    'dataRowGap',
  ];

  semanticSpacingRoles.forEach((role) => {
    const runtimePattern = new RegExp(`${role}:\\s*spacing\\.`);
    const registryPattern = new RegExp(`"${role}"\\s*:\\s*"layout\\.${role}`);
    checks.push(
      runtimePattern.test(runtimeText) && runtimePattern.test(compatibilityRuntimeText)
        ? pass('QA_TOKENS_SEMANTIC_SPACING_RUNTIME', `layout.${role} is exported in runtime token layers`, runtimeTokenPath)
        : fail('QA_TOKENS_SEMANTIC_SPACING_RUNTIME', `layout.${role} must exist in package and compatibility runtime tokens`, runtimeTokenPath),
    );
    checks.push(
      registryPattern.test(tokenIndexText)
        ? pass('QA_TOKENS_SEMANTIC_SPACING_REGISTRY', `layout.${role} is registered`, tokenIndexPath)
        : fail('QA_TOKENS_SEMANTIC_SPACING_REGISTRY', `layout.${role} must be registered in semanticSpacingRoleMap`, tokenIndexPath),
    );
  });

  checks.push(
    /contentCardPaddingX:\s*spacing\.md/.test(runtimeText)
      && /contentPlainPaddingX:\s*spacing\.lg/.test(runtimeText)
      && /topBarPaddingX:\s*spacing\.lg/.test(runtimeText)
      && /safeAreaBottom:\s*spacing\.none/.test(runtimeText)
      && /sheetContentPaddingX:\s*spacing\.lg/.test(runtimeText)
      && /sheetContentPaddingBottom:\s*spacing\.xl/.test(runtimeText)
      && /sheetFooterPaddingBottom:\s*spacing\.lg/.test(runtimeText)
      && /listRowPaddingX:\s*spacing\.md/.test(runtimeText)
      && /contentCardPaddingX:\s*spacing\.md/.test(compatibilityRuntimeText)
      && /contentPlainPaddingX:\s*spacing\.lg/.test(compatibilityRuntimeText)
      && /topBarPaddingX:\s*spacing\.lg/.test(compatibilityRuntimeText)
      && /safeAreaBottom:\s*spacing\.none/.test(compatibilityRuntimeText)
      && /sheetContentPaddingX:\s*spacing\.lg/.test(compatibilityRuntimeText)
      && /sheetContentPaddingBottom:\s*spacing\.xl/.test(compatibilityRuntimeText)
      && /sheetFooterPaddingBottom:\s*spacing\.lg/.test(compatibilityRuntimeText)
      && /listRowPaddingX:\s*spacing\.md/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_CONTENT_INSET_RUNTIME', 'Full-site content inset tokens export 12px page card/list and 16px plain/header/BottomSheet content contracts', runtimeTokenPath)
      : fail('QA_TOKENS_CONTENT_INSET_RUNTIME', 'Content inset tokens must map page card/list to spacing.md and plain/header/BottomSheet content to spacing.lg in both runtime token layers', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('contentCardPaddingX')
      && tokenIndexText.includes('contentPlainPaddingX')
      && tokenIndexText.includes('topBarPaddingX')
      && tokenIndexText.includes('sheetContentPaddingX / 16')
      && tokenIndexText.includes('sheetContentPaddingBottom / 24')
      && tokenIndexText.includes('sheetFooterPaddingBottom / 16')
      && tokenIndexText.includes('listRowPaddingX / 12')
      ? pass('QA_TOKENS_CONTENT_INSET_REGISTRY', 'Full-site and BottomSheet content inset token contracts are registered', tokenIndexPath)
      : fail('QA_TOKENS_CONTENT_INSET_REGISTRY', 'Token registry must document card/plain/top-bar/sheet-content/list-row horizontal inset contracts', tokenIndexPath),
  );
  checks.push(
    /semanticSpacing/.test(exportMapText)
      ? pass('QA_TOKENS_SEMANTIC_SPACING_EXPORT', 'Semantic spacing roles are represented in the token export map', exportMapPath)
      : fail('QA_TOKENS_SEMANTIC_SPACING_EXPORT', 'Token export map must include semanticSpacing metadata', exportMapPath),
  );
  checks.push(
    /--layout-content-card-padding-x:\s*12px/.test(cssMappingText)
      && /--layout-content-plain-padding-x:\s*16px/.test(cssMappingText)
      && /--layout-list-row-padding-x:\s*12px/.test(cssMappingText)
      && /--layout-safe-area-bottom:\s*env\(safe-area-inset-bottom, 0px\)/.test(cssMappingText)
      && /--layout-sheet-content-padding-bottom:\s*24px/.test(cssMappingText)
      && /--layout-sheet-footer-padding-bottom:\s*16px/.test(cssMappingText)
      && /--safe-area-bottom:\s*var\(--layout-safe-area-bottom\)/.test(cssMappingText)
      && /--sheet-footer-padding-bottom:\s*var\(--layout-sheet-footer-padding-bottom\)/.test(cssMappingText)
      && /--layout-bottom-action-area-padding-x:\s*16px/.test(cssMappingText)
      && /--layout-content-card-padding-x:\s*12px/.test(engineeringCssMappingText)
      && /--layout-content-plain-padding-x:\s*16px/.test(engineeringCssMappingText)
      && /--layout-list-row-padding-x:\s*12px/.test(engineeringCssMappingText)
      && /--layout-safe-area-bottom:\s*env\(safe-area-inset-bottom, 0px\)/.test(engineeringCssMappingText)
      && /--layout-sheet-content-padding-bottom:\s*24px/.test(engineeringCssMappingText)
      && /--layout-sheet-footer-padding-bottom:\s*16px/.test(engineeringCssMappingText)
      && /--safe-area-bottom:\s*var\(--layout-safe-area-bottom\)/.test(engineeringCssMappingText)
      && /--sheet-footer-padding-bottom:\s*var\(--layout-sheet-footer-padding-bottom\)/.test(engineeringCssMappingText)
      && /--layout-bottom-action-area-padding-x:\s*16px/.test(engineeringCssMappingText)
      ? pass('QA_TOKENS_SEMANTIC_SPACING_CSS_MAPPING', 'CSS mappings expose governed 12px/16px horizontal spacing and BottomSheet safe-area aliases', 'packages/design-tokens/mappings/css-variable.mapping.css')
      : fail('QA_TOKENS_SEMANTIC_SPACING_CSS_MAPPING', 'CSS mappings must expose contentCard, contentPlain, listRow, bottomAction, and BottomSheet safe-area roles', 'packages/design-tokens/mappings/css-variable.mapping.css'),
  );
  checks.push(
    /"content-card-padding-x":\s*"var\(--layout-content-card-padding-x\)"/.test(tailwindMappingText)
      && /"content-plain-padding-x":\s*"var\(--layout-content-plain-padding-x\)"/.test(tailwindMappingText)
      && /"list-row-padding-x":\s*"var\(--layout-list-row-padding-x\)"/.test(tailwindMappingText)
      && /"safe-area-bottom":\s*"var\(--layout-safe-area-bottom\)"/.test(tailwindMappingText)
      && /"sheet-content-padding-bottom":\s*"var\(--layout-sheet-content-padding-bottom\)"/.test(tailwindMappingText)
      && /"sheet-footer-padding-bottom":\s*"var\(--layout-sheet-footer-padding-bottom\)"/.test(tailwindMappingText)
      && /"bottom-action-area-padding-x":\s*"var\(--layout-bottom-action-area-padding-x\)"/.test(tailwindMappingText)
      && /"content-card-padding-x":\s*"var\(--layout-content-card-padding-x\)"/.test(engineeringTailwindMappingText)
      && /"content-plain-padding-x":\s*"var\(--layout-content-plain-padding-x\)"/.test(engineeringTailwindMappingText)
      && /"list-row-padding-x":\s*"var\(--layout-list-row-padding-x\)"/.test(engineeringTailwindMappingText)
      && /"safe-area-bottom":\s*"var\(--layout-safe-area-bottom\)"/.test(engineeringTailwindMappingText)
      && /"sheet-content-padding-bottom":\s*"var\(--layout-sheet-content-padding-bottom\)"/.test(engineeringTailwindMappingText)
      && /"sheet-footer-padding-bottom":\s*"var\(--layout-sheet-footer-padding-bottom\)"/.test(engineeringTailwindMappingText)
      && /"bottom-action-area-padding-x":\s*"var\(--layout-bottom-action-area-padding-x\)"/.test(engineeringTailwindMappingText)
      ? pass('QA_TOKENS_SEMANTIC_SPACING_TAILWIND_MAPPING', 'Tailwind mappings expose governed 12px/16px horizontal spacing roles', 'packages/design-tokens/mappings/tailwind.mapping.js')
      : fail('QA_TOKENS_SEMANTIC_SPACING_TAILWIND_MAPPING', 'Tailwind mappings must expose contentCard, contentPlain, listRow, and bottomAction horizontal spacing roles', 'packages/design-tokens/mappings/tailwind.mapping.js'),
  );
  checks.push(
    /screenBottomPadding:\s*spacing\.xxl/.test(runtimeText) && /screenBottomPadding:\s*spacing\.xxl/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_SCREEN_SAFE_BOTTOM_RUNTIME', 'layout.screenBottomPadding is exported in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_SCREEN_SAFE_BOTTOM_RUNTIME', 'layout.screenBottomPadding must stay in package and compatibility runtime tokens', runtimeTokenPath),
  );
  checks.push(
    /button:\s*\{[\s\S]*?sm:\s*40[\s\S]*?md:\s*48[\s\S]*?lg:\s*56[\s\S]*?xl:\s*64[\s\S]*?minHeight:\s*48/m.test(runtimeText)
      && /button:\s*\{[\s\S]*?sm:\s*40[\s\S]*?md:\s*48[\s\S]*?lg:\s*56[\s\S]*?xl:\s*64[\s\S]*?minHeight:\s*48/m.test(compatibilityRuntimeText)
      && /buttonSm:\s*\{[\s\S]*?fontSize:\s*14[\s\S]*?fontWeight:\s*'600'[\s\S]*?lineHeight:\s*18/m.test(runtimeText)
      && /buttonSm:\s*\{[\s\S]*?fontSize:\s*14[\s\S]*?fontWeight:\s*'600'[\s\S]*?lineHeight:\s*18/m.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_BUTTON_SIZE_RUNTIME', 'ActionButton sm/md/lg/xl size roles and buttonSm typography are exported in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_BUTTON_SIZE_RUNTIME', 'ActionButton size roles and buttonSm typography must exist in package and compatibility runtime tokens', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('buttonSizeRoleMap')
      && tokenIndexText.includes('size.button.sm / 40')
      && tokenIndexText.includes('size.button.md / 48')
      && tokenIndexText.includes('size.button.lg / 56')
      && tokenIndexText.includes('size.button.xl / 64')
      && tokenIndexText.includes('buttonTypographyRoleMap')
      && tokenIndexText.includes('typography.buttonSm / 14px')
      ? pass('QA_TOKENS_BUTTON_SIZE_REGISTRY', 'ActionButton size and typography roles are registered', tokenIndexPath)
      : fail('QA_TOKENS_BUTTON_SIZE_REGISTRY', 'Token registry must document ActionButton size and typography role maps', tokenIndexPath),
  );
  checks.push(
    tokenIndexText.includes('screenBottomPadding') && tokenIndexText.includes('device bottom safe-area inset in Screen')
      ? pass('QA_TOKENS_SCREEN_SAFE_BOTTOM_REGISTRY', 'layout.screenBottomPadding documents Screen safe-area composition', tokenIndexPath)
      : fail('QA_TOKENS_SCREEN_SAFE_BOTTOM_REGISTRY', 'layout.screenBottomPadding must document Screen safe-area composition', tokenIndexPath),
  );
  checks.push(
    /appDeviceWidth:\s*390/.test(runtimeText)
      && /appDeviceHeight:\s*844/.test(runtimeText)
      && /appMaxWidth:\s*size\.viewport\.appDeviceWidth/.test(runtimeText)
      && /appPreviewSafeAreaTop:\s*47/.test(runtimeText)
      && /appPreviewSafeAreaBottom:\s*34/.test(runtimeText)
      && /appDeviceWidth:\s*390/.test(compatibilityRuntimeText)
      && /appDeviceHeight:\s*844/.test(compatibilityRuntimeText)
      && /appMaxWidth:\s*size\.viewport\.appDeviceWidth/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_APP_PREVIEW_DEVICE_RUNTIME', 'Codex app preview device dimensions are fixed to 390 x 844 in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_APP_PREVIEW_DEVICE_RUNTIME', 'App preview device tokens must declare width 390, height 844, and appMaxWidth as appDeviceWidth in both runtime token layers', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('appDeviceWidth')
      && tokenIndexText.includes('390 Codex web preview native app canvas width')
      && tokenIndexText.includes('appDeviceHeight')
      && tokenIndexText.includes('844 Codex web preview native app canvas height')
      && tokenIndexText.includes('appPreviewSafeAreaInsets')
      ? pass('QA_TOKENS_APP_PREVIEW_DEVICE_REGISTRY', 'Codex app preview device dimensions and safe-area roles are registered', tokenIndexPath)
      : fail('QA_TOKENS_APP_PREVIEW_DEVICE_REGISTRY', 'Token registry must document appDeviceWidth, appDeviceHeight, and appPreviewSafeAreaInsets', tokenIndexPath),
  );
  checks.push(
    /export const zIndex\s*=\s*\{[\s\S]*?toast:\s*90[\s\S]*?bottomSheetBackdrop:\s*1000[\s\S]*?bottomSheet:\s*1001[\s\S]*?webSelect:\s*1050[\s\S]*?modalStack:\s*1100[\s\S]*?modalQueue:\s*1200/m.test(runtimeText)
      && /export const motion\s*=\s*\{[\s\S]*?overlay:\s*\{[\s\S]*?fastMs:\s*160[\s\S]*?standardMs:\s*220[\s\S]*?cleanupDelayMs:\s*260/m.test(runtimeText)
      && /zIndexRoleMap/.test(tokenIndexText)
      && /motionRoleMap/.test(tokenIndexText)
      && /overlayZIndex/.test(exportMapText)
      && /overlayMotion/.test(exportMapText)
      ? pass('QA_TOKENS_OVERLAY_RUNTIME', 'Overlay z-index and motion tokens are exported and registered', runtimeTokenPath)
      : fail('QA_TOKENS_OVERLAY_RUNTIME', 'Overlay z-index and motion tokens must exist in runtime, registry, and export map', runtimeTokenPath),
  );
  checks.push(
    /toastIconBox:\s*28/.test(runtimeText)
      && /devConsolePanelWidth:\s*360/.test(runtimeText)
      && /surfaceSizeRoleMap/.test(tokenIndexText)
      && /devConsolePanelWidth/.test(tokenIndexText)
      ? pass('QA_TOKENS_OVERLAY_SIZE_RUNTIME', 'Overlay-related surface and dev console size tokens are exported and registered', runtimeTokenPath)
      : fail('QA_TOKENS_OVERLAY_SIZE_RUNTIME', 'Toast surface and dev console size tokens must exist in runtime and registry', runtimeTokenPath),
  );
  checks.push(
    /cardPaddingX:\s*spacing\.md/.test(runtimeText)
      && /cardPaddingY:\s*spacing\.lg/.test(runtimeText)
      && /cardPaddingCompactX:\s*spacing\.md/.test(runtimeText)
      && /cardPaddingCompactY:\s*spacing\.md/.test(runtimeText)
      && /cardPaddingX:\s*spacing\.md/.test(compatibilityRuntimeText)
      && /cardPaddingY:\s*spacing\.lg/.test(compatibilityRuntimeText)
      && /cardPaddingCompactX:\s*spacing\.md/.test(compatibilityRuntimeText)
      && /cardPaddingCompactY:\s*spacing\.md/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_CARD_AXIS_RUNTIME', 'Card axis padding tokens keep 12px horizontal and existing vertical rhythm in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_CARD_AXIS_RUNTIME', 'Card axis padding tokens must map X to spacing.md and default Y to spacing.lg in both runtime token layers', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('cardPaddingX')
      && tokenIndexText.includes('full-site default card horizontal content inset')
      && tokenIndexText.includes('legacy scalar alias')
      ? pass('QA_TOKENS_CARD_AXIS_REGISTRY', 'Card axis padding tokens and legacy scalar alias guidance are registered', tokenIndexPath)
      : fail('QA_TOKENS_CARD_AXIS_REGISTRY', 'Token registry must document cardPaddingX/Y, compact axis tokens, and legacy scalar aliases', tokenIndexPath),
  );
  checks.push(
    /card:\s*12/.test(runtimeText)
      && /card:\s*12/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_CARD_RADIUS_RUNTIME', 'radius.card is exported in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_CARD_RADIUS_RUNTIME', 'radius.card must exist in package and compatibility runtime tokens', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('"radius.card"')
      && tokenIndexText.includes('"semanticRadiusRoleMap"')
      && tokenIndexText.includes('card-like panel radius')
      && exportMapText.includes('semanticRadius')
      ? pass('QA_TOKENS_CARD_RADIUS_REGISTRY', 'Card radius semantic role is registered and exported', tokenIndexPath)
      : fail('QA_TOKENS_CARD_RADIUS_REGISTRY', 'Token registry/export map must document semanticRadiusRoleMap.card and radius.card', tokenIndexPath),
  );
  checks.push(
    /--radius-card:\s*12px/.test(cssMappingText)
      && /--radius-sheet:\s*24px/.test(cssMappingText)
      && /--radius-card:\s*12px/.test(engineeringCssMappingText)
      && /--radius-sheet:\s*24px/.test(engineeringCssMappingText)
      ? pass('QA_TOKENS_CARD_RADIUS_CSS_MAPPING', 'CSS mappings expose semantic card and sheet radius roles', 'packages/design-tokens/mappings/css-variable.mapping.css')
      : fail('QA_TOKENS_CARD_RADIUS_CSS_MAPPING', 'CSS mappings must expose --radius-card and --radius-sheet', 'packages/design-tokens/mappings/css-variable.mapping.css'),
  );
  checks.push(
    /borderRadius:\s*semanticRadius/.test(tailwindMappingText)
      && /card:\s*"var\(--radius-card\)"/.test(tailwindMappingText)
      && /borderRadius:\s*semanticRadius/.test(engineeringTailwindMappingText)
      && /card:\s*"var\(--radius-card\)"/.test(engineeringTailwindMappingText)
      ? pass('QA_TOKENS_CARD_RADIUS_TAILWIND_MAPPING', 'Tailwind mappings expose semantic card radius role', 'packages/design-tokens/mappings/tailwind.mapping.js')
      : fail('QA_TOKENS_CARD_RADIUS_TAILWIND_MAPPING', 'Tailwind mappings must expose borderRadius.card', 'packages/design-tokens/mappings/tailwind.mapping.js'),
  );
  checks.push(
    radiusDocsText.includes('radius.card')
      && radiusDocsText.includes('card-like panels must use `radius.card`')
      ? pass('QA_TOKENS_CARD_RADIUS_DOC', 'Radius documentation states the card radius contract', 'design-system/01-tokens/radius-tokens.md')
      : fail('QA_TOKENS_CARD_RADIUS_DOC', 'Radius documentation must state that card-like panels use radius.card', 'design-system/01-tokens/radius-tokens.md'),
  );
}

if (
  exists(colorTokenPath)
  && exists(modeMatrixPath)
  && exists(runtimeColorPath)
  && exists(compatibilityRuntimeColorPath)
  && exists('packages/design-tokens/mappings/css-variable.mapping.css')
  && exists('design-system-engineering/08_code_mapping/css-variable.mapping.css')
  && exists('design-system/01-tokens/color-tokens.md')
) {
  const colorTokens = readJson(colorTokenPath);
  const modeMatrix = readJson(modeMatrixPath);
  const runtimeColorText = read(runtimeColorPath);
  const compatibilityRuntimeColorText = read(compatibilityRuntimeColorPath);
  const cssMappingText = read('packages/design-tokens/mappings/css-variable.mapping.css');
  const engineeringCssMappingText = read('design-system-engineering/08_code_mapping/css-variable.mapping.css');
  const colorDocs = read('design-system/01-tokens/color-tokens.md');
  const blue500 = colorTokens.color?.primitive?.blue?.['500']?.$value;
  const blue600 = colorTokens.color?.primitive?.blue?.['600']?.$value;
  const marketUp600 = colorTokens.color?.primitive?.market?.up?.['600']?.$value;
  const lightColors = modeMatrix.modes?.lightBroker?.colors;

  checks.push(
    blue500 === '#1F72E8' && blue600 === '#1F72E8'
      ? pass('QA_TOKENS_STANDARD_BLUE', 'Standard blue primitive 500/600 is #1F72E8', colorTokenPath)
      : fail('QA_TOKENS_STANDARD_BLUE', 'Standard blue primitive 500/600 must be #1F72E8', colorTokenPath),
  );
  checks.push(
    lightColors?.accent?.blue?.fg === '#1F72E8'
      && lightColors?.accent?.blue?.solid === '#1F72E8'
      && lightColors?.status?.info?.fg === '#1F72E8'
      && lightColors?.status?.info?.solid === '#1F72E8'
      && lightColors?.text?.link === '#1F72E8'
      ? pass('QA_TOKENS_STANDARD_BLUE_SEMANTIC', 'Light-mode info/link/blue accent semantics use #1F72E8', modeMatrixPath)
      : fail('QA_TOKENS_STANDARD_BLUE_SEMANTIC', 'Light-mode info/link/blue accent semantics must use #1F72E8', modeMatrixPath),
  );
  checks.push(
    marketUp600 === '#2EA379'
      && lightColors?.market?.up?.fg === '#2EA379'
      && lightColors?.market?.up?.solid === '#2EA379'
      && lightColors?.chart?.diverging?.positive === '#2EA379'
      ? pass('QA_TOKENS_MARKET_UP_GLOBAL_GREEN', 'market.up and positive chart semantics use trading green #2EA379', modeMatrixPath)
      : fail('QA_TOKENS_MARKET_UP_GLOBAL_GREEN', 'market.up fg/solid and positive chart semantics must use #2EA379', modeMatrixPath),
  );
  checks.push(
    lightColors?.market?.down?.fg === '#CF202F'
      && lightColors?.market?.down?.solid === '#CF202F'
      && lightColors?.overlay?.down?.subtle === '#CF202F12'
      ? pass('QA_TOKENS_MARKET_DOWN_GLOBAL_RED', 'market.down and overlay.down use trading red semantics', modeMatrixPath)
      : fail('QA_TOKENS_MARKET_DOWN_GLOBAL_RED', 'market.down and overlay.down must use red trading semantics', modeMatrixPath),
  );
  checks.push(
    lightColors?.status?.success?.fg
      && lightColors.status.success.fg !== '#2EA379'
      && Object.values(modeMatrix.modes || {}).every((mode) => {
        const success = mode.colors?.status?.success;
        return success?.fg !== '#2EA379' && success?.solid !== '#2EA379';
      })
      ? pass('QA_TOKENS_SUCCESS_GREEN_ISOLATION', 'status.success remains independent from trading green #2EA379', modeMatrixPath)
      : fail('QA_TOKENS_SUCCESS_GREEN_ISOLATION', 'status.success and feedback success tokens must not equal #2EA379', modeMatrixPath),
  );
  checks.push(
    runtimeColorText === compatibilityRuntimeColorText
      ? pass('QA_TOKENS_COLOR_RUNTIME_MIRROR', 'Package runtime colors mirror src/theme compatibility colors', runtimeColorPath)
      : fail('QA_TOKENS_COLOR_RUNTIME_MIRROR', 'packages/design-tokens/src/colors.ts must mirror src/theme/colors.ts', runtimeColorPath),
  );
  checks.push(
    /--color-accent-blue-fg:\s*#1F72E8/.test(cssMappingText)
      && /--color-status-info-fg:\s*#1F72E8/.test(cssMappingText)
      && /--color-text-link:\s*#1F72E8/.test(cssMappingText)
      && /--color-market-up-fg:\s*#2EA379/.test(cssMappingText)
      && /--color-market-down-fg:\s*#CF202F/.test(cssMappingText)
      && cssMappingText === engineeringCssMappingText
      ? pass('QA_TOKENS_COLOR_CSS_MAPPING', 'CSS color mappings expose standard blue and global market semantics consistently', 'packages/design-tokens/mappings/css-variable.mapping.css')
      : fail('QA_TOKENS_COLOR_CSS_MAPPING', 'CSS mappings must expose #1F72E8, market.up #2EA379, red market.down, and mirror engineering mapping', 'packages/design-tokens/mappings/css-variable.mapping.css'),
  );
  checks.push(
    !/up\s*=\s*red|down\s*=\s*green|China-style financial semantics|China-style positive|China-style negative/i.test(colorDocs)
      && /up\s*=\s*green/.test(colorDocs)
      && /down\s*=\s*red/.test(colorDocs)
      && /status\.success/.test(colorDocs)
      ? pass('QA_TOKENS_COLOR_DOC_SEMANTICS', 'Color docs document global up/down semantics and success isolation', 'design-system/01-tokens/color-tokens.md')
      : fail('QA_TOKENS_COLOR_DOC_SEMANTICS', 'Color docs must remove old up=red/down=green rules and document success isolation', 'design-system/01-tokens/color-tokens.md'),
  );
}

complete('check-tokens', checks);
