const { complete, exists, fail, pass, read, requireFiles } = require('./qa-utils.cjs');

const registryPath = 'design-system-engineering/11_public_resources/registry/public-asset-registry.json';
const graphPath = 'design-system-engineering/11_public_resources/registry/asset-dependency-graph.json';
const copyPath = 'design-system-engineering/11_public_resources/copy/copy-table.json';
const illustrationPath = 'design-system-engineering/11_public_resources/illustrations/illustration-registry.json';
const businessPath = 'design-system-engineering/03_business_components/business-component-manifest.json';
const patternPath = 'design-system-engineering/05_patterns/pattern-registry.json';
const aiIndexPath = 'design-system-engineering/07_ai_runtime/ai-readable-index.json';
const gatesPath = 'qa/production-gates.json';

function readJson(file) {
  return JSON.parse(read(file));
}

function routePageIdsFromRegistry() {
  const source = read('src/navigation/routeRegistry.ts');
  return [...source.matchAll(/path:\s*'([^']+)'[\s\S]*?pageComponent:\s*'([^']+)'/g)].map((match) => ({
    path: match[1],
    pageComponent: match[2],
  }));
}

const checks = [
  ...requireFiles([
    registryPath,
    'design-system-engineering/11_public_resources/registry/public-asset-registry.schema.json',
    graphPath,
    'design-system-engineering/11_public_resources/registry/asset-dependency-graph.schema.json',
    copyPath,
    illustrationPath,
    'design-system-engineering/11_public_resources/registry/migration-plan.md',
    'design-system-engineering/11_public_resources/registry/change-impact-report.md',
    'design-system-engineering/11_public_resources/registry/deprecated-assets.md',
    'design-system-engineering/11_public_resources/qa/qa-checklist.md',
  ], 'QA_PUBLIC_RESOURCE_FILE'),
];

