const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { complete, fail, pass, read, root, walk } = require('./qa-utils.cjs');

const manifestPath = 'packages/component-library/registry/component-manifest.json';
const manifest = JSON.parse(read(manifestPath));
const componentEntries = manifest.components || {};
const requiredFields = [
  'category',
  'path',
  'exports',
  'props',
  'variants',
  'states',
  'a11y',
  'platforms',
  'tokenBindings',
  'usage',
  'forbidden',
];

function containsJsx(node) {
  let found = false;
  function visit(child) {
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
      found = true;
      return;
    }
    if (!found) {
      ts.forEachChild(child, visit);
    }
  }
  visit(node);
  return found;
}

function isExported(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return Boolean(modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function exportedComponentNames(file) {
  const sourceText = fs.readFileSync(path.join(root, file), 'utf8');
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const names = [];

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && /^[A-Z]/.test(node.name.text) && isExported(node) && containsJsx(node)) {
      names.push(node.name.text);
    }

    if (ts.isVariableStatement(node) && isExported(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name)
          && /^[A-Z]/.test(declaration.name.text)
          && declaration.initializer
          && containsJsx(declaration.initializer)
        ) {
          names.push(declaration.name.text);
        }
      }
    }
  });

  return names;
}

const componentFiles = walk('src/components').filter((file) => file.endsWith('.tsx'));
const exportedComponents = componentFiles.flatMap((file) => exportedComponentNames(file).map((name) => ({ file, name })));
const checks = [
  pass('QA_COMPONENT_MANIFEST_SCAN', `Scanned ${exportedComponents.length} exported TSX components`, 'src/components'),
];

for (const { file, name } of exportedComponents) {
  const entry = componentEntries[name]
    || Object.values(componentEntries).find((candidate) => Array.isArray(candidate.exports) && candidate.exports.includes(name));

  if (!entry) {
    checks.push(fail('QA_COMPONENT_MANIFEST_MISSING', `${name} is exported from ${file} but is not registered in component-manifest.json`, file));
    continue;
  }

  for (const field of requiredFields) {
    const value = entry[field];
    const missing = Array.isArray(value) ? value.length === 0 : value === undefined || value === null || value === '';
    if (missing) {
      checks.push(fail('QA_COMPONENT_MANIFEST_FIELD', `${name} manifest entry is missing ${field}`, manifestPath));
    }
  }

  if (entry.path && !fs.existsSync(path.join(root, entry.path))) {
    checks.push(fail('QA_COMPONENT_MANIFEST_PATH', `${name} manifest path does not exist: ${entry.path}`, manifestPath));
  }
}

for (const [name, entry] of Object.entries(componentEntries)) {
  if (!entry.path || !fs.existsSync(path.join(root, entry.path))) {
    checks.push(fail('QA_COMPONENT_MANIFEST_PATH', `${name} manifest path does not exist: ${entry.path}`, manifestPath));
  }
}

const screenEntry = componentEntries.Screen;
if (screenEntry) {
  const screenManifestText = JSON.stringify(screenEntry);
  checks.push(
    !screenEntry.variants?.includes('flushNoBottomPadding') && screenManifestText.includes('device bottom safe-area inset')
      ? pass('QA_COMPONENT_SCREEN_SAFE_BOTTOM', 'Screen manifest enforces the full-site bottom safe gap contract', manifestPath)
      : fail('QA_COMPONENT_SCREEN_SAFE_BOTTOM', 'Screen manifest must remove flushNoBottomPadding and document device bottom safe-area composition', manifestPath),
  );
}

