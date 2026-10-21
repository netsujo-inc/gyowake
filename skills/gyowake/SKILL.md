---
name: gyowake
description: Audit, repair, and verify awkward Japanese web line and paragraph breaks without rewriting approved copy. Use for 改行, 段落, 変な改行, 助詞の孤立, 文節分断, 意味転換点の段落不足, 固有名詞・製品名・数字と単位の分断, 語尾だけの行, Japanese typography, responsive text wrapping, or explicit Gyowake requests.
compatibility: Requires source access for fix mode and a real browser for rendered verification. A URL without writable source is audit-only.
metadata:
  author: Netsujo
  version: "0.3.0-preview.2"
  release-status: "public-preview"
---

# 行わけ（Gyowake）

Gyowake is a specialist Skill, not a new agent, daemon, controller, or deployment lane.
The calling Designer / Implementer / QA agent keeps scope, permissions, writer ownership, PR lifecycle, and final reporting.

## Purpose

Improve Japanese web line-break and paragraph readability while preserving approved visible copy exactly.
Gyowake covers both inline wrapping and paragraph structure when the visible wording stays unchanged. A new sentence that resets the topic, narrows scope, states a consequence, or begins with a discourse marker such as 「今回、」「実際の」「一方で、」「そのため、」 may need its own paragraph when keeping it in the previous paragraph weakens scanability.
Do not treat every line or paragraph break as a defect. Observe the real rendered structure first, classify it, repair the smallest cause, then re-render.

Read:
- references/defects.md
- references/repair-rules.md
- references/acceptance.md
- assets/demo-cases.json when explaining or demonstrating the Skill

Reuse the host repository's existing SemanticText / NoWrap equivalent when available.
Reuse the target project’s existing semantic-text / short nowrap components when available. The Skill has no bundled React dependency.

## Optional BudouX candidate-assisted review

Use BudouX only as an opt-in, local **candidate boundary** source when an installed, reviewed parser is available. Pass its parseBoundaries(text) output through scripts/budoux-review.mjs with the existing reviewed protection phrases. It will return proposed, blocked, and original byte-for-byte text, with NEEDS_REVIEW (never PASS). No parser availability means keep the current manual/browser path; do not auto-install dependencies or send website/customer text to an external API.

Do not apply raw BudouX HTML output, global word-break: keep-all, zero-width spaces, inferred nonbreaking spans, or a model-generated fix directly to customer-facing pages. Use the target project’s existing short-phrase protection components, inspect adjacent predicate/tail, and re-render every affected viewport. Paragraph boundaries remain editorial/human decisions. See references/budoux.md for the fixed comparison, optional dependency and license boundary.

### Local review command

For arbitrary Japanese text, the optional CLI is `npm run gyowake:suggest -- --protect 'Netsujo SIGNAL'` with original copy piped through stdin. It uses an explicitly installed local `budoux@0.9.3`, refuses to auto-install, and returns `NEEDS_REVIEW` JSON containing proposed and blocked breaks. Preserve the user's original wording and never treat this as final visual QA. If BudouX is unavailable, continue existing manual/browser Gyowake; do not claim it ran. See `references/budoux.md`.

## Modes

### audit
Default for "Gyowakeで見て", "改行を監査して", or a URL-only request.
Read-only. Return findings, observed line boundaries, likely cause, proposed repair, screenshots/evidence, and uncertainty.

### fix
Use only when the caller already has source-write authority and owns the relevant files.
Apply the smallest local source/layout change, then run source and rendered verification.
Fix mode does not authorize merge, deploy, restart, or Production mutation.

### verify
Read-only final check of a supplied exact source/rendered target.
Do not silently repair the target during verify.

## Procedure

### 1. Resolve target and authority
Identify repository/URL/route/component/locale/viewport/UI state/exact source identity.
Read repository instructions and design authority first.
Do not collide with another writer on the same files.

Whole-site requests require an inventory of public routes, shared templates, and relevant UI states.
A sitemap is discovery evidence, not proof of authenticated or expanded-state coverage.

### 2. Observe real browser geometry
Wait for fonts and the target state.
Record browser/version, viewport, content-box width, font family/size/weight/line-height, language, and source identity.
Use rendered text geometry or equivalent browser evidence to reconstruct visible lines.
Do not infer a browser line break only from source newlines or string length.
Keep a screenshot or comparable visual proof.

Unsupported surfaces such as canvas text, image text, ruby edge cases, cross-origin frames, vertical writing, or unobserved virtualized content are UNSUPPORTED/NEEDS_REVIEW, never automatic PASS.

