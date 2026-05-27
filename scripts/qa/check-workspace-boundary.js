const { complete, exists, fail, pass, read, requireFiles } = require('./qa-utils.cjs');

const packagePaths = {
  '@dpf/design-tokens': 'packages/design-tokens/package.json',
  '@dpf/icon-library': 'packages/icon-library/package.json',
  '@dpf/component-library': 'packages/component-library/package.json',
};

function readJson(path) {
  return JSON.parse(read(path));
}

function dependenciesOf(packageJson) {
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };
}

const checks = [
  ...requireFiles([
    'pnpm-workspace.yaml',
    'design-system-engineering/dependency-contract.md',
    'design-system-engineering/release-map.json',
    ...Object.values(packagePaths),
  ], 'QA_WORKSPACE_FILE'),
];

if (exists('pnpm-workspace.yaml')) {
  const workspace = read('pnpm-workspace.yaml');
  checks.push(
    workspace.includes('packages/*')
      ? pass('QA_WORKSPACE_PACKAGES', 'Workspace includes packages/*', 'pnpm-workspace.yaml')
      : fail('QA_WORKSPACE_PACKAGES', 'Workspace must include packages/*', 'pnpm-workspace.yaml'),
  );
}

const manifests = Object.fromEntries(
  Object.entries(packagePaths)
    .filter(([, path]) => exists(path))
    .map(([name, path]) => [name, readJson(path)]),
);

if (manifests['@dpf/design-tokens']) {
  const deps = dependenciesOf(manifests['@dpf/design-tokens']);
  for (const blocked of ['@dpf/icon-library', '@dpf/component-library']) {
    checks.push(
      !deps[blocked]
        ? pass('QA_WORKSPACE_DEP_DIRECTION', `@dpf/design-tokens does not depend on ${blocked}`, packagePaths['@dpf/design-tokens'])
        : fail('QA_WORKSPACE_DEP_DIRECTION', `@dpf/design-tokens must not depend on ${blocked}`, packagePaths['@dpf/design-tokens']),
    );
  }
}

if (manifests['@dpf/icon-library']) {
  const deps = dependenciesOf(manifests['@dpf/icon-library']);
  checks.push(
    deps['@dpf/design-tokens'] === 'workspace:*'
      ? pass('QA_WORKSPACE_DEP_DIRECTION', '@dpf/icon-library depends on design tokens', packagePaths['@dpf/icon-library'])
      : fail('QA_WORKSPACE_DEP_DIRECTION', '@dpf/icon-library must depend on @dpf/design-tokens', packagePaths['@dpf/icon-library']),
  );
  checks.push(
    !deps['@dpf/component-library']
      ? pass('QA_WORKSPACE_DEP_DIRECTION', '@dpf/icon-library does not depend on component library', packagePaths['@dpf/icon-library'])
      : fail('QA_WORKSPACE_DEP_DIRECTION', '@dpf/icon-library must not depend on @dpf/component-library', packagePaths['@dpf/icon-library']),
  );
}

if (manifests['@dpf/component-library']) {
  const deps = dependenciesOf(manifests['@dpf/component-library']);
  for (const required of ['@dpf/design-tokens', '@dpf/icon-library']) {
    checks.push(
      deps[required] === 'workspace:*'
        ? pass('QA_WORKSPACE_DEP_DIRECTION', `@dpf/component-library depends on ${required}`, packagePaths['@dpf/component-library'])
        : fail('QA_WORKSPACE_DEP_DIRECTION', `@dpf/component-library must depend on ${required}`, packagePaths['@dpf/component-library']),
    );
  }
}

complete('check-workspace-boundary', checks);
