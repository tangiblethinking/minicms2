# Phase 1 — Element library

Builds the element library. Requires the design system, including H1 with a pt size.

## Result

A designer creates elements, files them in folders, and sets their properties from design-system tokens. A text element’s size is a type style. Save writes `elements.tpsel.json`.

## File

```ts
type ElementLibraryFile = {
  schemaVersion: 2;
  kind: "elements";
  id: string;
  name: string;
  updatedAt: string;
  designSystemId: string;
  folders: { id: string; name: string }[];
  items: ElementItem[];
};

type ElementItem = {
  id: string;
  folderId: string;
  name: string;
  slug: string;
  base: "text" | "media" | "action" | "input" | "container";
  props: Properties;
};
```

`Properties` holds tag, text, typeStyleId, width mode, height mode, align, padding id, gap id, color ids, radius id, image URL, alt, fit, and link. The source of truth is these fields. Hex and class strings are not stored on the element.

Folders created with the library: Type, Media, Actions, Inputs, Containers.

## Interaction

Left: search, folders, then cards for the open folder.

Add asks for a base and a name, then files the item in the open folder. Text defaults to Type, media to Media, action to Actions, input to Inputs, container to Containers.

Text element controls:

- Name
- Tag: h1, h2, h3, h4, h5, h6, p, span
- Text
- Size: type styles as `H1 · 32pt`
- Width and height: Hug, Fill, or Fixed
- Align: the nine positions
- Text color: a design-system color name

Canvas text and the Text field are one value.

Image asks for URL and alt before save. Default URL `https://picsum.photos/id/1011/800/1000`.

Changing H1’s pt size on the design system repaints every text element whose Size is H1.

## Exit test

1. In Type, add a text element named Heading. Tag h1. Size H1. The hint shows the H1 pt size.
2. Type `Desert Stone Tee` on the canvas. The Text field matches. Edit the field. The canvas matches.
3. Add Image in Media, Button in Actions, Frame in Containers. Each folder shows only its own items. Search finds Heading.
4. Save, export, reload, import. Folder and H1 style match.
5. Set H1 to 40pt on the design system. Heading on the canvas is 40pt and still says H1.
6. A design-system file opened here is rejected.
7. The six questions in `UX_REQUIREMENTS.md` are answerable. The designer is not given one long list.

## Evidence

`docs/qa/QA_PHASE_01.md` records the commit, the six answers, H1 as the size source, canvas and panel sharing text, folders, the design-system repaint, and console errors.
