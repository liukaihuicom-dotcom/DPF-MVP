const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const registryPath = path.join(root, 'packages/icon-library/registry/icon-registry.json');
const appIconPath = path.join(root, 'src/components/AppIcon.tsx');
const iconSurfacePath = path.join(root, 'src/components/IconSurface.tsx');
const localIconRoot = path.join(root, 'src/icons/local');
const localIconMapPath = path.join(root, 'src/icons/local/iconComponentMap.ts');
const iconRegistryPath = path.join(root, 'src/icons/iconRegistry.ts');
const packageJsonPath = path.join(root, 'package.json');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const appIconSource = fs.existsSync(appIconPath) ? fs.readFileSync(appIconPath, 'utf8') : '';
const iconSurfaceSource = fs.existsSync(iconSurfacePath) ? fs.readFileSync(iconSurfacePath, 'utf8') : '';
const localIconMapSource = fs.existsSync(localIconMapPath) ? fs.readFileSync(localIconMapPath, 'utf8') : '';
const iconRegistrySource = fs.existsSync(iconRegistryPath) ? fs.readFileSync(iconRegistryPath, 'utf8') : '';
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const issues = [];
const approvedSources = new Set(['iconsax', 'custom']);
const governedIconSizes = [8, 12, 16, 20, 24, 32, 40, 48, 64];
const governedIconSizeSet = new Set(governedIconSizes);
const defaultIconSize = 24;
const defaultIconStrokeWidth = 1.5;
const allowedAppIconSizeExpressions = [
  'layout.headerIconSize',
  'layout.menuDisclosureIconSize',
  'surface.icon',
  'Math.max(20, Math.round(size * 0.55))',
];
const allowedLiteralIconTones = new Set(['amber', 'danger', 'disabled', 'down', 'panel', 'tertiary', 'up', 'white']);
const blockedDecorativeLiteralIconTones = new Set(['blue', 'brand', 'cyan', 'text', 'textDim', 'textMuted']);
const forbiddenPackagePatterns = [
  '@expo/vector-icons',
  'iconsax-react-native',
  '@hugeicons/core-free-icons',
  '@hugeicons/react-native',
  '@hugeicons-pro/core-duotone-rounded',
  'lucide-react-native',
  'phosphor-react-native',
  'react-native-remix-icon',
];
const allowedSvgRenderers = new Set([
  'app/account-details/[id].tsx',
  'app/instrument/[id].tsx',
  'src/components/FlagIcon.tsx',
  'src/components/InstrumentIcon.tsx',
  'src/components/Sparkline.tsx',
  'src/screens/accounts/AccountDetailsScreen.tsx',
  'src/screens/markets/InstrumentDetailScreen.tsx',
]);
function addIssue(id, severity, message, file = registryPath) {
  issues.push({ file: path.relative(root, file), id, message, severity });
}

function readFileIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, out);
    } else if (/\.(ts|tsx|js|jsx|json|md|yaml|yml)$/.test(entry.name)) {
      out.push(fullPath);
    }
  }

  return out;
}

function assertPackageClean() {
  for (const packageName of forbiddenPackagePatterns) {
    if (dependencies[packageName]) {
      addIssue('BLOCKED_ICON_PROVIDER_DEPENDENCY', 'blocker', `${packageName} is blocked by the current icon source policy.`, packageJsonPath);
    }
  }
}

