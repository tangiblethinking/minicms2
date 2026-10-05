# Phase 6 — Export

Builds the developer zip and the library pack. Requires a shop page.

## Result

Export downloads one zip. A developer can build from it. A designer can reload the libraries from it.

```
brand-ui/
  README.md
  design-system.json
  src/tokens.css
  elements/<folder>/<slug>.html
  components/<folder>/<slug>.html
  features/<folder>/<slug>.html
  sections/<folder>/<slug>.html
  pages/<folder>/<slug>.html
  libraries/
    design-system.tpsds.json
    elements.tpsel.json
    components.tpscmp.json
    features.tpsfea.json
    sections.tpssec.json
    pages.tpspge.json
```

`tokens.css` defines each type style in pt and each spacing token for mobile and desktop. HTML is compiled: refs resolved, overrides applied. An H1 rule uses the H1 pt size.

The README says:

1. Snapshot from Compositional Canvas. Tailwind 4.3.
2. Do not ship the Play CDN.
3. Token source is `design-system.json`.
4. To change the system, import `libraries/` and export again.

Export stays a labeled button.

## Exit test

1. The zip contains `tokens.css` and `libraries/`.
2. `tokens.css` contains the H1 pt size.
3. Card HTML shows instance text when it differs from the element.
4. Paths include the folder names.
5. Importing `libraries/` restores the page.

## Evidence

`docs/qa/QA_PHASE_06.md` records the commit, the zip contents, the H1 pt size, resolved overrides, and console errors.
