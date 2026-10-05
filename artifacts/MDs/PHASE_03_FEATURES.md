# Phase 3 — Feature library

Builds the feature library. Requires a product card.

## Result

A designer builds a feature from saved components and files it in a folder. Save writes `features.tpsfea.json`.

A feature is a working region: a header, a product rail, a filter bar. It contains components, and may contain features. It does not contain a raw element.

## File

Same envelope as the component library. `kind: "features"`. A ref is `component` or `feature`.

Folders created with the library: Navigation, Commerce.

## Interaction

Add lists component folders, with search. If none exist: `Save a product card on Components first` and `Go to Components`.

The fixture is `Product rail` in Commerce: a row of three product-card instances. Each instance has its own title, price, and image. The card definition stays one item.

## Exit test

1. Three cards show different text. The component default is unchanged.
2. Editing the card button on Components updates all three cards, except a property that was overridden.
3. The feature is in Commerce.
4. Export, reload, import. A component file opened here is rejected.
5. The six questions in `UX_REQUIREMENTS.md` are answerable.

## Evidence

`docs/qa/QA_PHASE_03.md` records the commit, the six answers, component-only contents, instance overrides, the definition update, and console errors.
