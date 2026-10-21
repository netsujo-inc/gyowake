# Gyowake defect classes

## Confirmed/blocking classes

1. DETACHED_PARTICLE
A particle or short functional ending becomes visually detached so the phrase is materially harder or misleading to read.
Example: どの関わり方で｜も、

2. SPLIT_SEMANTIC_UNIT
A reviewed short bunsetsu, verb group, compound, or fixed phrase is divided at a boundary that damages comprehension.
Example: 個別契｜約

3. SPLIT_PROPER_NAME
A company, product, role, protocol name, or other reviewed proper name is split.
Example: Netsujo｜SIGNAL

4. SPLIT_NUMBER_UNIT
A number and its counter/unit/date/percentage grouping are separated where the value should be read as one unit.
Example: 30｜分

5. ORPHAN_TAIL
A one- or two-character tail, punctuation cluster, or predicate ending is stranded. This is a review signal first; confirm in context before blocking.
Example: 支援しま｜す。

6. OVERBROAD_NO_WRAP
The implementation prevents reasonable wrapping and causes overflow, clipping, or an unreadably wide line.

7. FORCED_BREAK_MISMATCH
A source/presentation forced break imposes a line ending that no longer fits responsive content.

8. MISSED_PARAGRAPH_BOUNDARY
Two or more complete sentences are kept in one paragraph even though a later sentence starts a distinct rhetorical unit and should be visually separated for scanability.
Typical evidence: the later sentence independently states a new event, scope, caveat, consequence, or operational detail. Sentence-openers such as 「今回、」「実際の」「一方で、」「そのため、」 are clues, not automatic rules.

9. OVER_FRAGMENTED_PARAGRAPH
Continuous sentences that form one thought are split into separate paragraphs without a meaningful rhetorical boundary, creating choppy reading.

## Non-defects by default

- a normal Japanese line break that still reads naturally
- short labels intentionally kept compact
- poetry or editorial lineation
- addresses and code where different rules apply
- a line becoming shorter only because responsive width changed

A machine count of zero is not proof. Rendered evidence and scoped human semantic judgment remain required.
