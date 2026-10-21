import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const cli = new URL('./budoux-suggest.mjs', import.meta.url);
const run = (args, input = '') => spawnSync(process.execPath, [cli.pathname, ...args], {
  input,
  encoding: 'utf8',
  timeout: 5000,
});

test('review-only CLI advertises safe operating bounds without requiring BudouX', () => {
  const result = run(['--help']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /NEEDS_REVIEW/);
  assert.match(result.stdout, /no HTML\/DOM mutation/);
});

test('empty original text is rejected before dependency loading', () => {
  const result = run([], '');
  assert.equal(result.status, 2);
  assert.match(result.stderr, /KAIGYO_INPUT_REQUIRED/);
});

test('unknown or incomplete arguments are rejected', () => {
  for (const args of [['--unknown'], ['--protect'], ['--protect', '--unknown']]) {
    const result = run(args, '日本語');
    assert.equal(result.status, 2);
    assert.match(result.stderr, /KAIGYO_UNKNOWN_OR_INCOMPLETE_ARGUMENT/);
  }
});

import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

function runWithUntrustedModule(version) {
  const root = mkdtempSync(join(tmpdir(), 'kaigyo-budoux-version-gate-'));
  const packageRoot = join(root, 'node_modules', 'budoux');
  const moduleDir = join(packageRoot, 'module');
  const marker = join(root, 'executed-marker.txt');
  try {
    mkdirSync(moduleDir, { recursive: true });
    copyFileSync(fileURLToPath(cli), join(root, 'budoux-suggest.mjs'));
    copyFileSync(fileURLToPath(new URL('./budoux-review.mjs', import.meta.url)), join(root, 'budoux-review.mjs'));
    writeFileSync(join(packageRoot, 'package.json'), JSON.stringify({
      name: 'budoux', version, type: 'module', exports: { '.': './module/index.js' },
    }));
    writeFileSync(join(moduleDir, 'index.js'), [
      "import { writeFileSync } from 'node:fs';",
      `writeFileSync(${JSON.stringify(marker)}, "executed");`,
      'export const loadDefaultJapaneseParser = () => ({ parseBoundaries: () => [] });',
    ].join('\n'));
    const result = spawnSync(process.execPath, [join(root, 'budoux-suggest.mjs'), '--protect', 'Netsujo SIGNAL'], {
      input: 'Netsujo SIGNALを使う。',
      encoding: 'utf8',
      timeout: 5000,
    });
    return { result, executed: existsSync(marker) };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('unreviewed BudouX package must be rejected before its top-level runs', () => {
  const { result, executed } = runWithUntrustedModule('9.9.9');
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /BUDOUX_VERSION_MISMATCH/);
  assert.equal(executed, false, 'unreviewed module must never execute');
});

test('approved BudouX package can execute after the version gate', () => {
  const { result, executed } = runWithUntrustedModule('0.9.3');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(executed, true);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'NEEDS_REVIEW');
  assert.equal(report.originalText, 'Netsujo SIGNALを使う。');
  assert.equal(report.engineVersionExpected, '0.9.3');
});
function runCompanionWithFakeBudoux(version) {
  const root = mkdtempSync(join(tmpdir(), 'kaigyo-budoux-comparison-gate-'));
  const moduleDir = join(root, 'node_modules', 'budoux', 'module');
  const scriptsDir = join(root, 'scripts');
  const assetsDir = join(root, 'assets');
  const marker = join(root, 'comparison-imported.txt');
  try {
    mkdirSync(moduleDir, { recursive: true });
    mkdirSync(scriptsDir);
    mkdirSync(assetsDir);
    copyFileSync(fileURLToPath(new URL('./budoux-comparison.mjs', import.meta.url)),
      join(scriptsDir, 'budoux-comparison.mjs'));
    copyFileSync(fileURLToPath(new URL('./budoux-review.mjs', import.meta.url)),
      join(scriptsDir, 'budoux-review.mjs'));
    copyFileSync(fileURLToPath(new URL('../assets/budoux-benchmark-20261018.json', import.meta.url)),
      join(assetsDir, 'budoux-benchmark-20261018.json'));
    writeFileSync(join(root, 'node_modules', 'budoux', 'package.json'), JSON.stringify({
      name: 'budoux', version, type: 'module', exports: { '.': './module/index.js' },
    }));
    writeFileSync(join(moduleDir, 'index.js'), [
      "import { writeFileSync } from 'node:fs';",
      `writeFileSync(${JSON.stringify(marker)}, 'executed');`,
      'export const loadDefaultJapaneseParser = () => ({ parseBoundaries: () => [], parse: text => [text] });',
    ].join('\n'));
    const result = spawnSync(process.execPath, [join(scriptsDir, 'budoux-comparison.mjs')], {
      encoding: 'utf8',
      timeout: 5000,
    });
    return { result, executed: existsSync(marker) };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('comparison rejects an unreviewed BudouX version before module execution', () => {
  const { result, executed } = runCompanionWithFakeBudoux('9.9.9');
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, /BUDOUX_VERSION_MISMATCH/);
  assert.equal(executed, false, 'comparison must not execute unreviewed code');
});

test('comparison runs an approved BudouX after verifying its version', () => {
  const { result, executed } = runCompanionWithFakeBudoux('0.9.3');
  // Deliberately simplistic parser differs from frozen official-model fixtures.
  assert.equal(result.status, 1, result.stderr);
  assert.equal(executed, true);
  assert.match(result.stdout, /"modelDrift":/);
  assert.doesNotMatch(result.stderr, /BUDOUX_VERSION_MISMATCH/);
});