function assertRegistryPolicy() {
  if (!registry.source_policy || registry.source_policy.primary_library !== 'iconsax') {
    addIssue('ICON_SOURCE_POLICY_INVALID', 'blocker', 'Registry primary source must be iconsax.');
  }

  const approved = new Set((registry.source_policy?.approved_libraries || []).map((item) => item.library));
  for (const source of approvedSources) {
    if (!approved.has(source)) {
      addIssue('ICON_SOURCE_POLICY_MISSING_LIBRARY', 'critical', `Registry must approve ${source}.`);
    }
  }

  for (const blocked of registry.source_policy?.blocked_libraries || []) {
    if (String(blocked.library).includes('hugeicons') && !blocked.reason) {
      addIssue('BLOCKED_LIBRARY_REASON_MISSING', 'critical', `${blocked.library} must include a block reason.`);
    }
  }

  if (registry.source_policy?.runtime_policy?.delivery !== 'local-vendored-assets') {
    addIssue('ICON_RUNTIME_POLICY_INVALID', 'blocker', 'Registry runtime policy must require local-vendored-assets.');
  }

  if (registry.source_policy?.runtime_policy?.asset_root !== 'src/icons/local/iconsax') {
    addIssue('ICON_LOCAL_ASSET_ROOT_INVALID', 'blocker', 'Registry local asset root must be src/icons/local/iconsax.');
  }
}

function exportedNamesForPackage(sourceLibrary) {
  if (sourceLibrary === 'iconsax') {
    const source = readFileIfExists(path.join(root, 'node_modules/iconsax-react-native/dist/index.d.ts'));
    if (!source) {
      return new Set();
    }
    return new Set(Array.from(source.matchAll(/export const ([A-Za-z0-9_]+): Icon;/g)).map((match) => match[1]));
  }

  return new Set();
}

