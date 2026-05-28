export const publicResourceRegistryPaths = {
  assetDependencyGraph: 'design-system-engineering/11_public_resources/registry/asset-dependency-graph.json',
  businessComponentManifest: 'design-system-engineering/03_business_components/business-component-manifest.json',
  componentManifest: 'design-system-engineering/02_components/component-manifest.json',
  copyTable: 'design-system-engineering/11_public_resources/copy/copy-table.json',
  iconRegistry: 'design-system-engineering/04_icons/icon-registry.json',
  illustrationRegistry: 'design-system-engineering/11_public_resources/illustrations/illustration-registry.json',
  patternRegistry: 'design-system-engineering/05_patterns/pattern-registry.json',
  publicAssetRegistry: 'design-system-engineering/11_public_resources/registry/public-asset-registry.json',
  tokenRegistry: 'packages/design-tokens/registry/tokens.json',
} as const;

export type PublicResourceRegistryKey = keyof typeof publicResourceRegistryPaths;
