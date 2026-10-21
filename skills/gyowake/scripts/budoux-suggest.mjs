#!/usr/bin/env node
/** Local, review-only Gyowake boundary suggestions from optional BudouX. */
import { readFileSync } from 'node:fs';
import { reviewBudouxBreaks } from './budoux-review.mjs';

const usage = [
  'Gyowake × BudouX: review-only phrase suggestions (no HTML/DOM mutation).',
  'Usage: printf %s TEXT | node skills/gyowake/scripts/budoux-suggest.mjs [--protect PHRASE]...',
  'Requires locally installed budoux@0.9.3 (optional; no auto-install).',
  'Output is JSON with status NEEDS_REVIEW; render/browser verification is still required.',
].join('\n');

function parseArgs(args) {
  const protect = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { help: true, protect };
    if (arg !== '--protect' || i + 1 >= args.length || args[i + 1].startsWith('--')) {
      throw new Error('GYOWAKE_UNKNOWN_OR_INCOMPLETE_ARGUMENT: ' + arg);
    }
    protect.push(args[++i]);
  }
  return { help: false, protect };
}

try {
  const { help, protect } = parseArgs(process.argv.slice(2));
  if (help) {
    process.stdout.write(usage + '\n');
  } else {
    const text = readFileSync(0, 'utf8');
    if (!text) throw new Error('GYOWAKE_INPUT_REQUIRED: supply the original text through stdin');
    // Resolve package metadata without executing the module. Reject version drift
    // before the first import; even a rejected ESM module may have top-level effects.
    let budouxEntry;
    try {
      budouxEntry = import.meta.resolve('budoux');
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND') {
        throw new Error('BUDOUX_NOT_INSTALLED: install pinned budoux@0.9.3 in an isolated local environment');
      }
      throw error;
    }
    const packageUrl = new URL('../package.json', budouxEntry);
    const packageVersion = JSON.parse(readFileSync(packageUrl, 'utf8')).version;
    if (packageVersion !== '0.9.3') {
      throw new Error('BUDOUX_VERSION_MISMATCH: expected 0.9.3, found ' + String(packageVersion));
    }
    // Import the exact entrypoint whose package metadata passed the gate.
    const budoux = await import(budouxEntry);
    const parser = budoux.loadDefaultJapaneseParser();
    const result = reviewBudouxBreaks(text, parser, protect);
    process.stdout.write(JSON.stringify({
      ...result,
      engine: 'BudouX (locally installed)',
      engineVersionExpected: '0.9.3',
      application: 'suggestions-only',
    }, null, 2) + '\n');
  }
} catch (error) {
  process.stderr.write(String(error?.message || error) + '\n');
  process.exitCode = 2;
}