if (exists(registryPath) && exists(graphPath) && exists(copyPath) && exists(illustrationPath)) {
  const registry = readJson(registryPath);
  const graph = readJson(graphPath);
  const copyTable = readJson(copyPath);
  const illustrationRegistry = readJson(illustrationPath);
  const business = readJson(businessPath);
  const patterns = readJson(patternPath);
  const aiIndex = readJson(aiIndexPath);
  const gates = readJson(gatesPath);
  const assetIds = new Set((registry.assets || []).map((asset) => asset.asset_id));
  const assetNodeIds = new Set((graph.assetNodes || []).map((asset) => asset.asset_id));
  const graphPageIds = new Set((graph.pages || []).map((page) => page.page_id));
  const routes = routePageIdsFromRegistry();
  const readinessPageIds = new Set((graph.pageReadinessMatrix || []).map((page) => page.page_id));
  const firstBatchPages = new Set(['markets', 'trade', 'quick', 'portfolio_alias', 'instrument_detail', 'account_details', 'appearance']);

  checks.push(
    Array.isArray(registry.assets) && registry.assets.length >= 40
      ? pass('QA_PUBLIC_RESOURCE_REGISTRY_SIZE', `Public asset registry contains ${registry.assets.length} assets`, registryPath)
      : fail('QA_PUBLIC_RESOURCE_REGISTRY_SIZE', 'Public asset registry must contain the token/component/pattern/icon/copy governance assets', registryPath),
  );

  for (const asset of registry.assets || []) {
    for (const field of ['asset_id', 'asset_type', 'name', 'version', 'source_path', 'usage_scope', 'platforms', 'status', 'owner', 'dependencies', 'dependents', 'sync_policy', 'qa_status']) {
      const value = asset[field];
      const allowEmptyArray = field === 'dependencies' || field === 'dependents';
      const missing = Array.isArray(value) ? (!allowEmptyArray && value.length === 0) : value === undefined || value === null || value === '';
      if (missing) {
        checks.push(fail('QA_PUBLIC_RESOURCE_ASSET_FIELD', `${asset.asset_id || '(unknown asset)'} is missing ${field}`, registryPath));
      }
    }

    if (asset.source_path && asset.source_path !== null && !asset.source_path.startsWith('src/') && !asset.source_path.startsWith('packages/') && !asset.source_path.startsWith('design-system') && !asset.source_path.startsWith('scripts/') && !asset.source_path.startsWith('qa/') && !asset.source_path.startsWith('handoff/')) {
      checks.push(fail('QA_PUBLIC_RESOURCE_SOURCE_SCOPE', `${asset.asset_id} source_path must stay inside governed workspace paths`, registryPath));
    }
  }

  for (const requiredAsset of [
    'token.design-tokens',
    'component.base.component-library',
    'component.layout.AppViewport',
    'tool.dev.ProductControlPanel',
    'business.registry',
    'pattern.registry',
    'icon.icon-library',
    'copy.copy-table',
    'illustration.registry',
    'graph.asset-dependency',
    'qa.public-resource-check',
  ]) {
    checks.push(
      assetIds.has(requiredAsset)
        ? pass('QA_PUBLIC_RESOURCE_REQUIRED_ASSET', `${requiredAsset} is registered`, registryPath)
        : fail('QA_PUBLIC_RESOURCE_REQUIRED_ASSET', `${requiredAsset} must be registered`, registryPath),
    );
  }

  checks.push(
    (graph.pages || []).length === routes.length
      ? pass('QA_PUBLIC_RESOURCE_ROUTE_COVERAGE', `Dependency graph covers all ${routes.length} route registry entries`, graphPath)
      : fail('QA_PUBLIC_RESOURCE_ROUTE_COVERAGE', `Dependency graph pages (${(graph.pages || []).length}) must match route registry entries (${routes.length})`, graphPath),
  );

  for (const page of graph.pages || []) {
    for (const field of ['page_id', 'route', 'component', 'module', 'platform', 'riskLevel', 'patterns', 'baseComponents', 'tokens', 'copyNamespaces', 'migrationStatus']) {
      const value = page[field];
      const missing = Array.isArray(value) ? value.length === 0 : value === undefined || value === null || value === '';
      if (missing) {
        checks.push(fail('QA_PUBLIC_RESOURCE_PAGE_FIELD', `${page.page_id || '(unknown page)'} is missing ${field}`, graphPath));
      }
    }

    if (page.riskLevel === 'high' && (!Array.isArray(page.businessComponents) || page.businessComponents.length === 0)) {
      checks.push(fail('QA_PUBLIC_RESOURCE_HIGH_RISK_BUSINESS', `${page.page_id} is high risk and must declare business components`, graphPath));
    }

    if (firstBatchPages.has(page.page_id)) {
      checks.push(
        page.migrationStatus === 'reference_migration_complete'
          ? pass('QA_PUBLIC_RESOURCE_FIRST_BATCH_MIGRATED', `${page.page_id} is reference-migration complete`, graphPath)
          : fail('QA_PUBLIC_RESOURCE_FIRST_BATCH_MIGRATED', `${page.page_id} must remain reference_migration_complete after second-stage migration`, graphPath),
      );
    }
  }

  for (const page of graph.pages || []) {
    checks.push(
      readinessPageIds.has(page.page_id)
        ? pass('QA_PUBLIC_RESOURCE_READINESS_ROW', `${page.page_id} has readiness row`, graphPath)
        : fail('QA_PUBLIC_RESOURCE_READINESS_ROW', `${page.page_id} must have a Page Readiness Matrix row`, graphPath),
    );
  }

  for (const row of graph.pageReadinessMatrix || []) {
    if (firstBatchPages.has(row.page_id)) {
      checks.push(
        row.migrationStatus === 'reference_migration_complete'
          && row.token === 'reference_migrated'
          && row.componentReuse === 'reference_migrated'
          && row.businessComponent === 'reference_migrated'
          && row.copy === 'i18n_keyed_copy_table_synced'
          ? pass('QA_PUBLIC_RESOURCE_FIRST_BATCH_READINESS', `${row.page_id} readiness is synced`, graphPath)
          : fail('QA_PUBLIC_RESOURCE_FIRST_BATCH_READINESS', `${row.page_id} readiness row must be synced to migrated public-resource references`, graphPath),
      );
    }
  }

  for (const edge of graph.edges || []) {
    if (!edge.from || !edge.to || !edge.relation) {
      checks.push(fail('QA_PUBLIC_RESOURCE_EDGE_SHAPE', 'Every dependency edge must include from, to, and relation', graphPath));
    }
  }

  for (const node of graph.assetNodes || []) {
    checks.push(
      assetIds.has(node.asset_id)
        ? pass('QA_PUBLIC_RESOURCE_GRAPH_NODE_REGISTERED', `${node.asset_id} graph node is registered`, graphPath)
        : fail('QA_PUBLIC_RESOURCE_GRAPH_NODE_REGISTERED', `${node.asset_id} graph node must exist in public asset registry`, graphPath),
    );
  }

  for (const assetId of assetIds) {
    checks.push(
      assetNodeIds.has(assetId)
        ? pass('QA_PUBLIC_RESOURCE_REGISTRY_GRAPH_SYNC', `${assetId} exists in graph asset nodes`, graphPath)
        : fail('QA_PUBLIC_RESOURCE_REGISTRY_GRAPH_SYNC', `${assetId} must exist in graph asset nodes`, graphPath),
    );
  }

  for (const component of ['TradingAccountContextSwitcher', 'OrderPositionDetailSheet', 'MetricCluster', 'FinancialTrendChart', 'RiskGauge', 'PartnerPortalSummary', 'RewardSummaryCard', 'VerificationStatusCard', 'ThemePreviewSelector']) {
    const componentEntry = business.components?.[component];
    checks.push(
      componentEntry
        ? pass('QA_PUBLIC_RESOURCE_BUSINESS_EXTRACTION', `${component} is registered as migration target`, businessPath)
        : fail('QA_PUBLIC_RESOURCE_BUSINESS_EXTRACTION', `${component} must be registered as a business component migration target`, businessPath),
    );
    checks.push(
      componentEntry?.extractionStatus === 'implemented_active'
        ? pass('QA_PUBLIC_RESOURCE_BUSINESS_IMPLEMENTED', `${component} is implemented active`, businessPath)
        : fail('QA_PUBLIC_RESOURCE_BUSINESS_IMPLEMENTED', `${component} must be implemented_active after second-stage migration`, businessPath),
    );
  }

  for (const pattern of ['accountContextSwitcher', 'tradingOrderActionSheet', 'metricCluster', 'financialVisualization', 'discoverProfileCommerce', 'appearanceThemePreview']) {
    checks.push(
      patterns.patterns?.[pattern]
        ? pass('QA_PUBLIC_RESOURCE_PATTERN_EXTRACTION', `${pattern} pattern is registered`, patternPath)
        : fail('QA_PUBLIC_RESOURCE_PATTERN_EXTRACTION', `${pattern} must be registered in pattern-registry.json`, patternPath),
    );
  }

  checks.push(
    Array.isArray(copyTable.entries) && copyTable.entries.length >= 8
      ? pass('QA_PUBLIC_RESOURCE_COPY_TABLE', `Copy table contains ${copyTable.entries.length} governed entries`, copyPath)
      : fail('QA_PUBLIC_RESOURCE_COPY_TABLE', 'Copy table must contain seeded visible-copy migration entries', copyPath),
  );

  const firstBatchCopyKeys = new Set([
    'portfolio.action.closePosition',
    'portfolio.action.deleteOrder',
    'portfolio.history.summaryTitle',
    'discover.profile.partnerPortal.title',
    'discover.profile.reward.totalValue',
    'discover.challenge.openTicket',
    'common.demoActionNoAccount',
    'settings.appearance.title',
    'funding.operation.submit',
    'auth.pin.title',
  ]);

  for (const entry of copyTable.entries || []) {
    for (const field of ['key', 'namespace', 'module', 'surface', 'riskLevel', 'sourcePaths', 'status', 'reviewRequired', 'enUS', 'zhCN']) {
      const value = entry[field];
      const missing = Array.isArray(value) ? value.length === 0 && field !== 'reviewRequired' : value === undefined || value === null || value === '';
      if (missing) {
        checks.push(fail('QA_PUBLIC_RESOURCE_COPY_ENTRY', `${entry.key || '(unknown copy key)'} is missing ${field}`, copyPath));
      }
    }
    if (firstBatchCopyKeys.has(entry.key)) {
      checks.push(
        entry.status === 'i18n_keyed' && entry.sourcePaths.includes('src/i18n/translations.ts')
          ? pass('QA_PUBLIC_RESOURCE_COPY_I18N_SYNCED', `${entry.key} is keyed and synced`, copyPath)
          : fail('QA_PUBLIC_RESOURCE_COPY_I18N_SYNCED', `${entry.key} must be i18n_keyed and include src/i18n/translations.ts`, copyPath),
      );
    }
  }

  checks.push(
    Array.isArray(illustrationRegistry.assets) && illustrationRegistry.assets.length >= 3
      ? pass('QA_PUBLIC_RESOURCE_ILLUSTRATION_REGISTRY', 'Illustration registry declares planned owned assets and fallbacks', illustrationPath)
      : fail('QA_PUBLIC_RESOURCE_ILLUSTRATION_REGISTRY', 'Illustration registry must declare planned owned assets and fallbacks', illustrationPath),
  );

  for (const requiredRead of [registryPath, graphPath, copyPath, illustrationPath]) {
    checks.push(
      aiIndex.readOrder?.includes(requiredRead)
        ? pass('QA_PUBLIC_RESOURCE_AI_INDEX', `${requiredRead} is in ai-readable read order`, aiIndexPath)
        : fail('QA_PUBLIC_RESOURCE_AI_INDEX', `${requiredRead} must be in ai-readable read order`, aiIndexPath),
    );
  }

  for (const gate of ['public-resource-governance', 'asset-dependency-graph', 'copy-table']) {
    checks.push(
      gates.gates?.includes(gate)
        ? pass('QA_PUBLIC_RESOURCE_PRODUCTION_GATE', `${gate} is in production gates`, gatesPath)
        : fail('QA_PUBLIC_RESOURCE_PRODUCTION_GATE', `${gate} must be in production gates`, gatesPath),
    );
  }

  checks.push(
    graph.releaseDecision?.decision && graph.releaseDecision?.canEnterNextStage === true
      ? pass('QA_PUBLIC_RESOURCE_RELEASE_DECISION', `Release decision: ${graph.releaseDecision.decision}`, graphPath)
      : fail('QA_PUBLIC_RESOURCE_RELEASE_DECISION', 'Asset dependency graph must include a next-stage release decision', graphPath),
  );

  checks.push(
    JSON.stringify(registry).includes('390 x 844 native app canvas')
      && JSON.stringify(graph).includes('component.layout.AppViewport')
      && JSON.stringify(graph).includes('tool.dev.ProductControlPanel')
      && JSON.stringify(graph).includes('must_remain_outside')
      ? pass('QA_PUBLIC_RESOURCE_APP_PREVIEW_CANVAS', 'Codex app preview canvas and developer-tool boundary are registered as public resource governance assets', registryPath)
      : fail('QA_PUBLIC_RESOURCE_APP_PREVIEW_CANVAS', 'Public resource registry and graph must record AppViewport 390 x 844 canvas and ProductControlPanel outside-canvas boundary', registryPath),
  );
}

complete('qa:public-resources', checks);