function assertRegistryEntries() {
  if (!Array.isArray(registry.icons)) {
    addIssue('ICON_REGISTRY_INVALID_SHAPE', 'blocker', 'icon-registry.json must use an icons array.');
    return;
  }

  const seen = new Set();
  const registryKeys = new Set();
  const exportedBySource = {
    iconsax: exportedNamesForPackage('iconsax'),
  };

  for (const icon of registry.icons) {
    const key = icon.icon_key;
    registryKeys.add(key);

    if (!/^icon\.[a-z0-9_]+(\.[a-z0-9_]+)+$/.test(key || '')) {
      addIssue('ICON_KEY_INVALID', 'critical', `${key || '(missing key)'} must follow icon.{category}.{meaning}.`);
    }

    if (seen.has(key)) {
      addIssue('ICON_KEY_DUPLICATE', 'critical', `${key} is duplicated.`);
    }
    seen.add(key);

    if (!approvedSources.has(icon.source_library)) {
      addIssue('ICON_SOURCE_LIBRARY_BLOCKED', 'blocker', `${key} uses unapproved source ${icon.source_library}.`);
    }

    if (/(hugeicons|phosphor|lucide|remix)/i.test(String(icon.source_library)) || /Huge/i.test(String(icon.source_icon_name))) {
      addIssue('LEGACY_ICON_PROVIDER_REGISTRY_REFERENCE', 'blocker', `${key} still references a blocked legacy icon provider.`);
    }

    for (const field of ['category', 'meaning', 'source_icon_name', 'style', 'sizes', 'states', 'token_binding', 'usage', 'license', 'status']) {
      if (!(field in icon)) {
        addIssue('ICON_METADATA_MISSING', 'critical', `${key} is missing required field ${field}.`);
      }
    }

    if (icon.status !== 'approved') {
      addIssue('ICON_NOT_APPROVED', icon.status === 'blocked' ? 'blocker' : 'critical', `${key} is ${icon.status}; production registry entries must be approved.`);
    }

    if (!Array.isArray(icon.usage) || icon.usage.length === 0) {
      addIssue('ICON_USAGE_MISSING', 'critical', `${key} must declare usage.`);
    }

    if (!icon.license?.name || !icon.license?.url || typeof icon.license.attribution_required !== 'boolean') {
      addIssue('ICON_LICENSE_MISSING', 'critical', `${key} must declare complete license metadata.`);
    }

    if (!/^color\.icon\./.test(icon.token_binding?.color || '') || !/^size\.icon\./.test(icon.token_binding?.size || '')) {
      addIssue('ICON_TOKEN_BINDING_INVALID', 'critical', `${key} must bind to color.icon.* and size.icon.* tokens.`);
    }

    if (!Array.isArray(icon.sizes) || icon.sizes.some((size) => !governedIconSizeSet.has(size))) {
      addIssue('ICON_SIZE_TOKEN_INVALID', 'critical', `${key} must use governed icon sizes ${governedIconSizes.join('/')}.`);
    }

    if (icon.category !== 'brand' && icon.default_size !== defaultIconSize) {
      addIssue('DEFAULT_ICON_SIZE_INVALID', 'critical', `${key} must default to ${defaultIconSize}px unless it is a brand asset exception.`);
    }

    if (icon.category !== 'brand' && icon.token_binding?.size !== 'size.icon.md') {
      addIssue('ICON_TOKEN_BINDING_INVALID', 'critical', `${key} default size must bind to size.icon.md.`);
    }

    if (icon.style?.default !== 'line' || icon.style?.active !== 'fill') {
      addIssue('ICON_STYLE_CONTRACT_INVALID', 'critical', `${key} must declare line as default style and fill as active style.`);
    }

    if (icon.source_library !== 'custom') {
      const exports = exportedBySource[icon.source_library];
      if (exports?.size && !exports.has(icon.source_icon_name)) {
        addIssue('REGISTRY_GLYPH_MISSING_FROM_SOURCE', 'blocker', `${key} references missing ${icon.source_library} glyph ${icon.source_icon_name}.`);
      }
    }

    if (!icon.local_asset_path || !icon.local_asset_path.startsWith('src/icons/local/iconsax/')) {
      addIssue('ICON_LOCAL_ASSET_PATH_MISSING', 'blocker', `${key} must declare a local_asset_path under src/icons/local/iconsax.`);
    } else {
      const localAssetPath = path.join(root, icon.local_asset_path);
      if (!fs.existsSync(localAssetPath)) {
        addIssue('ICON_LOCAL_ASSET_MISSING', 'blocker', `${key} local asset is missing at ${icon.local_asset_path}.`);
      }
    }

    const componentKey = `${icon.source_library}:${icon.source_icon_name}`;
    if (!localIconMapSource.includes(`"${componentKey}"`)) {
      addIssue('REGISTRY_GLYPH_NOT_MAPPED', 'blocker', `${key} local glyph ${componentKey} is not mapped by iconComponentMap.`);
    }
  }

  for (const [legacy, target] of Object.entries(registry.migration || {})) {
    if (!registryKeys.has(target)) {
      addIssue('ICON_MIGRATION_TARGET_MISSING', 'critical', `${legacy} migrates to missing ${target}.`);
    }
    if (!iconRegistrySource.includes(`"${legacy}":`)) {
      addIssue('ICON_RUNTIME_MIGRATION_MISSING', 'critical', `${legacy} must exist in legacyIconNameMap.`);
    }
  }
}

