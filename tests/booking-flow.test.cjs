const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');
const moduleCache = new Map();

function resolveModule(request, fromDir) {
  if (request.startsWith('@/')) {
    return resolveFile(path.join(repoRoot, 'src', request.slice(2)));
  }
  if (request.startsWith('.')) {
    return resolveFile(path.resolve(fromDir, request));
  }
  return request;
}

function resolveFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];
  const file = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  if (!file) {
    throw new Error(`Cannot resolve module path: ${basePath}`);
  }
  return file;
}

function loadTsModule(filePath) {
  const resolved = path.resolve(filePath);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;

  const source = fs.readFileSync(resolved, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: resolved,
  }).outputText;

  const mod = { exports: {} };
  moduleCache.set(resolved, mod);

  const localRequire = (request) => {
    const next = resolveModule(request, path.dirname(resolved));
    return path.isAbsolute(next) ? loadTsModule(next) : require(next);
  };

  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  fn(localRequire, mod, mod.exports, resolved, path.dirname(resolved));
  return mod.exports;
}

test('booking state machine allows only planned transitions', () => {
  const states = loadTsModule(
    path.join(repoRoot, 'src/features/booking/constants/bookingStates.ts'),
  );

  assert.equal(states.canTransition('IDLE', 'SELECTING_PACKAGE'), true);
  assert.equal(states.canTransition('SELECTING_PACKAGE', 'FILLING_DETAILS'), true);
  assert.equal(states.canTransition('SELECTING_PACKAGE', 'PAYMENT_SUCCESS'), false);
  assert.equal(states.canTransition('PAYMENT_PENDING', 'PAYMENT_SUCCESS'), true);
  assert.equal(states.getStepFromState('FILLING_DETAILS'), 2);
  assert.equal(states.getStepFromState('PAYMENT_FAILED'), 3);
});

test('booking form schema validates required goals and optional links', () => {
  const { bookingFormSchema } = loadTsModule(
    path.join(repoRoot, 'src/features/booking/schemas/bookingFormSchema.ts'),
  );

  assert.equal(
    bookingFormSchema.safeParse({
      goals: 'Review kiến trúc đồ án và hướng triển khai',
      questions: '',
      portfolioUrl: '',
    }).success,
    true,
  );

  assert.equal(
    bookingFormSchema.safeParse({
      goals: 'ngắn',
      questions: '',
      portfolioUrl: '',
    }).success,
    false,
  );

  assert.equal(
    bookingFormSchema.safeParse({
      goals: 'Review kiến trúc đồ án và hướng triển khai',
      questions: '',
      portfolioUrl: 'not-a-url',
    }).success,
    false,
  );
});

test('slot service chooses default active version and groups available slots', () => {
  const { getDisplayVersion, groupSlotsByPartOfDay } = loadTsModule(
    path.join(repoRoot, 'src/features/booking/services/slotService.ts'),
  );

  const pkg = {
    versions: [
      { id: 'inactive-default', isDefault: true, isActive: false },
      { id: 'active-default', isDefault: true, isActive: true },
      { id: 'active-other', isDefault: false, isActive: true },
    ],
  };

  assert.equal(getDisplayVersion(pkg).id, 'active-default');
  assert.equal(
    getDisplayVersion({
      versions: [
        { id: 'inactive-default', isDefault: true, isActive: false },
        { id: 'active-fallback', isDefault: false, isActive: true },
      ],
    }).id,
    'active-fallback',
  );

  const grouped = groupSlotsByPartOfDay([
    { startTime: '2026-05-11T09:00:00', endTime: '2026-05-11T10:00:00', available: true },
    { startTime: '2026-05-11T14:00:00', endTime: '2026-05-11T15:00:00', available: true },
    { startTime: '2026-05-11T19:00:00', endTime: '2026-05-11T20:00:00', available: true },
  ]);

  assert.equal(grouped.morning.length, 1);
  assert.equal(grouped.afternoon.length, 1);
  assert.equal(grouped.evening.length, 1);
});

test('checkout service builds backend orderInfo and maps payment status', () => {
  const { buildCheckoutOrderInfo, isSuccessfulPaymentStatus } = loadTsModule(
    path.join(repoRoot, 'src/features/booking/services/checkoutService.ts'),
  );

  const orderInfo = buildCheckoutOrderInfo('Goi review do an', {
    goals: 'Can mentor review kien truc va checklist truoc khi bao ve',
    questions: '',
    portfolioUrl: '',
  });

  assert.match(orderInfo, /Mentoree booking/);
  assert.match(orderInfo, /Goi review do an/);
  assert.equal(isSuccessfulPaymentStatus('SUCCESS'), true);
  assert.equal(isSuccessfulPaymentStatus('success'), true);
  assert.equal(isSuccessfulPaymentStatus('FAILED'), false);
});
