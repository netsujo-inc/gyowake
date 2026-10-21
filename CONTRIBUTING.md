# Contributing

Thank you for contributing to Kaigyo. Please open an issue with a small, synthetic Japanese example, browser/version, viewport and text width, before/after rendered line boundaries, and expected behavior. Avoid customer text, secrets and local machine paths.

Changes should preserve approved visible text and respect the source-write/publishing authority of the host project.

Run `npm test` before opening a PR. For browser-sensitive fixes attach screenshots or equivalent real DOM geometry at affected widths and include 200% text resize when relevant. Tests passing alone prove only the fixtures and covered code paths.

BudouX candidates always remain `NEEDS_REVIEW`. No automatically added breaking spaces, rewriting of untrusted HTML, global nowrap or auto-shrinking text.
