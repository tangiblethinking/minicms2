import assert from "node:assert/strict";
import test from "node:test";
import {
  convertLength,
  cssPrintPreset,
  defaultUnitSettings,
  logicalPreset,
  ptToRem,
  remToPt,
  typeSizeCss,
} from "./units.ts";

test("CSS print points convert with 1pt = 1.333px and 1rem = 16px", () => {
  const settings = cssPrintPreset();
  assert.equal(settings.fontPtPerRem, 12);
  assert.equal(settings.rootPx, 16);
  assert.equal(ptToRem(12, settings), 1);
  assert.equal(ptToRem(9, settings), 0.75);
  assert.equal(ptToRem(15, settings), 1.25);
  assert.equal(ptToRem(24, settings), 2);
  assert.equal(convertLength("12pt", "rem", settings, "spacing"), "1rem");
  assert.equal(convertLength("1rem", "pt", settings, "spacing"), "12pt");
  assert.equal(convertLength("16px", "pt", settings, "spacing"), "12pt");
});

test("the editable standard is 1rem = 16pt and 1rem = 16px", () => {
  const settings = logicalPreset();
  assert.equal(settings.fontPtPerRem, 16);
  assert.equal(settings.radiusPxPerRem, 16);
  assert.equal(remToPt(1, settings), 16);
  assert.equal(ptToRem(16, settings), 1);
  assert.equal(convertLength("1rem", "pt", settings, "spacing"), "16pt");
  assert.equal(convertLength("16pt", "rem", settings, "spacing"), "1rem");
  assert.equal(convertLength("1rem", "px", settings, "radius"), "16px");
  assert.equal(convertLength("16px", "rem", settings, "radius"), "1rem");
  assert.equal(typeSizeCss(16, settings), "16px");
});

test("a custom ratio is used instead of the preset", () => {
  const settings = { ...defaultUnitSettings(), fontPtPerRem: 10, radiusPxPerRem: 8, rootPx: 20 };
  assert.equal(convertLength("1rem", "pt", settings, "spacing"), "10pt");
  assert.equal(convertLength("2rem", "px", settings, "radius"), "16px");
  assert.equal(typeSizeCss(10, settings), "20px");
});
