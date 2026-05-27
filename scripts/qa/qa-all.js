const path = require('path');
const { spawnSync } = require('child_process');

const scripts = [
  'check-hardcoded-style.js',
  'check-tokens.js',
  'check-page-delivery.js',
  'check-navigation-registry.js',
  'check-state-coverage.js',
  'check-handoff-docs.js',
  'check-api-contract.js',
  'check-i18n-keys.js',
  'check-accessibility-baseline.js',
  'check-security-rules.js',
  'check-version-record.js',
  'check-workspace-boundary.js',
  'check-icons.js',
  'check-component-boundary.js',
  'check-component-manifest.js',
];

const results = scripts.map((script) => {
  const run = spawnSync(process.execPath, [path.join(__dirname, script)], {
    encoding: 'utf8',
  });

  let parsed = null;
  try {
    parsed = JSON.parse(run.stdout);
  } catch {
    parsed = {
      name: script,
      status: run.status === 0 ? 'passed' : 'failed',
      issues: [{ id: 'QA_PARSE', message: run.stderr || run.stdout || 'No output' }],
    };
  }

  return {
    script,
    status: run.status === 0 ? 'passed' : 'failed',
    result: parsed,
  };
});

const failed = results.filter((result) => result.status !== 'passed');
const summary = {
  status: failed.length ? 'failed' : 'passed',
  summary: {
    passed: results.length - failed.length,
    failed: failed.length,
  },
  results,
};

console.log(JSON.stringify(summary, null, 2));
process.exitCode = failed.length ? 1 : 0;
