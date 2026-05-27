const { complete, exists, fail, pass, read, requireFiles } = require('./qa-utils.cjs');

const packageJsonPath = 'packages/design-tokens/package.json';
const tokenIndexPath = 'packages/design-tokens/registry/tokens.json';
const colorTokenPath = 'packages/design-tokens/registry/tokens.color.json';
const modeMatrixPath = 'packages/design-tokens/registry/token-mode.matrix.json';
const exportMapPath = 'packages/design-tokens/registry/token-export.map.json';
const runtimeTokenPath = 'packages/design-tokens/src/tokens.ts';
const compatibilityRuntimeTokenPath = 'src/theme/tokens.ts';
const runtimeColorPath = 'packages/design-tokens/src/colors.ts';
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
  const semanticSpacingRoles = [
    'screenBottomPadding',
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
    'sheetFooterGap',
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
    /semanticSpacing/.test(exportMapText)
      ? pass('QA_TOKENS_SEMANTIC_SPACING_EXPORT', 'Semantic spacing roles are represented in the token export map', exportMapPath)
      : fail('QA_TOKENS_SEMANTIC_SPACING_EXPORT', 'Token export map must include semanticSpacing metadata', exportMapPath),
  );
  checks.push(
    /screenBottomPadding:\s*spacing\.xxl/.test(runtimeText) && /screenBottomPadding:\s*spacing\.xxl/.test(compatibilityRuntimeText)
      ? pass('QA_TOKENS_SCREEN_SAFE_BOTTOM_RUNTIME', 'layout.screenBottomPadding is exported in package and compatibility runtime tokens', runtimeTokenPath)
      : fail('QA_TOKENS_SCREEN_SAFE_BOTTOM_RUNTIME', 'layout.screenBottomPadding must stay in package and compatibility runtime tokens', runtimeTokenPath),
  );
  checks.push(
    tokenIndexText.includes('screenBottomPadding') && tokenIndexText.includes('device bottom safe-area inset in Screen')
      ? pass('QA_TOKENS_SCREEN_SAFE_BOTTOM_REGISTRY', 'layout.screenBottomPadding documents Screen safe-area composition', tokenIndexPath)
      : fail('QA_TOKENS_SCREEN_SAFE_BOTTOM_REGISTRY', 'layout.screenBottomPadding must document Screen safe-area composition', tokenIndexPath),
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
}

complete('check-tokens', checks);
