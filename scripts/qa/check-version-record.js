const { complete, exists, fail, pass, read, requireFiles } = require('./qa-utils.cjs');

function readJson(path) {
  return JSON.parse(read(path));
}

function requirePackageVersion(packagePath, changelogPath, prefix) {
  if (!exists(packagePath) || !exists(changelogPath)) {
    return [fail(`${prefix}_PACKAGE_VERSION`, `Missing package version inputs for ${packagePath}`, packagePath)];
  }

  const packageJson = readJson(packagePath);
  const changelog = read(changelogPath);
  return [
    packageJson.version
      ? pass(`${prefix}_PACKAGE_VERSION`, `${packageJson.name} version ${packageJson.version} is declared`, packagePath)
      : fail(`${prefix}_PACKAGE_VERSION`, `${packageJson.name || packagePath} must declare version`, packagePath),
    changelog.includes(packageJson.version)
      ? pass(`${prefix}_CHANGELOG_VERSION`, `${packageJson.version} is recorded in changelog`, changelogPath)
      : fail(`${prefix}_CHANGELOG_VERSION`, `${packageJson.version} must be recorded in changelog`, changelogPath),
  ];
}

complete('qa:version', [
  ...requireFiles([
  'docs/14-release-notes.md',
  'design-system/08-release/versioning.md',
  'design-system/08-release/changelog.md',
  'design-system/08-release/deprecated.md',
  'packages/design-tokens/package.json',
  'packages/design-tokens/VERSION.md',
  'packages/design-tokens/CHANGELOG.md',
  'packages/component-library/package.json',
  'packages/component-library/VERSION.md',
  'packages/component-library/CHANGELOG.md',
  'packages/icon-library/package.json',
  'packages/icon-library/VERSION.md',
  'packages/icon-library/CHANGELOG.md',
  'design-system-engineering/release-map.json',
  'design-system-engineering/dependency-contract.md',
  ], 'QA_VERSION'),
  ...requirePackageVersion('packages/design-tokens/package.json', 'packages/design-tokens/CHANGELOG.md', 'QA_VERSION_TOKENS'),
  ...requirePackageVersion('packages/component-library/package.json', 'packages/component-library/CHANGELOG.md', 'QA_VERSION_COMPONENTS'),
  ...requirePackageVersion('packages/icon-library/package.json', 'packages/icon-library/CHANGELOG.md', 'QA_VERSION_ICONS'),
]);