function assertCodeUsage() {
  const productionFiles = [
    ...collectFiles(path.join(root, 'app')),
    ...collectFiles(path.join(root, 'src')),
  ].filter((file) => fs.existsSync(file));
  const configFiles = [
    packageJsonPath,
    path.join(root, 'pnpm-lock.yaml'),
    path.join(root, 'tsconfig.json'),
  ].filter((file) => fs.existsSync(file));
  const qaFiles = collectFiles(path.join(root, 'scripts')).filter((file) => fs.existsSync(file));
  const policyFiles = [
    registryPath,
    path.join(root, 'packages/icon-library/qa/icon-qa.rules.json'),
    path.join(root, 'packages/icon-library/registry/icon-usage-rules.md'),
    path.join(root, 'packages/icon-library/CHANGELOG.md'),
  ].filter((file) => fs.existsSync(file));

  const registryKeys = new Set((registry.icons || []).map((icon) => icon.icon_key));
  const semanticUsage = new Map(Array.from(registryKeys).map((key) => [key, 0]));
  const legacyNames = new Set(Object.keys(registry.migration || {}));

  for (const file of [...productionFiles, ...configFiles]) {
    const relativeFile = path.relative(root, file);
    const source = readFileIfExists(file);

    if (/(hugeicons|Hugeicons|@hugeicons)/.test(source)) {
      addIssue('HUGEICONS_CODE_REFERENCE', 'blocker', 'Hugeicons references are blocked by the current icon source policy.', file);
    }

    if (/from ['"]react-native-svg['"]/.test(source) && !allowedSvgRenderers.has(relativeFile)) {
      const isLocalIconAsset = relativeFile.startsWith('src/icons/local/');
      if (!isLocalIconAsset) {
        addIssue('UNREGISTERED_LOCAL_SVG_ICON', 'blocker', 'Functional icons must use AppIcon and the semantic registry. Local SVG is only allowed for governed local icon assets, charts, or instrument renderers.', file);
      }
    }

    if (/from ['"](@expo\/vector-icons|iconsax-react-native|phosphor-react-native|lucide-react-native|react-native-remix-icon)['"]/.test(source)) {
      addIssue('LOW_LEVEL_ICON_IMPORT', 'blocker', 'Runtime icon libraries are blocked; AppIcon must render local vendored assets from src/icons/local.', file);
    }

    const literalAppIconToneMatches = source.matchAll(/<AppIcon\b[^>]*\btone=(['"])([^'"]+)\1/g);
    for (const match of literalAppIconToneMatches) {
      const tone = match[2];
      if (blockedDecorativeLiteralIconTones.has(tone) || !allowedLiteralIconTones.has(tone)) {
        addIssue(
          'APP_ICON_LITERAL_TONE_NOT_GOVERNED',
          'critical',
          `AppIcon literal tone "${tone}" is not allowed. Omit decorative tones so color.icon.primary owns the default, or use a governed state/inverse tone.`,
          file,
        );
      }
    }

    const literalAppIconStyleMatches = source.matchAll(/<AppIcon\b[^>]*\bstyleVariant=(['"])([^'"]+)\1/g);
    for (const match of literalAppIconStyleMatches) {
      const styleVariant = match[2];
      if (!['line', 'fill'].includes(styleVariant)) {
        addIssue('APP_ICON_STYLE_VARIANT_NOT_GOVERNED', 'critical', `AppIcon styleVariant "${styleVariant}" must be line or fill.`, file);
      }
    }

    const appIconMatches = source.matchAll(/<AppIcon\b[^>]*>/g);
    for (const match of appIconMatches) {
      const tag = match[0];
      const literalSize = tag.match(/\bsize=(['"])([^'"]+)\1/)?.[2];
      const expressionSize = tag.match(/\bsize=\{([^}]+)\}/)?.[1]?.trim();
      const rawSize = literalSize ?? expressionSize;
      if (!rawSize) {
        continue;
      }

      const usesSizeToken = /^size\.icon\./.test(rawSize);
      const usesLayoutAlias = allowedAppIconSizeExpressions.includes(rawSize);
      if (!usesSizeToken && !usesLayoutAlias) {
        addIssue(
          'HARD_CODED_APP_ICON_SIZE',
          'critical',
          `AppIcon size "${rawSize}" is not governed. Use sizeVariant, size.icon.*, layout.headerIconSize, layout.menuDisclosureIconSize, or an approved component-owned alias.`,
          file,
        );
      }
    }

    const disclosureIconMatches = source.matchAll(/<AppIcon\b[^>]*name=['"]icon\.system\.chevron_right['"][^>]*>/g);
    for (const match of disclosureIconMatches) {
      const tag = match[0];
      if (!/tone=['"]tertiary['"]/.test(tag) || !/(size=\{layout\.menuDisclosureIconSize\}|size=\{?16\}?)/.test(tag)) {
        addIssue('APP_ICON_DISCLOSURE_NOT_GOVERNED', 'critical', 'Row disclosure chevrons must be 16px tertiary pure AppIcon without a background surface.', file);
      }
    }

    if (relativeFile !== 'src/components/IconSurface.tsx' && /<View[\s\S]{0,220}<AppIcon\b/.test(source)) {
      const pageLocalIconSurface = Array.from(source.matchAll(/<View\b[\s\S]{0,260}<AppIcon\b/g)).some((viewMatch) => {
        const snippet = viewMatch[0];
        return /backgroundColor:/.test(snippet)
          && /\b(icon|Icon)(Wrap|Slot|Box|Shell)?\b/.test(snippet)
          && !/styles\.ruleIcon/.test(snippet)
          && !/styles\.sidePill/.test(snippet);
      });
      if (pageLocalIconSurface) {
        addIssue('PAGE_LOCAL_ICON_SURFACE', 'critical', 'Icon + background compositions must use IconSurface so icon and background colors stay in the same semantic family.', file);
      }
    }

    if (relativeFile !== 'src/components/IconSurface.tsx' && /IconSurface[\s\S]{0,160}border/.test(source)) {
      addIssue('ICON_SURFACE_BORDER_STYLE', 'critical', 'IconSurface does not support bordered icon backgrounds.', file);
    }

    for (const key of registryKeys) {
      const matches = source.match(new RegExp(`['"]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'));
      if (matches) {
        semanticUsage.set(key, semanticUsage.get(key) + matches.length);
      }
    }

    if (!relativeFile.startsWith('packages/icon-library') && !relativeFile.startsWith('design-system-engineering/04_icons') && relativeFile !== 'src/icons/iconRegistry.ts') {
      for (const legacy of legacyNames) {
        const legacyMatch = source.match(new RegExp(`['"]${legacy}['"]`, 'g'));
        if (legacyMatch) {
          const allowedBusinessId =
            legacy === 'functionCenter' &&
            (relativeFile === 'src/domain/discoverLayout.ts' || relativeFile === 'src/screens/discover/DupoinDiscoverScreen.tsx');
          if (!allowedBusinessId) {
            addIssue('LEGACY_ICON_NAME_USED', 'critical', `${legacy} must be migrated to ${registry.migration[legacy]}.`, file);
          }
        }
      }
    }
  }

  for (const file of qaFiles) {
    const relativeFile = path.relative(root, file);
    const source = readFileIfExists(file);
    for (const legacy of legacyNames) {
      const legacyMatch = source.match(new RegExp(`['"]${legacy}['"]`, 'g'));
      if (legacyMatch) {
        const allowedBusinessId =
          legacy === 'functionCenter' &&
          relativeFile === 'scripts/qa/check-icons.js';
        if (!allowedBusinessId) {
          addIssue('LEGACY_ICON_NAME_USED', 'critical', `${legacy} must be migrated to ${registry.migration[legacy]}.`, file);
        }
      }
    }
  }

  for (const file of policyFiles) {
    const source = readFileIfExists(file);
    if (/from ['"]@hugeicons/.test(source)) {
      addIssue('HUGEICONS_POLICY_IMPORT_REFERENCE', 'blocker', 'Policy files may mention blocked Hugeicons libraries only as blocked library names, not runtime imports.', file);
    }
  }

  for (const [key, count] of semanticUsage) {
    if (count === 0) {
      addIssue('UNUSED_REGISTRY_ICON', 'major', `${key} is registered but not used by app, component, or docs code.`);
    }
  }
}

function imageDimensions(file) {
  const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { height, width };
}

function assertBrandAssets() {
  const brandAssets = registry.brand_assets || {};

  for (const key of ['launcherIcon', 'adaptiveIcon', 'splashIcon']) {
    const relativeAssetPath = brandAssets[key];
    if (!relativeAssetPath) {
      addIssue('BRAND_ASSET_MISSING', 'critical', `${key} must be declared in brand_assets.`);
      continue;
    }

    const assetPath = path.join(root, relativeAssetPath);
    if (!fs.existsSync(assetPath)) {
      addIssue('BRAND_ASSET_MISSING', 'critical', `${key} does not exist at ${relativeAssetPath}.`);
      continue;
    }

    const dimensions = imageDimensions(assetPath);
    if (dimensions.width !== 1024 || dimensions.height !== 1024) {
      addIssue('BRAND_ASSET_SIZE', 'critical', `${key} must be 1024x1024; found ${dimensions.width}x${dimensions.height}.`);
    }
  }
}

function assertRuntimeContract() {
  if (!appIconSource.includes("sizeVariant = 'md'")) {
    addIssue('APP_ICON_DEFAULT_SIZE_VARIANT_INVALID', 'critical', 'AppIcon must default sizeVariant to md / 24px.', appIconPath);
  }

  if (!appIconSource.includes("styleVariant = 'line'")) {
    addIssue('APP_ICON_DEFAULT_STYLE_VARIANT_INVALID', 'critical', 'AppIcon must default styleVariant to line.', appIconPath);
  }

  if (!appIconSource.includes("tone ?? 'primary'")) {
    addIssue('APP_ICON_DEFAULT_TONE_INVALID', 'critical', 'AppIcon must default no-tone glyphs to neutral primary color.icon.primary.', appIconPath);
  }

  if (!/case 'neutral':\s*default:\s*return \{ backgroundColor: colors\.surface\.subtle, iconTone: 'primary' \};/.test(iconSurfaceSource)) {
    addIssue('ICON_SURFACE_DEFAULT_TONE_INVALID', 'critical', 'IconSurface neutral/default icons must use neutral primary color.icon.primary, regardless of visible or hidden background.', iconSurfacePath);
  }

  if (!/case 'tertiary':\s*return \{ backgroundColor: colors\.surface\.subtle, iconTone: 'tertiary' \};/.test(iconSurfaceSource)) {
    addIssue('ICON_SURFACE_TERTIARY_TONE_INVALID', 'critical', 'IconSurface tertiary tone must remain an explicit low-emphasis icon color, not the default.', iconSurfacePath);
  }

  if (!appIconSource.includes('lineWidth.icon.default')) {
    addIssue('ICON_STROKE_WIDTH_INVALID', 'critical', 'AppIcon must pass lineWidth.icon.default to local icon renderers.', appIconPath);
  }

  const tokenSource = readFileIfExists(path.join(root, 'src/theme/tokens.ts'));
  if (!tokenSource.includes('default: 1.5')) {
    addIssue('ICON_STROKE_WIDTH_INVALID', 'critical', `lineWidth.icon.default must be ${defaultIconStrokeWidth}.`, path.join(root, 'src/theme/tokens.ts'));
  }
}

assertPackageClean();
assertRegistryPolicy();
assertRegistryEntries();
assertCodeUsage();
assertBrandAssets();
assertRuntimeContract();

const blockerOrCritical = issues.some((issue) => issue.severity === 'blocker' || issue.severity === 'critical');
const result = {
  issues,
  name: 'check-icons',
  status: blockerOrCritical ? 'failed' : 'passed',
  summary: {
    issues: issues.length,
    registeredIcons: Array.isArray(registry.icons) ? registry.icons.length : 0,
    sourcePolicy: registry.source_policy?.primary_library,
    sources: Array.isArray(registry.icons)
      ? registry.icons.reduce((acc, icon) => {
          acc[icon.source_library] = (acc[icon.source_library] || 0) + 1;
          return acc;
        }, {})
      : {},
  },
};

console.log(JSON.stringify(result, null, 2));
process.exitCode = blockerOrCritical ? 1 : 0;
