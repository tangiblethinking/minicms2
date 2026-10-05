# Phase 7 — Libraries

Makes the libraries hold together. Requires the export.

## Result

Every item lives in a folder. Search stays in the open library. A design-system edit reaches every loaded library.

## Interaction

- Search covers the open library only.
- Move to folder is a labeled action.
- Rename folder confirms when the folder has items.
- Delete folder is refused while it has items: `Move the items out of Type first.`

Changing H1 from 36pt to 28pt repaints every loaded text element, card, feature, section, and page whose Size is H1. An overridden size stays.

Changing Brand repaints every fill that uses Brand. Changing Comfortable padding updates Mobile and Desktop.

The next export writes the new pt size into `tokens.css`. Items still record the style name H1, not a raw number, unless size was overridden.

Renaming a token confirms: `This updates every loaded library that uses H1.` A library that is not loaded is not described as updated.

## Exit test

1. An element cannot be saved without a folder.
2. Search in Cards finds the product card and does not list elements.
3. An H1 pt change repaints the page. An overridden size stays.
4. The six questions in `UX_REQUIREMENTS.md` are answerable on Elements and on Pages.

## Evidence

`docs/qa/QA_PHASE_07.md` records the commit, the six answers, folder requirement, the H1 repaint, the held override, and console errors.
