# Acceptance

## Audit
PASS means findings are scoped, browser-observed, and evidence-backed.
Audit may return no confirmed defect, but must state routes/states/viewports actually observed.

## Fix
A source fix is not complete until:
- approved visible copy is unchanged
- source diff is minimal
- relevant source tests pass
- the exact changed source is rendered
- failure width and required responsive widths are inspected
- no new orphan/overflow is introduced
- paragraph splits/joins preserve visible wording and sentence order
- reviewed paragraph boundaries read as coherent rhetorical units rather than arbitrary one-sentence fragmentation

## Verify
RENDER_VERIFIED requires the final exact target and real-browser evidence.
Default widths: 320, 375, 768, 1024, 1440 CSS px plus the original failure width.

Record:
browser/version, viewport, content width, source SHA/ref, lines before/after, overflow, screenshot/evidence, tests, unsupported states.

## Fail closed
Use NEEDS_REVIEW for uncertain semantics.
Use NEEDS_LAYOUT_CHANGE when the required protected unit cannot fit without an authorized layout change.
Use BLOCKED for missing source/browser/authority required to make the requested claim.
Use QC_UNAVAILABLE once when an explicitly required independent review runtime is unavailable; do not provider-hop.
