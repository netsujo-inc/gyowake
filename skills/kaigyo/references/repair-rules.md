# Repair rules

Kaigyo changes reading-flow structure and layout behavior, not approved meaning. It may split or join paragraph containers when the visible wording and sentence order remain identical.

## Preferred primitives

For a host project:
- reuse any existing component that separates approved copy into protected and normal spans
- apply nowrap only to the shortest reviewed semantic phrase
- do not add a global typography policy for one example

Example intent:
HostSemanticText text="詳しい条件は個別契約に従います。" protect=["個別契約","従います。"]

Protect the smallest useful unit. Do not preserve an arbitrary "last four characters" rule.

## Copy invariant

The visible text before and after must be identical unless the task separately authorizes copy editing.
Preserve:
- exact Netsujo / Netsujo SIGNAL casing
- whitespace that belongs to canonical names
- punctuation
- values, currency, units, dates, percentages
- legal/commercial wording

## Paragraph structure

When a sentence starts a new rhetorical unit, prefer a new paragraph instead of relying on browser wrapping to communicate the transition. Split at sentence boundaries only; do not rewrite the sentence to manufacture a cleaner break.

Strong candidates include:
- a new event or decision: 「今回、…」
- a move from general rule to concrete operational detail: 「実際の…」
- contrast/caveat: 「一方で、…」「ただし、…」
- consequence/next action: 「そのため、…」「今後、…」

These markers are not mechanical triggers. Keep sentences together when they remain one continuous explanation.

## Repair sequence

1. split/join paragraph containers at reviewed sentence boundaries when paragraph structure is the root cause
2. remove accidental br / whitespace-pre / keep-all / paragraph nowrap if that is the root cause
3. add the smallest semantic protection
4. render again
5. inspect the neighboring lines and paragraph rhythm
6. if the shortest reviewed protected phrase cannot fit, keep that semantic unit intact and use only an authorized local width/padding/column layout change
7. if no authorized local layout change is available or sufficient, report NEEDS_LAYOUT_CHANGE instead of shrinking, clipping, or splitting text

Never reduce or split a protected semantic unit merely to make it fit.

text-wrap: balance may improve rhythm but does not prove semantic correctness.
