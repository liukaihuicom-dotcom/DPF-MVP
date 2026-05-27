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

const cardEntry = componentEntries.Card;
if (cardEntry) {
  const cardText = read('src/components/Card.tsx');
  const cardManifestText = JSON.stringify(cardEntry);
  checks.push(
    /paddingHorizontal:\s*layout\.cardPaddingX/.test(cardText)
      && /paddingVertical:\s*layout\.cardPaddingY/.test(cardText)
      && /paddingHorizontal:\s*layout\.cardPaddingCompactX/.test(cardText)
      && /paddingVertical:\s*layout\.cardPaddingCompactY/.test(cardText)
      && !/padding:\s*spacing\.lg/.test(cardText)
      && !/padding:\s*spacing\.md/.test(cardText)
      && cardManifestText.includes('layout.cardPaddingX')
      && cardManifestText.includes('12px horizontal padding')
      ? pass('QA_COMPONENT_CARD_AXIS_PADDING', 'Card runtime and manifest use axis-specific card padding tokens', manifestPath)
      : fail('QA_COMPONENT_CARD_AXIS_PADDING', 'Card must use layout.cardPaddingX/Y and compact axis tokens, and manifest must document the 12px horizontal contract', 'src/components/Card.tsx'),
  );
}

const tradeOrderListEntry = componentEntries.TradeOrderList;
if (tradeOrderListEntry) {
  const tradeOrderListText = read('src/components/TradeOrderList.tsx');
  const rowStyleMatch = tradeOrderListText.match(/row:\s*\{[\s\S]*?\n\s*\},/);
  const tradeOrderListManifestText = JSON.stringify(tradeOrderListEntry);
  checks.push(
    rowStyleMatch && !/paddingHorizontal/.test(rowStyleMatch[0]) && tradeOrderListManifestText.includes('outer container controls the list left/right width')
      ? pass('QA_COMPONENT_TRADE_ORDER_LIST_EXTERNAL_WIDTH', 'TradeOrderList rows do not own horizontal padding; outer containers control list width', manifestPath)
      : fail('QA_COMPONENT_TRADE_ORDER_LIST_EXTERNAL_WIDTH', 'TradeOrderList must not add row-level horizontal padding and manifest must document external width ownership', 'src/components/TradeOrderList.tsx'),
  );
}

complete('check-component-manifest', checks);
