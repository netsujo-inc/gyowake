import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { reviewBudouxBreaks, splitAtBoundaries } from './budoux-review.mjs';

function fixedParser(boundaries) {
  return { parseBoundaries: () => boundaries };
}

test('BudouX candidates are review-only and respect exact reviewed phrases', () => {
  const text = '用途に合わせて、どの関わり方でも、選べます。';
  const index = text.indexOf('関わり方でも');
  const result = reviewBudouxBreaks(text, fixedParser([index]), ['どの関わり方でも、']);
  assert.equal(result.status, 'NEEDS_REVIEW');
  assert.equal(result.originalText, text);
  assert.deepEqual(result.proposedBoundaries, []);
  assert.deepEqual(result.blockedBoundaries, [{ at: index, phrases: ['どの関わり方でも、'] }]);
  assert.equal(result.proposedChunks.join(''), text);
});

test('repeated and overlapping terms all remain protected', () => {
  const text = 'Netsujo SIGNALとNetsujo SIGNAL';
  const split1 = text.indexOf('SIGNAL');
  const split2 = text.lastIndexOf('SIGNAL');
  const result = reviewBudouxBreaks(text, fixedParser([split1, split2]), ['Netsujo SIGNAL', 'SIGNAL']);
  assert.equal(result.blockedBoundaries.length, 2);
  for (const b of result.blockedBoundaries) assert.ok(b.phrases.includes('Netsujo SIGNAL'));
});

test('non-conflicting breaks are proposed without rewriting text', () => {
  const text = '京都で働く。';
  const result = reviewBudouxBreaks(text, fixedParser([3]), []);
  assert.deepEqual(result.proposedChunks, ['京都で', '働く。']);
  assert.deepEqual(result.blockedBoundaries, []);
  assert.equal(result.proposedChunks.join(''), text);
  assert.equal(result.status, 'NEEDS_REVIEW');
});

test('invalid parser input, unsorted offsets, and surrogate split fail closed', () => {
  assert.throws(() => reviewBudouxBreaks(null, fixedParser([])));
  assert.throws(() => reviewBudouxBreaks('abc', {}, []));
  assert.throws(() => reviewBudouxBreaks('abc', fixedParser([]), ['']));
  assert.throws(() => reviewBudouxBreaks('abc', fixedParser([]), ['absent']));
  assert.throws(() => reviewBudouxBreaks('abc', fixedParser([2, 1])));
  assert.throws(() => reviewBudouxBreaks('abc', fixedParser([1, 1])));
  assert.throws(() => reviewBudouxBreaks('abc', fixedParser([3])));
  assert.throws(() => reviewBudouxBreaks('a😀b', fixedParser([2])));
  assert.deepEqual(splitAtBoundaries('', []), []);
});

test('19 frozen upstream-model results are reproducibly screened', () => {
  const path = new URL('../assets/budoux-benchmark-20261018.json', import.meta.url);
  const cases = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(cases.length, 19);
  let blocked = 0;
  for (const c of cases) {
    const boundaries = [];
    let offset = 0;
    for (const chunk of c.budouxChunks.slice(0, -1)) {
      offset += chunk.length;
      boundaries.push(offset);
    }
    assert.equal(c.budouxChunks.join(''), c.text);
    const result = reviewBudouxBreaks(c.text, fixedParser(boundaries), c.protect);
    assert.deepEqual(result.candidateBoundaries, boundaries);
    assert.equal(result.proposedChunks.join(''), c.text);
    const isBlocked = result.blockedBoundaries.length > 0;
    assert.equal(isBlocked, c.expectedConflict, 'fixture drift: '+c.id);
    if (isBlocked) blocked++;
  }
  assert.equal(blocked, 4);
});
