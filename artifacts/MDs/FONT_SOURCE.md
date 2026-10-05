# Font source handoff

A font token now has a source. The sample loads that source, then paints the stack.

```ts
type FontToken = { id: string; name: string; stack: string; source: string };
```

`source` is an https URL or empty. Older files with no source still import.

## Designer path

1. Add font. Set Name to the family, such as `DM Sans`.
2. Click Load DM Sans from Google Fonts. That writes the stack `"DM Sans", ui-sans-serif, system-ui, sans-serif` and the stylesheet URL.
3. On the type style, set Font to that token. The sample loads the stylesheet and paints the family.
4. Save design system. The URL is stored in `design-system.tpsds.json`.

For a hosted file, paste the file URL in Source URL instead:

```text
https://cdn.example/my-face.woff2
```

Accepted files: `.woff2`, `.woff`, `.ttf`, `.otf`. The sample writes an `@font-face` for the first family in the stack. The file host must send CORS, or the browser will not paint it.

A file on the local disk still has no URL, so it cannot be loaded. Host it, then paste the https URL.
