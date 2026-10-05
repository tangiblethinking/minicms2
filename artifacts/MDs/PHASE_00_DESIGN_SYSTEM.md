# Phase 0 — Design system

Creates the app. Builds the design system only.

## Result

A designer names colors, font families, type styles, padding, gap, margin, and radius. H1 has a point size. The sample uses that size. Save writes `design-system.tpsds.json`.

## File

```ts
type DesignSystemFile = {
  schemaVersion: 2;
  kind: "design-system";
  id: string;
  name: string;
  updatedAt: string;
  tailwindVersion: "4.3";
  colors: { id: string; name: string; value: string }[];
  fonts: { id: string; name: string; stack: string }[];
  typeStyles: {
    id: string;
    name: string;
    tag: string;
    fontId: string;
    sizePt: number;
    lineHeight: number;
    weight: number;
  }[];
  spacing: {
    padding: SpacingToken[];
    gap: SpacingToken[];
    margin: SpacingToken[];
  };
  radius: { id: string; name: string; value: string }[];
};

type SpacingToken = { id: string; name: string; mobile: string; desktop: string };
```

Opening values:

- Brand `#9a3412`, Ink `#1c1917`, Muted `#78716c`, Surface `#ffffff`
- Sans and Display, stack `ui-sans-serif, system-ui, sans-serif`
- H1 32pt, H2 24pt, H3 20pt, H4 18pt, H5 16pt, H6 14pt, Body 16pt, Small 14pt, Label 12pt. Line height is 1.2 times the size. Weight 600 for H1–H3, 400 for the rest.
- Padding: Compact `8px / 12px`, Comfortable `16px / 24px`, Section `32px / 64px`
- Gap: Tight `8px / 12px`, Comfortable `16px / 24px`
- Margin: Screen `16px / 32px`
- Radius: Card `1rem`

A file that is not `kind: "design-system"` and `schemaVersion: 2` is rejected: `This file is not a design system. Open it on its own shelf.`

## Interaction

Left groups: Color, Font, Type, Padding, Gap, Margin, Radius. Add files the new item into the open group.

Type style controls: Name, Tag, Font, Size, Line height, Weight. Size is a number. The line under it reads `32pt`.

Spacing controls: Name, Mobile, Desktop. The line under the group says what the axis means. Padding is vertical space between items. Gap is horizontal space inside an item. Margin is the screen sides.

Center sample: one line per type style, in that style’s font and pt size; a color swatch row; a stack using Comfortable padding and Tight gap.

Mobile and Desktop switch the sample between the two spacing values.

Buttons: `Save design system`, `Export design system`, `Import`.

## Exit test

1. Select H1. Change Size from 32 to 36. The sample H1 grows. The hint reads `36pt`.
2. Set H1’s font to Display. The sample uses that family.
3. Comfortable padding is 16px on Mobile and 24px on Desktop. Switching the top bar changes the sample.
4. Save, export, reload, import. H1 is still 36pt.
5. An element library file is rejected. The open design system stays.
6. The six questions in `UX_REQUIREMENTS.md` are answerable.

## Evidence

`docs/qa/QA_PHASE_00.md` records the commit, the six answers, H1 pt repaint, both spacing values, the rejected import, and console errors.
