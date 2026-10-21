# BudouX optional review and provenance

Gyowake uses BudouX only when a user explicitly installs `budoux@0.9.3` in a separate local checkout. Its proposed phrase boundaries are filtered through reviewed protected phrases and always marked `NEEDS_REVIEW`. The tool never changes website markup.

A controlled benchmark on 2026-10-18 contained 19 Japanese strings: 15 had no conflict, and 4 proposed a boundary inside a protected phrase (14 of 18 protected examples matched). This measures agreement with those selected examples, not general NLP accuracy or arbitrary website usability.

The earlier source comparison and isolated published-package test both observed these four conflicts; results are embedded in the versioned fixture `assets/budoux-benchmark-20261018.json`. A separate synthetic Chrome test with 210 geometry cases did not establish real-website or cross-browser acceptance; some 200% cases still required layout adjustments.

For optional local tests:

```sh
npm install --no-save --package-lock=false --ignore-scripts --no-audit --no-fund budoux@0.9.3
npm run gyowake:compare
```

BudouX is Apache-2.0 (https://github.com/google/budoux). Its source/model/training corpus are not bundled. The Japanese model uses the KNBC corpus according to the upstream project; the training-data license was not independently audited. Avoid copying training data or distributing modified models without targeted legal review.

Never process untrusted HTML through BudouX HTML helpers without independent sanitization. Gyowake passes plain strings and produces candidate boundaries only. Real-browser evidence and human/editorial judgment remain required.
