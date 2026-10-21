# Kaigyo — Before / After examples

Open the [interactive public demo](https://kaigyo-demo.vercel.app/) to inspect the fixed examples and adjust available width and text scaling.

**Evidence type:** The cases in this document are hand-authored, synthetic demonstrations. The `｜` marker represents an awkward line boundary in a *fixture*; it is not an observed boundary of a specific third-party website. Final real-site acceptance requires an actual browser inspection at the target viewport, source SHA and surrounding content.

| Case | BEFORE — sample bad boundary | AFTER — reviewed phrase | Decision |
| --- | --- | --- | --- |
| Particle | `どの関わり方で｜も、` | `どの関わり方でも、` | Protect the complete short unit |
| Compound | `個別契｜約` | `個別契約` | Keep the compound together, recheck next line |
| Number + unit | `30｜分` | `30分` | Keep the measurement intact |
| Product name | `Netsujo｜SIGNAL` | `Netsujo SIGNAL` | Protect reviewed canonical name |
| Short predicate | `支援しま｜す。` | `支援します。` | Protect short predicate, not last N characters |
| Excess nowrap | A whole paragraph overflows | Normal wrapping + minimal protected phrases | Release broad nowrap; verify overflow |
| Natural break | `京都で｜働く。` | Unchanged | Keep natural reading flow |

## Actual HTML transformation pattern

When a host project has a suitable semantic-text helper, reuse it. For a reviewed short phrase:

```jsx
// Example only; adapt to the host project's existing components.
const text = "詳しい条件は個別契約に従います。";
const protect = ["個別契約", "従います。"];
// Render the normal spans with wrapping and short protected spans
// with white-space: nowrap. Escape any untrusted input as text nodes.
```

The Skill workflow performs three explicit operations:
1. **Audit:** observe rendered lines and classify confirmed semantic defects, noting unsupported states.
2. **Fix:** modify the smallest authorized source/layout cause while preserving approved visible copy.
3. **Verify:** capture AFTER lines, overflow/clipping, font and viewports in the real browser.

For paragraph changes, use semantic topic boundaries. Joining or splitting paragraph containers can change the rhythm while retaining exactly the same visible words; do not split every sentence by rule.

## What the tool actually automates

- The dependency-free semantic core segments a given string around **human-approved** protected phrases without changing text.
- The optional BudouX adapter produces **candidate** boundaries for review (`NEEDS_REVIEW`), with pinned-version checks.
- The interactive demo renders seven fixed examples with selectable widths and font scaling.

**Not established by the demo:** reliable automatic detection across arbitrary websites, universal fixes, cross-browser typography equivalence, native zoom compliance, WCAG conformance or real-site QA. Text meaning/paragraph rhythm needs review, while real visual passes need direct browser evidence.

If even the shortest protected phrase cannot fit, report `NEEDS_LAYOUT_CHANGE` and seek an authorized local layout change; avoid font shrinking, clipping or splitting the phrase.
