const ts = require('typescript');
const { complete, fail, pass, read, walk } = require('./qa-utils.cjs');

const routeDefaultExportNames = new Set([
  'Root',
  'RootLayout',
  'TabLayout',
  'IndexRoute',
  'NotFoundScreen',
  'LaunchScreen',
  'BrandSplashScreen',
  'LoginScreen',
  'RegisterEmailScreen',
  'RegisterPhoneScreen',
  'RegisterEmailCodeScreen',
  'RegisterPhoneCodeScreen',
  'RegisterPasswordScreen',
  'ForgotPasswordScreen',
  'OnboardingScreen',
  'PinSetupScreen',
  'VerifyDeprecatedScreen',
]);

const expoSpecialFiles = new Set(['app/+html.tsx']);

function containsJsx(node) {
  let found = false;
  function visit(child) {
    if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) || ts.isJsxFragment(child)) {
      found = true;
      return;
    }
    if (!found) {
      ts.forEachChild(child, visit);
    }
  }
  visit(node);
  return found;
}

function isUppercaseName(name) {
  return /^[A-Z][A-Za-z0-9_]*$/.test(name);
}

function hasExportDefault(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return Boolean(
    modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      && modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword),
  );
}

function isAllowedRouteDefault(file, node, name) {
  if (expoSpecialFiles.has(file)) {
    return true;
  }

  return hasExportDefault(node) && routeDefaultExportNames.has(name);
}

function inspectFile(file) {
  const sourceText = read(file);
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const checks = [];

  function addIssue(name, node) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    checks.push(
      fail(
        'QA_COMPONENT_BOUNDARY',
        `Move local UI component ${name} out of app/ into src/screens or src/components.`,
        `${file}:${line + 1}:${character + 1}`,
      ),
    );
  }

  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && isUppercaseName(node.name.text) && containsJsx(node)) {
      if (!isAllowedRouteDefault(file, node, node.name.text)) {
        addIssue(node.name.text, node.name);
      }
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name)
          && isUppercaseName(declaration.name.text)
          && declaration.initializer
          && containsJsx(declaration.initializer)
        ) {
          addIssue(declaration.name.text, declaration.name);
        }
      }
    }
  });

  return checks;
}

const directBottomSheetCallPattern = /\bbottomSheet\.(?:show|push|update)\s*\(/;
const bottomSheetPresetPattern = /\bbottomSheetPresets\./;
const publicBottomSheetEntrypoints = new Set([
  'src/components/BottomSheet.tsx',
  'src/components/BottomSheetActions.tsx',
]);
const privatePageSheetNames = new Set([
  'PaymentMethodSheet',
  'DeviceDetailSheet',
  'TransactionDetailSheet',
  'AccountMenuSheet',
  'AccountMoreSheet',
  'ManagerChatSheet',
  'ProfileEditSheetContent',
  'AuthLanguageSheetContent',
  'CountryPickerSheetContent',
]);

function inspectBottomSheetGovernance() {
  const files = walk('src')
    .filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter((file) => !publicBottomSheetEntrypoints.has(file));
  const checks = [];

  for (const file of files) {
    const text = read(file);
    const isPublicBusinessComponent = file.startsWith('src/components/business/');

    if (directBottomSheetCallPattern.test(text) || bottomSheetPresetPattern.test(text)) {
      checks.push(
        fail(
          'QA_BOTTOM_SHEET_PUBLIC_OPENERS_ONLY',
          `${file} must use openActionSheet/openDetailSheet/openSelectionSheet/openConfirmSheet/openFixedListSheet/openScrollableDetailSheet instead of direct bottomSheet.show/push/update or bottomSheetPresets.`,
          file,
        ),
      );
    }

    if (!isPublicBusinessComponent) {
      for (const sheetName of privatePageSheetNames) {
        const declarationPattern = new RegExp(`\\b(?:function|const)\\s+${sheetName}\\b`);
        if (declarationPattern.test(text)) {
          checks.push(
            fail(
              'QA_PRIVATE_BOTTOM_SHEET_CONTENT_BODY',
              `${file} must not redeclare ${sheetName}; use the governed public business sheet component from src/components/business.`,
              file,
            ),
          );
        }
      }
    }
  }

  return checks.length
    ? checks
    : [
        pass(
          'QA_BOTTOM_SHEET_PUBLIC_OPENERS_ONLY',
          'Pages and non-public components do not bypass shared BottomSheet scene openers or redeclare governed sheet content bodies.',
          'src/components/BottomSheetActions.tsx',
        ),
      ];
}

const files = walk('app').filter((file) => file.endsWith('.tsx'));
const issues = [
  ...files.flatMap(inspectFile),
  ...inspectBottomSheetGovernance(),
];
complete('check-component-boundary', [
  pass('QA_COMPONENT_BOUNDARY_SCAN', `Scanned ${files.length} app route files`, 'app'),
  ...issues,
]);
