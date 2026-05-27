const { complete, requireFiles } = require('./qa-utils.cjs');

complete('qa:page', requireFiles([
  'README.md',
  'docs/00-project-structure.md',
  'docs/01-product-modules.md',
  'docs/02-page-map.md',
  'docs/07-routing.md',
  'docs/modal-map.md',
  'docs/page-modal-trigger-map.md',
  'handoff/README.md',
  'handoff/templates/page-spec.md',
  'design-system/05-patterns/list-pattern.md',
  'design-system/05-patterns/detail-pattern.md',
  'design-system/05-patterns/form-pattern.md',
  'src/navigation/routeRegistry.ts',
  'src/navigation/modalRegistry.ts',
  'product-engineering-package/01_modules_and_navigation/route.map.json',
  'product-engineering-package/01_modules_and_navigation/page.inventory.md',
  'product-engineering-package/01_modules_and_navigation/modal.map.json',
], 'QA_PAGE'));
