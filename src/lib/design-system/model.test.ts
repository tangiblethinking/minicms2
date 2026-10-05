import assert from "node:assert/strict";
import test from "node:test";
import {
  INCOMPLETE_DESIGN_SYSTEM,
  NOT_DESIGN_SYSTEM,
  openingDesignSystem,
  parseDesignSystemJson,
  UNREADABLE_DESIGN_SYSTEM,
} from "./model.ts";
import { buildSampleMessage } from "./sample.ts";

test("opening design system matches the phase 0 values", () => {
  const file = openingDesignSystem();
  const h1 = file.typeStyles.find((style) => style.name === "H1");
  const comfortable = file.spacing.padding.find((token) => token.name === "Comfortable");
  assert.equal(file.kind, "design-system");
  assert.equal(file.schemaVersion, 2);
  assert.equal(h1?.sizePt, 32);
  assert.equal(h1?.lineHeight, 1.2);
  assert.equal(h1?.weight, 600);
  assert.equal(comfortable?.mobile, "16px");
  assert.equal(comfortable?.desktop, "24px");
  assert.equal(file.colors[0]?.value, "#9a3412");
  assert.equal(file.fonts[1]?.name, "Display");
});

test("round-trip keeps an edited H1 size", () => {
  const file = openingDesignSystem();
  const next = {
    ...file,
    typeStyles: file.typeStyles.map((style) => (style.name === "H1" ? { ...style, sizePt: 36 } : style)),
  };
  const parsed = parseDesignSystemJson(JSON.stringify(next));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.file.typeStyles.find((style) => style.name === "H1")?.sizePt, 36);
});

test("an element library is rejected and names the shelf", () => {
  const parsed = parseDesignSystemJson(
    JSON.stringify({ schemaVersion: 2, kind: "elements", id: "lib", name: "Elements" }),
  );
  assert.deepEqual(parsed, { ok: false, message: NOT_DESIGN_SYSTEM });
});

test("a broken design system does not replace a valid one", () => {
  const parsed = parseDesignSystemJson(
    JSON.stringify({ schemaVersion: 2, kind: "design-system", id: "ds", name: "Partial" }),
  );
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.message, INCOMPLETE_DESIGN_SYSTEM);
});

test("unreadable text is rejected", () => {
  const parsed = parseDesignSystemJson("{");
  assert.deepEqual(parsed, { ok: false, message: UNREADABLE_DESIGN_SYSTEM });
});

test("the sample switches Comfortable padding with the viewport", () => {
  const file = openingDesignSystem();
  assert.equal(buildSampleMessage(file, "mobile").stack.pad, "16px");
  assert.equal(buildSampleMessage(file, "desktop").stack.pad, "24px");
  const edited = {
    ...file,
    typeStyles: file.typeStyles.map((style) =>
      style.name === "H1" ? { ...style, sizePt: 36, fontId: "font-display" } : style,
    ),
  };
  const sample = buildSampleMessage(edited, "desktop");
  const h1 = sample.types.find((style) => style.name === "H1");
  assert.equal(h1?.sizePt, 36);
  assert.equal(h1?.fontName, "Display");
});
