import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const pkg=JSON.parse(read('package.json'));
const skill=read('skills/gyowake/SKILL.md');
const demo=read('skills/gyowake/demo/index.html');
const readme=read('README.md');

test('Gyowake branding and installation paths stay consistent', () => {
  assert.equal(pkg.name, 'gyowake-skill');
  assert.equal(pkg.private, true);
  assert.match(skill, /name: gyowake/);
  assert.match(skill, /# 行わけ（Gyowake）/);
  assert.match(demo, /<title>行わけ（Gyowake）/);
  assert.match(demo, /github.com\/netsujo-inc\/gyowake/);
  assert.match(readme, /https:\/\/gyowake-demo.vercel.app/);
  assert.match(readme, /skills\/gyowake/);
  assert.match(readme, /npmには公開していません/);
  assert.ok(existsSync(new URL('../docs/images/gyowake-demo-mobile.png', import.meta.url)));
  assert.ok(existsSync(new URL('../docs/images/gyowake-demo-desktop.png', import.meta.url)));
});

test('old JS consumer alias stays functional during migration', async () => {
  await import('../skills/gyowake/scripts/semantic-core.js');
  assert.equal(globalThis.KaigyoCore, globalThis.GyowakeCore);
  assert.deepEqual(globalThis.GyowakeCore.splitProtected('詳しい条件は', ['条件は']).map(p => p.text), ['詳しい', '条件は']);
});
