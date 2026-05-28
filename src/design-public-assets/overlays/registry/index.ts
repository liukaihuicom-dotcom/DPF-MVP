export const overlayRegistryPaths = {
  dependencyGraph: 'src/design-public-assets/overlays/registry/overlay-dependency-graph.json',
  matrix: 'src/design-public-assets/overlays/registry/page-overlay-matrix.md',
  registry: 'src/design-public-assets/overlays/registry/overlay-registry.json',
  schema: 'src/design-public-assets/overlays/registry/overlay-registry.schema.json',
} as const;

export type OverlayRegistryPathKey = keyof typeof overlayRegistryPaths;
