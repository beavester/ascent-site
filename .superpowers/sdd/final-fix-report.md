# Final review fix report

## RED evidence

Command: `node --test tests/site.test.mjs`

- 39 tests: 29 passed, 10 failed.
- Shared stylesheet failed because `.brand` (and the remaining named interactive selectors) lacked a selector-specific 44px target.
- Small muted text contrast failed first on homepage `--ink-faint`.
- Opaque-surface guard failed on the homepage backdrop-filter.
- All seven comparison contracts failed because competitor entities had no stable `@id`; their Article relationships were therefore absent as well.
- The semantic breadcrumb assertion is part of each comparison contract and will be reached after the JSON-LD relationship failure is fixed.

## GREEN evidence

Production/test commit: `527f817` (`fix: harden comparison accessibility schema`)

- `node --test tests/site.test.mjs`: 39 passed, 0 failed.
- `git diff --check`: clean (no output).
- `git status --short`: clean after the production/test commit; this report is intentionally force-added because `.superpowers/sdd/` ignores evidence files by default.

## Exact files changed

- `.superpowers/sdd/final-fix-report.md`
- `index.html`
- `compare/index.html`
- `compare/head-to-head.css`
- `compare/ascent-vs-fabulous/index.html`
- `compare/ascent-vs-tiimo/index.html`
- `compare/ascent-vs-routinery/index.html`
- `compare/ascent-vs-finch/index.html`
- `compare/ascent-vs-streaks/index.html`
- `compare/ascent-vs-one-sec/index.html`
- `compare/ascent-vs-opal/index.html`
- `tests/site.test.mjs`

## Concerns

None. Editorial claims, canonical URLs, sitemap entries, App Store identity, pricing/duration language, and proposal publication status were left unchanged.
