# Phase 5 — Pages

Builds the page library. Requires a collection section.

## Result

A designer builds a page from saved sections. The page is the root. Save writes `pages.tpspge.json`.

## File

Same envelope as the component library. `kind: "pages"`. A ref is `section` only.

Folder created with the library: Pages.

The page uses the Screen margin token. Sections stack with the Section padding token between them.

## Interaction

Add lists section folders. If none exist: `Save a collection on Sections first` and `Go to Sections`.

The fixture is `Shop`. It holds two instances of Collection, with different product text. One section definition.

## Exit test

1. Page margin follows Screen on Mobile and Desktop.
2. The two instances show different text.
3. The page is in Pages.
4. Export, reload, import. A section file opened here is rejected.
5. The six questions in `UX_REQUIREMENTS.md` are answerable.

## Evidence

`docs/qa/QA_PHASE_05.md` records the commit, the six answers, section-only contents, the margin token, the two instances, and console errors.
