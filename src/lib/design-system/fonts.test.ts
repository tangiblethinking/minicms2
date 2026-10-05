import assert from "node:assert/strict";
import test from "node:test";
import { fontFaceFamily, fontFileFormat, googleFontStylesheet, safeFontSource } from "./fonts.ts";

test("a public family becomes a Google Fonts stylesheet", () => {
  assert.equal(
    googleFontStylesheet("DM Sans"),
    "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
  );
});

test("only https font sources are kept", () => {
  assert.equal(safeFontSource("https://example.com/fonts/face.woff2"), "https://example.com/fonts/face.woff2");
  assert.equal(safeFontSource("http://example.com/face.woff2"), "");
  assert.equal(safeFontSource("javascript:alert(1)"), "");
});

test("a file url maps to a font face for the family name", () => {
  assert.equal(fontFileFormat("https://cdn.example/face.otf"), "opentype");
  assert.equal(fontFileFormat("https://cdn.example/face.ttf"), "truetype");
  assert.equal(fontFileFormat("https://fonts.googleapis.com/css2?family=DM+Sans"), null);
  assert.equal(fontFaceFamily("DM Sans", '"DM Sans", sans-serif'), "DM Sans");
});