const appViewportEntry = componentEntries.AppViewport;
if (appViewportEntry) {
  const appViewportText = read('src/components/AppViewport.tsx');
  const rootLayoutText = read('src/screens/navigation/RootLayout.tsx');
  const appViewportManifestText = JSON.stringify(appViewportEntry);
  checks.push(
    /width:\s*layout\.appDeviceWidth/.test(appViewportText)
      && /height:\s*layout\.appDeviceHeight/.test(appViewportText)
      && /borderRadius:\s*radius\.sheet/.test(appViewportText)
      && /maxHeight:\s*'100%'/.test(appViewportText)
      && /justifyContent:\s*'center'/.test(appViewportText)
      && appViewportManifestText.includes('390 x 844 native app canvas')
      && appViewportManifestText.includes('radius.sheet')
      ? pass('QA_COMPONENT_APP_VIEWPORT_DEVICE_CANVAS', 'AppViewport constrains Codex web product pages to the governed 390 x 844 rounded device canvas', manifestPath)
      : fail('QA_COMPONENT_APP_VIEWPORT_DEVICE_CANVAS', 'AppViewport must use layout.appDeviceWidth, layout.appDeviceHeight, radius.sheet, and document the rounded 390 x 844 web preview contract', 'src/components/AppViewport.tsx'),
  );
  checks.push(
    /<AppViewport>[\s\S]*?<Stack[\s\S]*?<\/Stack>[\s\S]*?<\/AppViewport>[\s\S]*?<GlobalBottomSheetHost \/>[\s\S]*?<ProductControlPanel \/>/.test(rootLayoutText)
      ? pass('QA_COMPONENT_APP_VIEWPORT_DEVTOOLS_BOUNDARY', 'ProductControlPanel remains outside AppViewport and is not clipped by the phone canvas', 'src/screens/navigation/RootLayout.tsx')
      : fail('QA_COMPONENT_APP_VIEWPORT_DEVTOOLS_BOUNDARY', 'ProductControlPanel must remain a sibling after AppViewport, not a child inside the phone canvas', 'src/screens/navigation/RootLayout.tsx'),
  );
}

const productControlPanelEntry = componentEntries.ProductControlPanel;
if (productControlPanelEntry) {
  const productControlPanelText = read('src/components/ProductControlPanel.tsx');
  const productControlPanelManifestText = JSON.stringify(productControlPanelEntry);
  checks.push(
    /PanResponder\.create/.test(productControlPanelText)
      && /onPanResponderMove/.test(productControlPanelText)
      && /useWindowDimensions/.test(productControlPanelText)
      && productControlPanelManifestText.includes('independent debug module')
      ? pass('QA_COMPONENT_DEVTOOLS_DRAGGABLE', 'ProductControlPanel keeps window-bound drag behavior as an independent debug module', 'src/components/ProductControlPanel.tsx')
      : fail('QA_COMPONENT_DEVTOOLS_DRAGGABLE', 'ProductControlPanel must keep PanResponder drag behavior and independent debug-module manifest wording', 'src/components/ProductControlPanel.tsx'),
  );
}

const cardEntry = componentEntries.Card;
if (cardEntry) {
  const cardText = read('src/components/Card.tsx');
  const cardManifestText = JSON.stringify(cardEntry);
  const cardTokenBindings = Array.isArray(cardEntry.tokenBindings) ? cardEntry.tokenBindings : [];
  checks.push(
    /paddingHorizontal:\s*layout\.cardPaddingX/.test(cardText)
      && /paddingVertical:\s*layout\.cardPaddingY/.test(cardText)
      && /paddingHorizontal:\s*layout\.cardPaddingCompactX/.test(cardText)
      && /paddingVertical:\s*layout\.cardPaddingCompactY/.test(cardText)
      && /borderRadius:\s*radius\.card/.test(cardText)
      && !/\bborderWidth\b/.test(cardText)
      && !/\bborderColor\b/.test(cardText)
      && !/padding:\s*spacing\.lg/.test(cardText)
      && !/padding:\s*spacing\.md/.test(cardText)
      && cardManifestText.includes('layout.cardPaddingX')
      && cardManifestText.includes('12px horizontal padding')
      && cardManifestText.includes('borderless')
      && cardTokenBindings.includes('radius.card')
      && !cardTokenBindings.includes('radius.md')
      && !cardTokenBindings.some((binding) => /^lineWidth|^color\.border/.test(binding))
      ? pass('QA_COMPONENT_CARD_AXIS_PADDING', 'Card runtime and manifest use radius.card plus axis-specific card padding tokens', manifestPath)
      : fail('QA_COMPONENT_CARD_AXIS_PADDING', 'Card must use radius.card, layout.cardPaddingX/Y, compact axis tokens, and manifest must document the borderless 12px radius/padding contract', 'src/components/Card.tsx'),
  );
}

