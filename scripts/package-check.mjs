import assert from 'node:assert/strict';
import { readdirSync, readFileSync, lstatSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const skill = join(root, 'skills/kaigyo');
const required = [
  'README.md', 'LICENSE', 'THIRD_PARTY.md', 'package.json',
  'skills/kaigyo/SKILL.md', 'skills/kaigyo/references/acceptance.md',
  'skills/kaigyo/references/defects.md', 'skills/kaigyo/references/repair-rules.md',
  'skills/kaigyo/references/budoux.md',
  'skills/kaigyo/demo/index.html',
  'skills/kaigyo/assets/demo-cases.json',
  'skills/kaigyo/scripts/semantic-core.js',
];
for (const path of required) assert.ok(readFileSync(join(root, path)).length, 'missing or empty '+path);
const meta = readFileSync(join(skill,'SKILL.md'),'utf8');
assert.equal(meta.split(String.fromCharCode(10))[1], 'name: kaigyo');
assert.match(meta, /version: "0.3.0-preview.1"/);
assert.match(meta, /real browser/);
const bad = [/design\/skills\/kaigyo\//, /docs\/design\/KAIGYO/, /\/Users\//, /\/private\/tmp\//, /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, /gh[pousr]_[A-Za-z0-9_]{10,}/];
let checked=0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path=join(dir,name);
    const stat=lstatSync(path);
    assert.ok(!stat.isSymbolicLink(), 'symbolic links not permitted: '+path);
    if (stat.isDirectory()) { walk(path); continue; }
    const text=readFileSync(path,'utf8');
    for (const pattern of bad) assert.ok(!pattern.test(text), 'private/site-bound pattern '+pattern+' in '+path);
    checked++;
  }
}
walk(skill);
assert.ok(checked>=14);
console.log('KAIGYO_PACKAGE_CHECK_PASS files='+checked);
