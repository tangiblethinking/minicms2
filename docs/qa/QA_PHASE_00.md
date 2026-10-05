# QA Phase 00 — Design system

Commit: none. This workspace has no git repository, so the phase is identified by the running studio rather than a hash.

Checked in the studio on desktop (1280×800) and mobile (390×844). Dev and the production build both rendered with no console errors and no page errors. The production pass did not diverge from dev.

## Six questions

1. Where am I? The top bar names the product, Compositional Canvas, and the open library, Design system. The footer breadcrumb reads Design system / Type / H1. The center is labeled Sample.
2. Which library and folder am I in? Design system is the current library. Type is the open folder, with its count beside the name. Elements, Components, Features, Sections, and Pages stay in the library list and read Available in a later phase.
3. What can I add? The open folder has a labeled add button. On Type it reads Add type style. The other folders read Add color, Add font, Add padding, Add gap, Add margin, or Add radius.
4. What is selected? The right column is titled This selection. It names H1 and the kind Type style. The H1 card in the folder is filled ink.
5. Where do I change it? The same column. For a type style the controls are Name, Tag, Font, Size, Line height, and Weight. The line under Size reads the point size, such as 32pt.
6. How do I save? Save design system is the only filled button. It stores the open library and confirms Saved design-system.tpsds.json.

## H1 point size

Opening Size is 32. The hint reads 32pt and the sample line is 32pt. Changing Size to 36 repaints the sample at 36pt and the hint reads 36pt. Setting Font to Display makes the sample line read H1 · Display and use that family’s stack.

## Spacing

Comfortable padding is 16px on Mobile and 24px on Desktop. Mobile in the top bar sets the sample to 16px. Desktop sets it to 24px. The sample note switches between Comfortable padding · 16px and Comfortable padding · 24px. Tight gap is 8px / 12px. Screen margin is 16px / 32px.

## Rejected import

An element library file (`kind: "elements"`, `schemaVersion: 2`) is rejected with: This file is not a design system. Open it on its own shelf. The open design system stays. After H1 was 36pt on Display, the rejection left it at 36pt on Display.

## Save, export, reload, import

Save confirmed Saved design-system.tpsds.json. Export wrote design-system.tpsds.json with schemaVersion 2, kind design-system, H1 sizePt 36, and fontId font-display. Reload kept H1 at 36pt on Display. Importing that file confirmed Imported design-system.tpsds.json. and H1 was still 36pt on Display.

## Console

No console errors and no page errors on dev or on the production build, at desktop or mobile.
