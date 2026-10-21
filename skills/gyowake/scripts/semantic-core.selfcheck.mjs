import assert from "node:assert/strict";
import "./semantic-core.js";

const { splitProtected } = globalThis.GyowakeCore;
assert.equal(typeof splitProtected, "function");

const cases = [
  ["用途に合わせて、どの関わり方でも、選べます。", ["どの関わり方でも、"]],
  ["詳しい条件は個別契約に従います。", ["個別契約", "従います。"]],
  ["初回のご相談は30分です。", ["30分"]],
  ["改善の進行はNetsujo SIGNALが担当します。", ["Netsujo SIGNAL"]],
  ["大切な意思決定を、最後まで支援します。", ["支援します。"]],
  ["NetsujoとNetsujo", ["Netsujo"]],
  ["京都で働く。", []],
];

let checks = 0;
for (const [text, terms] of cases) {
  const parts = splitProtected(text, terms);
  assert.equal(parts.map((x) => x.text).join(""), text);
  for (const part of parts) assert.equal(text.slice(part.start, part.start + part.text.length), part.text);
  checks += 2;
}
assert.equal(splitProtected("NetsujoとNetsujo", ["Netsujo"]).filter((x) => x.protected).length, 2); checks++;
assert.equal(splitProtected("個別契約", ["個別", "個別契約"])[0].text, "個別契約"); checks++;
assert.throws(() => splitProtected("abc", ["z"])); checks++;
assert.throws(() => splitProtected("abc", [""])); checks++;
assert.throws(() => splitProtected(123, [])); checks++;
console.log("GYOWAKE_SEMANTIC_CORE_PASS checks=" + checks);
