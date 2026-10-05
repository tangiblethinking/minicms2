# Build protocol

Build one phase per session. The phase file is the ticket. `UX_REQUIREMENTS.md` is the interface contract for every session.

## Order

| File | Builds |
|---|---|
| `PHASE_00_DESIGN_SYSTEM.md` | Repo, chrome, design system, type styles |
| `PHASE_01_ELEMENTS.md` | Element library |
| `PHASE_02_COMPONENTS.md` | Component library |
| `PHASE_03_FEATURES.md` | Feature library |
| `PHASE_04_SECTIONS.md` | Section library |
| `PHASE_05_PAGES.md` | Pages |
| `PHASE_06_EXPORT.md` | Developer zip and library pack |
| `PHASE_07_LIBRARIES.md` | Folders, search, token updates across libraries |

A phase starts when the previous exit test has been run by a person. The session writes `docs/qa/QA_PHASE_0N.md` and stops. It does not start the next shelf.

## Stack

- Vite, React, TypeScript
- Studio chrome in Tailwind v4
- Canvas preview in a sandboxed iframe, Tailwind browser runtime, no `allow-same-origin`
- IndexedDB for the open libraries, plus download and upload of the JSON files
- Zip in Phase 6

`schemaVersion` is 2. A file with another version or the wrong `kind` is rejected with the shelf to open.

## Rules

- No AI API, accounts, or free x/y canvas.
- One filled button per screen. It is Save.
- Items live in folders.
- Colors, fonts, type styles, spacing, and radius are chosen by name from the design system.
- An instance edit does not change the source unless the designer chooses Update the library.
