# Phase 4 — Section library

Builds the section library. Requires a product rail.

## Result

A designer builds a section from saved features and files it in a folder. Save writes `sections.tpssec.json`.

A section is a page region: a hero, a collection. It contains features, and may contain sections. It does not contain a raw element.

## File

Same envelope as the component library. `kind: "sections"`. A ref is `feature` or `section`.

Folders created with the library: Heroes, Collections.

A section’s padding is a padding token. Its margin is a margin token.

## Interaction

Add lists feature folders. If none exist: `Save a product rail on Features first` and `Go to Features`.

The fixture is `Collection` in Collections. Layout is a stack. The child is the product rail. Padding is Section. Margin is Screen.

## Exit test

1. Section padding follows the Section token on Mobile and Desktop.
2. Editing the rail updates the section.
3. The section is in Collections.
4. Export, reload, import. A feature file opened here is rejected.
5. The six questions in `UX_REQUIREMENTS.md` are answerable.

## Evidence

`docs/qa/QA_PHASE_04.md` records the commit, the six answers, feature-only contents, token spacing, the definition update, and console errors.