### 3. Classify the break
Block or review:
- detached particles or short functional tails where meaning becomes awkward
- split bunsetsu / short verb group when the split damages reading
- split proper names, company names, product names, role names, or reviewed compounds
- split number + counter/unit/date/percentage where they should read as one value
- isolated one- or two-character continuation lines as a review signal
- overbroad nowrap/keep-all that causes overflow or unreadably wide copy
- presentation-only forced breaks that contradict responsive reading
- missed paragraph boundaries where a complete sentence introduces a clear topic/scope/consequence shift and visually burying it in the previous paragraph reduces scanability
- over-fragmented paragraphs where every sentence is separated despite belonging to one continuous thought

For paragraph-boundary review, judge sentence role rather than trigger words alone. 「今回、」 or 「実際の」 is evidence only when the sentence is independently meaningful and starts a new rhetorical unit.

Do not automatically fail ordinary Japanese wrapping merely because a word spans lines.
Poetry, addresses, source code, deliberate editorial breaks, and intentional labels can be valid.

Mark uncertain semantic judgments NEEDS_REVIEW instead of manufacturing certainty.

### 4. Repair the smallest cause
Preserve visible copy byte-for-byte: spaces, punctuation, digits, product spelling, prices, dates, and commercial conditions.
Prefer this order:
1. when the defect is paragraph structure, split or join existing sentences at the smallest semantic boundary without changing visible wording
2. remove an erroneous forced break or overbroad nowrap/keep-all
3. protect the shortest reviewed semantic phrase
4. keep normal wrapping everywhere else
5. if the shortest reviewed protected phrase itself cannot fit, keep that semantic unit intact; do not split, narrow, or relax it
6. use only an authorized local width/padding/column layout change that preserves the complete protected unit
7. if no authorized local layout change is available or sufficient, report NEEDS_LAYOUT_CHANGE

Never solve Gyowake by:
- shrinking type automatically
- hiding, clipping, ellipsizing, or truncating copy
- inserting arbitrary spaces
- rewriting approved copy without separate copy authority
- wrapping the whole paragraph in nowrap
- adding a global keep-all rule to make one example pass

After protecting one compound, re-check the neighboring predicate/tail. A local fix can create a new orphan.

### 5. Verify
Default web widths: 320, 375, 768, 1024, 1440 CSS px, plus the observed failing width and boundary widths around the transition.
Check responsive state changes and font loading.
When 200% text resize is required, test it honestly; viewport halving is only reflow-equivalence evidence.

RENDER_VERIFIED requires:
- no confirmed target semantic-break defect in scope
- no new neighboring semantic defect
- no horizontal overflow/clipping
- visible copy unchanged
- no automatic type shrink
- scoped regression checks PASS
- touched controls retain usable names/focus behavior

### 6. Report
For each finding include:
- route/component + exact source identity
- viewport/content width
- BEFORE visible lines
- defect class + confidence
- minimal repair + protected phrase(s)
- AFTER visible lines
- geometry/overflow result
- screenshot/evidence reference
- tests
- unresolved items and exclusions

Statuses:
SOURCE_ONLY, RENDER_VERIFIED, NEEDS_REVIEW, NEEDS_LAYOUT_CHANGE, BLOCKED.

If required independent QC is unavailable, record QC_UNAVAILABLE once for that exact target.
Do not cycle providers to manufacture PASS.

## User-facing demo language

Explain the Skill with concrete examples, not abstract typography jargon:

- どの関わり方で｜も、 → protect "どの関わり方でも、"
- 個別契｜約 → protect "個別契約", then re-check the following predicate
- 30｜分 → protect "30分"
- Netsujo｜SIGNAL → protect the canonical product name
- 支援しま｜す。 → protect the reviewed predicate "支援します。"
- whole paragraph nowrap → remove it and protect only short semantic units
- 京都で｜働く。 → usually leave unchanged if the reading remains natural

The demo proves a chosen repair's reflow behavior; it is not evidence that arbitrary unseen websites are automatically classified correctly.

## Boundaries

Gyowake is Japanese reading-flow scope: inline semantic wrapping plus paragraph-boundary structure that can be repaired without changing approved wording. Copy rewriting, broken images, stale sitemap metadata, brand-casing lint, SEO, or general accessibility work remain separate unless the user explicitly includes them.
Invocation never authorizes merge, deploy, Production mutation, external upload, or publication.