const actionButtonEntry = componentEntries.ActionButton;
if (actionButtonEntry) {
  const actionButtonText = read('src/components/ActionButton.tsx');
  const actionButtonManifestText = JSON.stringify(actionButtonEntry);
  const actionButtonVariants = Array.isArray(actionButtonEntry.variants) ? actionButtonEntry.variants.join(',') : '';
  const actionButtonStates = Array.isArray(actionButtonEntry.states) ? actionButtonEntry.states : [];
  const actionButtonProps = Array.isArray(actionButtonEntry.props) ? actionButtonEntry.props : [];
  checks.push(
    actionButtonVariants === 'filled,outline'
      && /export type ActionButtonVariant = 'filled' \| 'outline';/.test(actionButtonText)
      && !/legacySoft|variant="text"|emphasis\??:|emphasis=|textToneStyles|disabledTextButton|textButton/.test(actionButtonText)
      && !actionButtonEntry.variants.includes('text')
      && !actionButtonEntry.variants.includes('legacySoft')
      ? pass('QA_COMPONENT_ACTION_BUTTON_TWO_VARIANTS', 'ActionButton exposes only filled and outline variants', manifestPath)
      : fail('QA_COMPONENT_ACTION_BUTTON_TWO_VARIANTS', 'ActionButton must expose exactly filled and outline, with no text or legacySoft compatibility variant', 'src/components/ActionButton.tsx'),
  );

  checks.push(
    /filledButton:\s*\{[\s\S]*?borderWidth:\s*lineWidth\.none/.test(actionButtonText)
      && /backgroundColor:\s*'transparent'/.test(actionButtonText)
      && /borderColor:\s*colors\.border\.default/.test(actionButtonText)
      ? pass('QA_COMPONENT_ACTION_BUTTON_VISUAL_CONTRACT', 'ActionButton filled is background-only and outline is transparent with a token border', 'src/components/ActionButton.tsx')
      : fail('QA_COMPONENT_ACTION_BUTTON_VISUAL_CONTRACT', 'ActionButton filled must use lineWidth.none and outline must keep transparent background with token border', 'src/components/ActionButton.tsx'),
  );

  checks.push(
    /export type ActionButtonSizePreset = 'sm' \| 'md' \| 'lg' \| 'xl' \| 'default';/.test(actionButtonText)
      && /const buttonSizeConfig = \{[\s\S]*?sm:[\s\S]*?size\.button\.sm[\s\S]*?md:[\s\S]*?size\.button\.md[\s\S]*?lg:[\s\S]*?size\.button\.lg[\s\S]*?xl:[\s\S]*?size\.button\.xl/m.test(actionButtonText)
      && actionButtonProps.includes('sizePreset')
      && actionButtonManifestText.includes('sm, md/default, lg, and xl')
      ? pass('QA_COMPONENT_ACTION_BUTTON_SIZE_PRESETS', 'ActionButton exposes governed sm/md/default/lg/xl size presets', 'src/components/ActionButton.tsx')
      : fail('QA_COMPONENT_ACTION_BUTTON_SIZE_PRESETS', 'ActionButton runtime and manifest must expose governed sm/md/default/lg/xl size presets', 'src/components/ActionButton.tsx'),
  );

  checks.push(
    /leadingIcon\?: AppIconName/.test(actionButtonText)
      && /trailingIcon\?: AppIconName/.test(actionButtonText)
      && /reserveLeadingIcon\?: boolean/.test(actionButtonText)
      && /reserveTrailingIcon\?: boolean/.test(actionButtonText)
      && /const resolvedLeadingIcon = leadingIcon \?\? icon;/.test(actionButtonText)
      && actionButtonProps.includes('leadingIcon')
      && actionButtonProps.includes('trailingIcon')
      && actionButtonProps.includes('reserveLeadingIcon')
      && actionButtonProps.includes('reserveTrailingIcon')
      && actionButtonManifestText.includes('legacy icon prop remains a leadingIcon alias')
      ? pass('QA_COMPONENT_ACTION_BUTTON_ICON_SLOTS', 'ActionButton exposes governed leading/trailing icon slots and keeps legacy icon compatibility', 'src/components/ActionButton.tsx')
      : fail('QA_COMPONENT_ACTION_BUTTON_ICON_SLOTS', 'ActionButton must expose leading/trailing icon slots, reserved slots, and legacy icon compatibility in runtime and manifest', 'src/components/ActionButton.tsx'),
  );

  checks.push(
    actionButtonStates.includes('hover')
      && actionButtonStates.includes('focus')
      && /loadingLabel\?: string/.test(actionButtonText)
      && /disabledReason\?: string/.test(actionButtonText)
      && /accessibilityHint=\{disabled && disabledReason \? disabledReason : undefined\}/.test(actionButtonText)
      && /focusedStyle=\{StyleSheet\.flatten\(\[styles\.focusedButton/.test(actionButtonText)
      && /hoveredStyle=\{styles\.hoveredButton\}/.test(actionButtonText)
      ? pass('QA_COMPONENT_ACTION_BUTTON_STATE_MATRIX', 'ActionButton exposes loading label, disabled reason, hover, and focus state governance', 'src/components/ActionButton.tsx')
      : fail('QA_COMPONENT_ACTION_BUTTON_STATE_MATRIX', 'ActionButton must document and implement loadingLabel, disabledReason, hover, and focus states', 'src/components/ActionButton.tsx'),
  );
}

const bottomSheetEntry = componentEntries.BottomSheet;
if (bottomSheetEntry) {
  const bottomSheetText = read('src/components/BottomSheet.tsx');
  const bottomSheetManifestText = JSON.stringify(bottomSheetEntry);
  const bottomSheetTokenBindings = Array.isArray(bottomSheetEntry.tokenBindings) ? bottomSheetEntry.tokenBindings : [];
  checks.push(
    /paddingBottom: layout\.sheetFooterPaddingBottom \+ insets\.bottom/.test(bottomSheetText)
      && /paddingBottom: layout\.sheetContentPaddingBottom/.test(bottomSheetText)
      && /flexBasis: 'auto'/.test(bottomSheetText)
      && /gap: layout\.sheetFooterGap/.test(bottomSheetText)
      && bottomSheetManifestText.includes('layout.sheetFooterPaddingBottom + useSafeAreaInsets().bottom')
      && bottomSheetManifestText.includes('layout.sheetContentPaddingBottom')
      && bottomSheetTokenBindings.includes('layout.sheetContentPaddingBottom')
      && bottomSheetTokenBindings.includes('layout.sheetFooterPaddingBottom')
      && bottomSheetTokenBindings.includes('layout.sheetFooterGap')
      ? pass('QA_COMPONENT_BOTTOM_SHEET_SAFE_AREA', 'BottomSheet runtime and manifest centralize Footer safe area and ContentInner breathing space', 'src/components/BottomSheet.tsx')
      : fail('QA_COMPONENT_BOTTOM_SHEET_SAFE_AREA', 'BottomSheet must use layout.sheetFooterPaddingBottom + safe-area inset, layout.sheetContentPaddingBottom, and manifest token bindings', 'src/components/BottomSheet.tsx'),
  );
}

const headerIconButtonEntry = componentEntries.HeaderIconButton;
if (headerIconButtonEntry) {
  const headerIconButtonText = read('src/components/HeaderIconButton.tsx');
  const headerIconButtonManifestText = JSON.stringify(headerIconButtonEntry);
  checks.push(
    /surface\?: 'auto' \| 'panel' \| 'neutral'/.test(headerIconButtonText)
      && /backgroundContext\?: 'canvas' \| 'panel' \| 'raised' \| 'subtle'/.test(headerIconButtonText)
      && /const filledBackgroundColor = resolveHeaderIconButtonBackground\(colors, surface, backgroundContext\);/.test(headerIconButtonText)
      && /return colors\.surface\.panel;/.test(headerIconButtonText)
      && /surface === 'auto' \|\| surface === 'neutral'/.test(headerIconButtonText)
      && /backgroundContext === 'canvas' \|\| backgroundContext === 'subtle'/.test(headerIconButtonText)
      && /resolveIconSurfaceColors\(colors, 'neutral'\)\.backgroundColor/.test(headerIconButtonText)
      && headerIconButtonManifestText.includes('color.surface.panel')
      && headerIconButtonManifestText.includes('color.surface.subtle')
      && headerIconButtonManifestText.includes('backgroundContext=canvas/subtle')
      && headerIconButtonManifestText.includes('filled-auto')
      && headerIconButtonManifestText.includes('surface=auto')
      && headerIconButtonManifestText.includes('surface=neutral')
      && headerIconButtonManifestText.includes('IconSurface neutral background')
      ? pass('QA_COMPONENT_HEADER_ICON_SURFACE_MODE', 'HeaderIconButton supports panel, neutral, and auto adaptive filled backgrounds', manifestPath)
      : fail('QA_COMPONENT_HEADER_ICON_SURFACE_MODE', 'HeaderIconButton runtime and manifest must expose panel, neutral, and auto adaptive filled background modes', 'src/components/HeaderIconButton.tsx'),
  );
}

const instrumentDetailWorkspaceEntry = componentEntries.InstrumentDetailWorkspace;
if (instrumentDetailWorkspaceEntry) {
  const instrumentDetailWorkspaceText = read('src/components/business/InstrumentDetailWorkspace.tsx');
  const instrumentDetailWorkspaceManifestText = JSON.stringify(instrumentDetailWorkspaceEntry);
  checks.push(
    /export function InstrumentDetailWorkspace/.test(instrumentDetailWorkspaceText)
      && /surface="auto"/.test(instrumentDetailWorkspaceText)
      && /backgroundContext="canvas"/.test(instrumentDetailWorkspaceText)
      && /HEADER_SUMMARY_SCROLL_THRESHOLD/.test(instrumentDetailWorkspaceText)
      && /onScroll=\{handleScroll\}/.test(instrumentDetailWorkspaceText)
      && /headerSummaryPlaceholder/.test(instrumentDetailWorkspaceText)
      && /<TradingTerminalChart density="embedded"/.test(instrumentDetailWorkspaceText)
      && /<TradeQuoteActionBar/.test(instrumentDetailWorkspaceText)
      && !/useLocalSearchParams|router\.push/.test(instrumentDetailWorkspaceText)
      && instrumentDetailWorkspaceManifestText.includes('market detail page skeleton')
      && /route containers must pass resolved instrument data/i.test(instrumentDetailWorkspaceManifestText)
      ? pass('QA_COMPONENT_INSTRUMENT_DETAIL_WORKSPACE', 'InstrumentDetailWorkspace is registered as the governed instrument detail skeleton', manifestPath)
      : fail('QA_COMPONENT_INSTRUMENT_DETAIL_WORKSPACE', 'InstrumentDetailWorkspace must own the public page skeleton, use adaptive header icon surfaces, and avoid route-local behavior', 'src/components/business/InstrumentDetailWorkspace.tsx'),
  );
}

const tradingTerminalChartEntry = componentEntries.TradingTerminalChart;
if (tradingTerminalChartEntry) {
  const tradingTerminalChartText = read('src/components/business/TradingTerminalChart.tsx');
  const tradingTerminalChartManifestText = JSON.stringify(tradingTerminalChartEntry);
  checks.push(
    /embeddedSurface:\s*\{[\s\S]*?padding:\s*spacing\.none/.test(tradingTerminalChartText)
      && tradingTerminalChartManifestText.includes('Embedded density uses a flush outer surface')
      && tradingTerminalChartManifestText.includes('spacing.none padding')
      && tradingTerminalChartManifestText.includes('Do not add outer padding to embedded density')
      ? pass('QA_COMPONENT_TRADING_TERMINAL_EMBEDDED_FLUSH', 'TradingTerminalChart embedded density keeps a flush outer surface', manifestPath)
      : fail('QA_COMPONENT_TRADING_TERMINAL_EMBEDDED_FLUSH', 'TradingTerminalChart embedded density must use spacing.none outer padding and document the flush-surface contract', 'src/components/business/TradingTerminalChart.tsx'),
  );
}

const tradeOrderListEntry = componentEntries.TradeOrderList;
if (tradeOrderListEntry) {
  const tradeOrderListText = read('src/components/TradeOrderList.tsx');
  const rowStyleMatch = tradeOrderListText.match(/row:\s*\{[\s\S]*?\n\s*\},/);
  const cardStyleMatch = tradeOrderListText.match(/card:\s*\{[\s\S]*?\n\s*\},/);
  const tradeOrderListManifestText = JSON.stringify(tradeOrderListEntry);
  checks.push(
    rowStyleMatch
      && !/paddingHorizontal/.test(rowStyleMatch[0])
      && cardStyleMatch
      && /paddingHorizontal:\s*layout\.cardPaddingX/.test(cardStyleMatch[0])
      && tradeOrderListManifestText.includes('governed horizontal list inset through layout.cardPaddingX')
      ? pass('QA_COMPONENT_TRADE_ORDER_LIST_CARD_INSET', 'TradeOrderList card owns the governed horizontal list inset while rows keep vertical-only padding', manifestPath)
      : fail('QA_COMPONENT_TRADE_ORDER_LIST_CARD_INSET', 'TradeOrderList card must use layout.cardPaddingX, rows must not add horizontal padding, and manifest must document the card inset contract', 'src/components/TradeOrderList.tsx'),
  );
}

complete('check-component-manifest', checks);
