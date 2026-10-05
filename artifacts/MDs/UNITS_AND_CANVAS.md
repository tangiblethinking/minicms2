# Units and canvas handoff

Designer request, implemented on `main`.

## Canvas

The Sample is the rendering canvas, not a card floating inside it.

- The iframe is `absolute inset-0` in the center pane, under the Sample title.
- The sample page is `height: 100%` and `width: 100%`. It no longer sits in a small rounded container.
- Spacing and type in the sample are painted from the unit basis, in px, so a custom ratio is visible. Browser `pt` is not used, because CSS always treats `1pt` as `1.333px`.

## Column fit

Search, add, and unit controls stay inside the library column.

- Rail is `20rem`, `min-w-0`, `overflow-x-hidden`.
- Search and add buttons are `w-full min-w-0 max-w-full`. Inputs no longer force the column wider.
- Library shelves wrap instead of stretching the nested column.
- Add labels wrap instead of clipping (`Add gap`, `Add padding`, `Add type style`).

## Unit basis

Stored on the design system as `units`. Older files without `units` still import. Schema stays `2`.

```ts
type UnitSettings = {
  rootPx: number;          // px in 1rem. Default 16.
  fontPtPerRem: number;    // pt in 1rem for type and spacing. Default 16.
  radiusPxPerRem: number;  // px in 1rem for radius. Default 16.
  typeUnit: "pt" | "rem";
  spacingUnit: "pt" | "rem" | "px";
  radiusUnit: "pt" | "rem" | "px";
};
```

Default matches the requested standard: `1rem = 16pt` for type, `1rem = 16px` for radius. This is the logical / iOS point, where a point is a pixel.

CSS print is a preset, not the default. At a 16px root, `1pt = 1.333px`, so `1rem = 12pt`. Formula: `rem = (pt × 1.3333) / rootPx`. Checks: 12pt = 1rem, 9pt = 0.75rem, 15pt = 1.25rem, 24pt = 2rem.

Both ratios are editable. Presets only fill the numbers.

## Swap

- Type size is stored as `sizePt`. Switching pt/rem changes the number in the field. Editing writes back to `sizePt`.
- Spacing and radius strings rewrite when the unit switches. `1rem` at the 16pt standard becomes `16pt`. `1rem` radius at 16px becomes `16px`.
- `%` is left alone. `em` converts as rem.
- Amounts round to 3 decimals.

## Where to edit

Library column, Units block: presets, root px, type pt per rem, radius px per rem, and the three unit switches.

Selection column: the same switch sits on Size, Mobile, Desktop, and radius Value. The hint shows the other unit.
