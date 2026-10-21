# Gyowake — Before / After examples

Open the [interactive public demo](https://gyowake-demo.vercel.app/) to inspect the fixed examples and adjust available width and text scaling.

**Evidence type:** These are hand-authored synthetic demonstrations. In the interactive demo, Before and After use the **same exact sentence**: `｜` represents an intentionally forced bad break in the Before fixture; After uses browser wrapping with short protected phrases. Final real-site acceptance requires the target viewport, exact source SHA and real browser evidence.

| Case | BEFORE — sample bad boundary | AFTER — reviewed phrase | Decision |
| --- | --- | --- | --- |
| Particle | `どの関わり方で｜も、` | `どの関わり方でも、` | Protect the complete short unit |
| Compound | `詳しい条｜件は個別契約｜に従います。` | `詳しい条件は個別契約に従います。` | Protect `条件は` and `個別契約に`; review adjacent predicate |
| Number + unit | `初回のご相談は30｜分です。` | `初回のご相談は30分です。` | Protect `30分です。` as a short complete unit |
| Product name | `Netsujo｜SIGNAL` | `Netsujo SIGNAL` | Protect reviewed canonical name |
| Short predicate | `支援しま｜す。` | `支援します。` | Protect short predicate, not last N characters |
| Excess nowrap | A whole paragraph overflows | Normal wrapping + minimal protected phrases | Release broad nowrap; verify overflow |
| Natural break | `京都で働く。` | Same text | Leave normal wrapping alone |

## Actual HTML transformation pattern

When a host project has a suitable semantic-text helper, reuse it. For a reviewed short phrase (match the complete original copy):

```jsx
// Example only; adapt to the host project's existing components.
const text = "詳しい条件は個別契約に従います。";
const protect = ["条件は", "個別契約に", "従います。"];
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

## Interpreting the interactive status

The live demo reports that the **selected protected phrases fit inside the current text box**. Its status is intentionally scoped. The browser may still require human review for neighboring predicates or paragraph rhythm. When a protected phrase itself exceeds the available box width (for example at 200% text scaling), the demo explicitly reports **layout adjustment needed** and makes overflowing protected text available via horizontal scrolling. This demonstrates an unresolved constraint, not an automatic correction.

The controls scale the fixture text in CSS. They do not simulate or certify every browser-native 200% zoom scenario. Run real-site visual checks across responsive widths, font metrics and browser engines before acceptance.
