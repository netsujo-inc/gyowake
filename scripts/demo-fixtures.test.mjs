import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import '../skills/kaigyo/scripts/semantic-core.js';

const examples=JSON.parse(readFileSync(new URL('../skills/kaigyo/assets/demo-cases.json',import.meta.url),'utf8'));
const html=readFileSync(new URL('../skills/kaigyo/demo/index.html',import.meta.url),'utf8');

test('7 demo cases preserve the exact original text in both comparisons', () => {
  assert.equal(examples.length,7);
  assert.equal(new Set(examples.map(c=>c.id)).size,7);
  for (const c of examples) {
    assert.equal(typeof c.problem,'string');
    assert.equal(typeof c.method,'string');
    assert.ok(c.problem.length>=10 && c.method.length>=10,c.id);
    assert.equal(c.before.replaceAll('｜',''),c.text,'Before/After must show same visible copy: '+c.id);
    const segments=globalThis.KaigyoCore.splitProtected(c.text,c.protect);
    assert.equal(segments.map(s=>s.text).join(''),c.text,'protected segmentation must preserve copy: '+c.id);
    assert.equal(segments.filter(s=>s.protected).map(s=>s.text).length,c.protect.length,c.id);
  }
});

test('screenshot regression: condition and contract particle are protected', () => {
  const c=examples.find(x=>x.id==='compound');
  assert.equal(c.text,'詳しい条件は個別契約に従います。');
  assert.equal(c.before,'詳しい条｜件は個別契約｜に従います。');
  assert.deepEqual(c.protect,['条件は','個別契約に','従います。']);
});

test('fixture demonstration boundaries are made explicit', () => {
  assert.ok(examples.slice(0,5).every(c=>c.before.includes('｜')));
  assert.equal(examples.find(x=>x.id==='nowrap').beforeMode,'nowrap');
  assert.deepEqual(examples.find(x=>x.id==='normal').protect,[]);
  assert.match(html,/Before：読みにくい改行/);
  assert.match(html,/After：意味を保つ改行/);
  assert.match(html,/実際のブラウザで折り返しています/);
  assert.match(html,/要レイアウト調整/);
  assert.match(html,/role="status" aria-live="polite"/);
  assert.match(html,/aria-pressed/);
  assert.match(html, /class="title-unit">読みやすく。/);
  assert.match(html,/after\.innerHTML = renderProtected\(c\)/);
});
