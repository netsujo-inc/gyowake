/** Optional local comparison against the installed, pinned BudouX npm package. */
import { readFileSync } from 'node:fs';
import { reviewBudouxBreaks } from './budoux-review.mjs';

// Validate the resolved package metadata before importing its executable code.
let budoux;
let budouxEntry;
try {
  budouxEntry = import.meta.resolve('budoux');
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
  console.error('BudouX optional dependency is missing. No changes were made.');
  console.error('Install only for local review: npm install --no-save --package-lock=false --ignore-scripts --no-audit --no-fund budoux@0.9.3');
  process.exitCode = 2;
}
if (budouxEntry) {
  const packageUrl = new URL('../package.json', budouxEntry);
  const packageVersion = JSON.parse(readFileSync(packageUrl, 'utf8')).version;
  if (packageVersion !== '0.9.3') {
    console.error('BUDOUX_VERSION_MISMATCH: expected 0.9.3, found ' + String(packageVersion));
    process.exitCode = 2;
  } else {
    budoux = await import(budouxEntry);
  }
}
if (budoux) {
  const parser = budoux.loadDefaultJapaneseParser();
  const fixtures = JSON.parse(readFileSync(new URL('../assets/budoux-benchmark-20261018.json', import.meta.url), 'utf8'));
  let conflicts = 0;
  let drift = 0;
  for (const c of fixtures) {
    const outcome = reviewBudouxBreaks(c.text, parser, c.protect);
    const actualChunks = parser.parse(c.text);
    const expectedSame = JSON.stringify(actualChunks) === JSON.stringify(c.budouxChunks);
    if (!expectedSame) drift++;
    if (outcome.blockedBoundaries.length) conflicts++;
    console.log(JSON.stringify({
      id: c.id, actual: actualChunks, baseline: c.budouxChunks,
      baselineMatch: expectedSame, conflicts: outcome.blockedBoundaries,
      status: outcome.status,
    }));
  }
  console.log(JSON.stringify({summary: {cases: fixtures.length, conflicts, modelDrift: drift, mode: 'CANDIDATE_ONLY_NOT_RENDER_VERIFIED'}}));
  // Historical frozen results may differ from a published npm release; drift must be reviewed.
  if (drift) process.exitCode = 1;
}
