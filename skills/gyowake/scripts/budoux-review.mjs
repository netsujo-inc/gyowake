/**
 * Review-only adapter for BudouX's Parser.parseBoundaries(text).
 * This file contains no BudouX code or model weights. No DOM/HTML mutation occurs.
 * Output is proposed break positions, never a verified or automatically-applied fix.
 */
export function reviewBudouxBreaks(text, parser, protect = []) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  if (!parser || typeof parser.parseBoundaries !== 'function') {
    throw new TypeError('parser must expose parseBoundaries(text)');
  }
  if (!Array.isArray(protect)) throw new TypeError('protect must be an array');

  const ranges = [];
  for (const phrase of new Set(protect)) {
    if (typeof phrase !== 'string' || !phrase.trim() || !text.includes(phrase)) {
      throw new Error('every protected phrase must be nonempty and present in source text');
    }
    let index = 0;
    while ((index = text.indexOf(phrase, index)) !== -1) {
      ranges.push({ phrase, start: index, end: index + phrase.length });
      index += 1;
    }
  }

  const candidates = parser.parseBoundaries(text);
  if (!Array.isArray(candidates)) throw new TypeError('parseBoundaries must return an array');
  let previous = 0;
  for (const at of candidates) {
    if (!Number.isInteger(at) || at <= previous || at >= text.length) {
      throw new RangeError('boundaries must be sorted, distinct UTF-16 interior offsets');
    }
    if ((text.codePointAt(at - 1) ?? 0) > 0xffff) {
      throw new RangeError('a boundary must not split a surrogate pair');
    }
    previous = at;
  }

  const proposedBoundaries = [];
  const blockedBoundaries = [];
  for (const at of candidates) {
    const conflicts = ranges.filter(r => r.start < at && at < r.end);
    if (conflicts.length) {
      blockedBoundaries.push({ at, phrases: [...new Set(conflicts.map(r => r.phrase))] });
    } else {
      proposedBoundaries.push(at);
    }
  }

  return {
    originalText: text,
    candidateBoundaries: [...candidates],
    proposedBoundaries,
    blockedBoundaries,
    proposedChunks: splitAtBoundaries(text, proposedBoundaries),
    /** Deliberately always needs a rendered/human review; never auto-PASS. */
    status: 'NEEDS_REVIEW',
  };
}

export function splitAtBoundaries(text, boundaries) {
  if (typeof text !== 'string' || !Array.isArray(boundaries)) throw new TypeError('invalid arguments');
  let previous = 0;
  const result = [];
  for (const at of boundaries) {
    if (!Number.isInteger(at) || at <= previous || at >= text.length) {
      throw new RangeError('boundaries must be strictly ascending interior offsets');
    }
    if ((text.codePointAt(at - 1) ?? 0) > 0xffff) throw new RangeError('boundary splits a surrogate pair');
    result.push(text.slice(previous, at));
    previous = at;
  }
  if (text.length) result.push(text.slice(previous));
  return result;
}
