# Phase 2 — Component library

Builds the component library. Requires Heading, Image, Button, and Frame in the element library.

## Result

A designer builds a product card from saved elements, files it in a folder, and overrides the instance without changing the element. Save writes `components.tpscmp.json`.

## File

```ts
type ComponentLibraryFile = {
  schemaVersion: 2;
  kind: "components";
  id: string;
  name: string;
  updatedAt: string;
  designSystemId: string;
  folders: { id: string; name: string }[];
  items: ComponentItem[];
};

type ComponentItem = {
  id: string;
  folderId: string;
  name: string;
  slug: string;
  root: Placement;
};

type Placement = {
  id: string;
  ref?: { kind: "element" | "component"; id: string };
  overrides?: Partial<Properties>;
  children: Placement[];
  maxDepth?: number;
};
```

A placement stores a ref and overrides. It does not copy the element. A component may contain a component. A self-reference stops at `maxDepth` (default 3) and shows `Depth limit`.

Folders created with the library: Cards, Rows, Controls.

## Interaction

Add lists elements by folder, with search. It does not offer an empty box.

If the element library is empty: `Save a heading on Elements first` and `Go to Elements`.

A selected placement shows the same properties as the element, labeled `Instance`. Actions: `Update the library`, `Add to library`, `Edit definition`.

Update the library confirms, writes the values onto the source, and clears the override. Add to library asks for a folder and a name.

The card is a Frame, width Fixed `320px`, padding Comfortable. Children: Image set to Fill, Heading, a row with Gap Tight holding Price and Strike price, Button set to Fill. Price and Strike price are text elements the designer names and files under Type.

Gap is set on the row. Padding is set on the frame.

## Exit test

1. The card is built from library items. Price and strike sit on one row.
2. Changing the heading text on the card does not change the Heading element.
3. Update the library. The element text becomes the card text. The override clears.
4. Changing H1’s pt size updates the card heading, unless size was overridden.
5. Add to library on the price row files it under Rows. The card still refs the original elements.
6. Export, reload, import. An element file opened here is rejected.
7. The six questions in `UX_REQUIREMENTS.md` are answerable.

## Evidence

`docs/qa/QA_PHASE_02.md` records the commit, the six answers, refs rather than copies, the override, Update the library, the H1 repaint, and console errors.
