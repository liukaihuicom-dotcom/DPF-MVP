const { complete, fail, pass, read, requireContains, requireFiles } = require('./qa-utils.cjs');

const translationText = read('src/i18n/translations.ts');
const skillText = read('.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md');
const enStart = translationText.indexOf('  "en-US": {');
const zhStart = translationText.indexOf('  "zh-CN": {');
const enBlock = enStart >= 0 && zhStart > enStart ? translationText.slice(enStart, zhStart) : '';
const englishEntries = [...enBlock.matchAll(/"([^"]+)":\s*"([^"]*)"/g)].map((match) => ({ key: match[1], value: match[2] }));
const protectedTermIssues = englishEntries.flatMap(({ key, value }) => {
  const issues = [];
  const protectedTerms = [
    ['kyc', 'KYC'],
    ['aml', 'AML'],
    ['mt4', 'MT4'],
    ['mt5', 'MT5'],
    ['ib', 'IB'],
    ['pin', 'PIN'],
    ['otp', 'OTP'],
    ['usd', 'USD'],
    ['idr', 'IDR'],
    ['btc', 'BTC'],
    ['copytrading', 'CopyTrading'],
  ];

  protectedTerms.forEach(([bad, expected]) => {
    const badPattern = new RegExp(`\\b${bad}\\b`);
    if (badPattern.test(value) && !value.includes(expected)) {
      issues.push(fail('QA_I18N_CAPITALIZATION_TERM', `${key} must preserve official casing for ${expected}`, 'src/i18n/translations.ts'));
    }
  });

  return issues;
});

const capitalizationRuleIssues = [
  skillText.includes('en-capitalization.rules.md')
    ? pass('QA_I18N_CAPITALIZATION_RULE', 'Financial copy skill requires English capitalization rules')
    : fail('QA_I18N_CAPITALIZATION_RULE', 'Financial copy skill must require en-capitalization.rules.md for English UI copy tasks', '.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md'),
  skillText.includes('Page Copy Review')
    ? pass('QA_I18N_PAGE_COPY_REVIEW', 'Financial copy skill requires Page Copy Review')
    : fail('QA_I18N_PAGE_COPY_REVIEW', 'Financial copy skill must require Page Copy Review after English UI copy changes', '.codex/skills/l2-addons/ui-build-governance/financial-ux-copy-localization-governance-skill-v1.0.0-l5.md'),
];

complete('qa:i18n', [
  ...requireFiles([
    'src/i18n/translations.ts',
    'docs/12-i18n-rules.md',
    '.codex/skills/l3-supporting-references/financial-copy/financial-ux-copy-localization-en-capitalization-rules.md',
    'handoff/templates/i18n-keys.md',
    'i18n/en-US.json',
    'i18n/zh-CN.json',
  ], 'QA_I18N_FILE'),
  ...requireContains('src/i18n/translations.ts', ["'en-US'", "'zh-CN'"], 'QA_I18N_LOCALE'),
  ...capitalizationRuleIssues,
  ...protectedTermIssues,
]);
