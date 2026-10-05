# UX requirements

Compositional Canvas is a studio for a designer. The design system holds the rules. Libraries hold the pieces. The canvas shows the result. A person who has never opened the app can add a heading, set it to H1, and save it.

## How a person moves

The screen has four regions.

- Top bar: product name, open library name, Save, Export, Mobile, Desktop.
- Left: libraries, then the open library’s folders and items.
- Center: the canvas, or the design-system sample.
- Right: This selection. The name, the kind, and the controls that apply.

The footer is a breadcrumb: `Elements / Type / Heading`.

Save is the only filled button. It says what it saves: `Save design system`, `Save element`, `Save component`. Export is a labeled outline button: `Export element library`. Delete asks `Delete Heading?` and has Cancel and Delete.

A shelf that is not in this session stays in the left nav, disabled, with `Available in a later phase`.

## Libraries

Each shelf is its own library. Items live in folders. The left panel shows the open folder only.

- Search filters the open library by name.
- A folder is a labeled row. The count sits beside the name.
- An item is a card: name, then kind. The open item is filled ink.
- New folder asks for a name.
- An item cannot be saved outside a folder.
- Delete folder is available only when the folder is empty. Copy: `Move the items out of Type first.`

Element folders: Type, Media, Actions, Inputs, Containers.
Component folders: Cards, Rows, Controls.
Feature folders: Navigation, Commerce.
Section folders: Heroes, Collections.
Page folder: Pages.

The designer can add folders. Default folders are created with the library.

## Design system

Foundational values are set here and chosen by name everywhere else.

- Color: name and hex.
- Font: family name and stack.
- Type style: H1, H2, H3, H4, H5, H6, Body, Small, Label. Each has a font, a size in pt, a line height, and a weight.
- Padding: vertical space between items. Each rule has a mobile value and a desktop value.
- Gap: horizontal space inside an item. Mobile and desktop.
- Margin: space at the sides of the screen. Mobile and desktop.
- Radius: named corner size.

Mobile and Desktop in the top bar switch the canvas between the two spacing values. Both are stored.

A text element does not store a raw point size as its source. Its Size control lists the type styles: `H1 · 32pt`. Choosing H1 applies that style’s font, size, line height, and weight. Editing H1’s pt size updates every use that still says H1.

## Selection

The right column title is `This selection`. If nothing is selected, it says what to click. It never sits empty.

Groups appear only when they apply, in this order: Layout, Spacing, Type, Color, Surface, Image, State.

Every control has a label. Under it, the resolved value: `H1 · 32pt`, `Comfortable · 16px / 24px`. No unlabeled icon. No hex on an element.

## Canvas

Click selects. The right column follows. Double-click text to type. The canvas and the Text field write the same value.

The designer sets the container size, then sets each child to Hug, Fill, or Fixed, then aligns it: Left top, Center top, Right top, Left, Center, Right, Left bottom, Center bottom, Right bottom.

There is no free x/y canvas.

## Instances

A placement from a library is an instance.

- Every property can be changed on the instance.
- The source does not change.
- Update the library writes the instance values onto the source and clears the override. Confirm: `Update Heading in the element library? Every use will change.`
- Add to library asks for a folder and a name, then saves a new item.
- Edit definition opens the source. It does not write the instance back.

## Copy

Empty and error states name the next action.

- `This folder is empty. Add a text element.`
- `Save a heading on Elements first.` Button: `Go to Elements`.
- `This file is an element library. Open it on Elements.`
- `Missing: Heading (element).`
- `Saved elements.tpsel.json.`

## Done when

A new designer can answer, without help:

1. Where am I?
2. Which library and folder am I in?
3. What can I add?
4. What is selected?
5. Where do I change it?
6. How do I save?
