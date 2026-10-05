import { safeFontSource } from "./fonts.ts";
import { defaultUnitSettings, readUnitSettings, type UnitSettings } from "./units.ts";

export type { UnitSettings };

export const SCHEMA_VERSION = 2 as const;
export const TAILWIND_VERSION = "4.3" as const;
export const DESIGN_SYSTEM_FILE_NAME = "design-system.tpsds.json";

export const NOT_DESIGN_SYSTEM =
  "This file is not a design system. Open it on its own shelf.";
export const INCOMPLETE_DESIGN_SYSTEM =
  "This design system file is incomplete. Check colors, fonts, type styles, spacing, and radius, then import again.";
export const UNREADABLE_DESIGN_SYSTEM =
  "This file could not be read. Import a design-system.tpsds.json file.";
export const SAVED_DESIGN_SYSTEM = "Saved design-system.tpsds.json.";
export const EXPORTED_DESIGN_SYSTEM = "Exported design-system.tpsds.json.";
export const IMPORTED_DESIGN_SYSTEM = "Imported design-system.tpsds.json.";

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const LENGTH = /^(?:0|[1-9]\d{0,3})(?:\.\d{1,3})?(?:px|rem|em|pt|%)$/;

export type ColorToken = { id: string; name: string; value: string };
export type FontToken = { id: string; name: string; stack: string; source: string };
export type TypeStyle = {
  id: string;
  name: string;
  tag: string;
  fontId: string;
  sizePt: number;
  lineHeight: number;
  weight: number;
};
export type SpacingToken = { id: string; name: string; mobile: string; desktop: string };
export type RadiusToken = { id: string; name: string; value: string };

export type DesignSystemFile = {
  schemaVersion: 2;
  kind: "design-system";
  id: string;
  name: string;
  updatedAt: string;
  tailwindVersion: "4.3";
  colors: ColorToken[];
  fonts: FontToken[];
  typeStyles: TypeStyle[];
  spacing: {
    padding: SpacingToken[];
    gap: SpacingToken[];
    margin: SpacingToken[];
  };
  radius: RadiusToken[];
  units: UnitSettings;
};

export type GroupId = "color" | "font" | "type" | "padding" | "gap" | "margin" | "radius";

export type GroupMeta = {
  id: GroupId;
  label: string;
  kind: string;
  add: string;
  empty: string;
  meaning?: string;
};

export const GROUPS: readonly GroupMeta[] = [
  {
    id: "color",
    label: "Color",
    kind: "Color",
    add: "Add color",
    empty: "This folder is empty. Add a color.",
  },
  {
    id: "font",
    label: "Font",
    kind: "Font",
    add: "Add font",
    empty: "This folder is empty. Add a font.",
  },
  {
    id: "type",
    label: "Type",
    kind: "Type style",
    add: "Add type style",
    empty: "This folder is empty. Add a type style.",
  },
  {
    id: "padding",
    label: "Padding",
    kind: "Padding",
    add: "Add padding",
    empty: "This folder is empty. Add a padding rule.",
    meaning: "Padding is vertical space between items.",
  },
  {
    id: "gap",
    label: "Gap",
    kind: "Gap",
    add: "Add gap",
    empty: "This folder is empty. Add a gap rule.",
    meaning: "Gap is horizontal space inside an item.",
  },
  {
    id: "margin",
    label: "Margin",
    kind: "Margin",
    add: "Add margin",
    empty: "This folder is empty. Add a margin rule.",
    meaning: "Margin is the screen sides.",
  },
  {
    id: "radius",
    label: "Radius",
    kind: "Radius",
    add: "Add radius",
    empty: "This folder is empty. Add a radius.",
  },
];

export function groupMeta(id: GroupId): GroupMeta {
  const found = GROUPS.find((group) => group.id === id);
  if (!found) throw new Error(`Unknown group ${id}`);
  return found;
}

const SANS_STACK = "ui-sans-serif, system-ui, sans-serif";

function typeStyle(
  id: string,
  name: string,
  tag: string,
  sizePt: number,
  weight: number,
): TypeStyle {
  return {
    id,
    name,
    tag,
    fontId: "font-sans",
    sizePt,
    lineHeight: 1.2,
    weight,
  };
}

export function openingDesignSystem(): DesignSystemFile {
  return {
    schemaVersion: 2,
    kind: "design-system",
    id: "ds-opening",
    name: "Design system",
    updatedAt: "2026-01-01T00:00:00.000Z",
    tailwindVersion: "4.3",
    colors: [
      { id: "color-brand", name: "Brand", value: "#9a3412" },
      { id: "color-ink", name: "Ink", value: "#1c1917" },
      { id: "color-muted", name: "Muted", value: "#78716c" },
      { id: "color-surface", name: "Surface", value: "#ffffff" },
    ],
    fonts: [
      { id: "font-sans", name: "Sans", stack: SANS_STACK, source: "" },
      { id: "font-display", name: "Display", stack: SANS_STACK, source: "" },
    ],
    typeStyles: [
      typeStyle("type-h1", "H1", "h1", 32, 600),
      typeStyle("type-h2", "H2", "h2", 24, 600),
      typeStyle("type-h3", "H3", "h3", 20, 600),
      typeStyle("type-h4", "H4", "h4", 18, 400),
      typeStyle("type-h5", "H5", "h5", 16, 400),
      typeStyle("type-h6", "H6", "h6", 14, 400),
      typeStyle("type-body", "Body", "p", 16, 400),
      typeStyle("type-small", "Small", "p", 14, 400),
      typeStyle("type-label", "Label", "span", 12, 400),
    ],
    spacing: {
      padding: [
        { id: "pad-compact", name: "Compact", mobile: "8px", desktop: "12px" },
        { id: "pad-comfortable", name: "Comfortable", mobile: "16px", desktop: "24px" },
        { id: "pad-section", name: "Section", mobile: "32px", desktop: "64px" },
      ],
      gap: [
        { id: "gap-tight", name: "Tight", mobile: "8px", desktop: "12px" },
        { id: "gap-comfortable", name: "Comfortable", mobile: "16px", desktop: "24px" },
      ],
      margin: [{ id: "margin-screen", name: "Screen", mobile: "16px", desktop: "32px" }],
    },
    radius: [{ id: "radius-card", name: "Card", value: "1rem" }],
    units: defaultUnitSettings(),
  };
}

export type ParseResult =
  | { ok: true; file: DesignSystemFile }
  | { ok: false; message: string };

export function parseDesignSystemJson(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch {
    return { ok: false, message: UNREADABLE_DESIGN_SYSTEM };
  }
  return parseDesignSystem(data);
}

export function parseDesignSystem(data: unknown): ParseResult {
  if (!isRecord(data)) return { ok: false, message: NOT_DESIGN_SYSTEM };
  if (data.kind !== "design-system" || data.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, message: NOT_DESIGN_SYSTEM };
  }
  const file = readFile(data);
  if (!file) return { ok: false, message: INCOMPLETE_DESIGN_SYSTEM };
  return { ok: true, file };
}

function readFile(data: Record<string, unknown>): DesignSystemFile | null {
  if (typeof data.id !== "string" || data.id.length === 0) return null;
  if (typeof data.name !== "string") return null;
  if (typeof data.updatedAt !== "string" || data.updatedAt.length === 0) return null;
  if (data.tailwindVersion !== TAILWIND_VERSION) return null;
  const colors = readColors(data.colors);
  const fonts = readFonts(data.fonts);
  const typeStyles = readTypeStyles(data.typeStyles);
  const spacing = readSpacing(data.spacing);
  const radius = readRadius(data.radius);
  if (!colors || !fonts || !typeStyles || !spacing || !radius) return null;
  const units = readUnitSettings(data.units);
  const ids = [
    ...colors.map((item) => item.id),
    ...fonts.map((item) => item.id),
    ...typeStyles.map((item) => item.id),
    ...spacing.padding.map((item) => item.id),
    ...spacing.gap.map((item) => item.id),
    ...spacing.margin.map((item) => item.id),
    ...radius.map((item) => item.id),
  ];
  if (new Set(ids).size !== ids.length) return null;
  return {
    schemaVersion: 2,
    kind: "design-system",
    id: data.id,
    name: data.name,
    updatedAt: data.updatedAt,
    tailwindVersion: "4.3",
    colors,
    fonts,
    typeStyles,
    spacing,
    radius,
    units,
  };
}

function readColors(value: unknown): ColorToken[] | null {
  if (!Array.isArray(value)) return null;
  const colors: ColorToken[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length === 0) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.value !== "string" || !HEX.test(item.value.trim())) return null;
    colors.push({ id: item.id, name: item.name, value: item.value.trim() });
  }
  return colors;
}

function readFonts(value: unknown): FontToken[] | null {
  if (!Array.isArray(value)) return null;
  const fonts: FontToken[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length === 0) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.stack !== "string" || item.stack.trim().length === 0) return null;
    if (item.source != null && typeof item.source !== "string") return null;
    fonts.push({
      id: item.id,
      name: item.name,
      stack: item.stack.trim(),
      source: safeFontSource(typeof item.source === "string" ? item.source : ""),
    });
  }
  return fonts;
}

function readTypeStyles(value: unknown): TypeStyle[] | null {
  if (!Array.isArray(value)) return null;
  const styles: TypeStyle[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length === 0) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.tag !== "string" || item.tag.trim().length === 0) return null;
    if (typeof item.fontId !== "string" || item.fontId.length === 0) return null;
    if (!isFiniteNumber(item.sizePt) || !isFiniteNumber(item.lineHeight) || !isFiniteNumber(item.weight)) {
      return null;
    }
    styles.push({
      id: item.id,
      name: item.name,
      tag: item.tag.trim(),
      fontId: item.fontId,
      sizePt: item.sizePt,
      lineHeight: item.lineHeight,
      weight: item.weight,
    });
  }
  return styles;
}

function readSpacing(value: unknown): DesignSystemFile["spacing"] | null {
  if (!isRecord(value)) return null;
  const padding = readSpacingList(value.padding);
  const gap = readSpacingList(value.gap);
  const margin = readSpacingList(value.margin);
  if (!padding || !gap || !margin) return null;
  return { padding, gap, margin };
}

function readSpacingList(value: unknown): SpacingToken[] | null {
  if (!Array.isArray(value)) return null;
  const tokens: SpacingToken[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length === 0) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.mobile !== "string" || !LENGTH.test(item.mobile.trim())) return null;
    if (typeof item.desktop !== "string" || !LENGTH.test(item.desktop.trim())) return null;
    tokens.push({
      id: item.id,
      name: item.name,
      mobile: item.mobile.trim(),
      desktop: item.desktop.trim(),
    });
  }
  return tokens;
}

function readRadius(value: unknown): RadiusToken[] | null {
  if (!Array.isArray(value)) return null;
  const radii: RadiusToken[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length === 0) return null;
    if (typeof item.name !== "string") return null;
    if (typeof item.value !== "string" || !LENGTH.test(item.value.trim())) return null;
    radii.push({ id: item.id, name: item.name, value: item.value.trim() });
  }
  return radii;
}

export function safeColor(value: string, fallback = "#000000"): string {
  const next = value.trim();
  return HEX.test(next) ? next.toLowerCase() : fallback;
}

export function safeLength(value: string, fallback = "0px"): string {
  const next = value.trim();
  return LENGTH.test(next) ? next : fallback;
}

export function safeStack(value: string): string {
  const cleaned = value.replace(/[{}<>\\;]/g, "").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 240) || SANS_STACK;
}

export function isLength(value: string): boolean {
  return LENGTH.test(value.trim());
}

export function isHex(value: string): boolean {
  return HEX.test(value.trim());
}

export function colorInputValue(value: string): string {
  const hex = safeColor(value, "#000000");
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.slice(0, 7);
}

export function sanitizeDesignSystem(file: DesignSystemFile): DesignSystemFile {
  return {
    ...file,
    colors: file.colors.map((color) => ({ ...color, value: safeColor(color.value) })),
    fonts: file.fonts.map((font) => ({ ...font, stack: safeStack(font.stack), source: safeFontSource(font.source ?? "") })),
    spacing: {
      padding: file.spacing.padding.map(sanitizeSpacing),
      gap: file.spacing.gap.map(sanitizeSpacing),
      margin: file.spacing.margin.map(sanitizeSpacing),
    },
    radius: file.radius.map((token) => ({ ...token, value: safeLength(token.value, "0px") })),
    units: readUnitSettings(file.units),
  };
}

function sanitizeSpacing(token: SpacingToken): SpacingToken {
  return {
    ...token,
    mobile: safeLength(token.mobile, "0px"),
    desktop: safeLength(token.desktop, "0px"),
  };
}

export type TokenCard = { id: string; name: string; kind: string; group: GroupId };

export function tokenCards(file: DesignSystemFile, group: GroupId): TokenCard[] {
  const kind = groupMeta(group).kind;
  return tokensFor(file, group).map((token) => ({
    id: token.id,
    name: token.name,
    kind,
    group,
  }));
}

export function visibleCards(file: DesignSystemFile, group: GroupId, query: string): TokenCard[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return tokenCards(file, group);
  return GROUPS.flatMap((item) => tokenCards(file, item.id)).filter((card) =>
    card.name.toLowerCase().includes(needle),
  );
}

type AnyToken = { id: string; name: string };

function tokensFor(file: DesignSystemFile, group: GroupId): AnyToken[] {
  switch (group) {
    case "color":
      return file.colors;
    case "font":
      return file.fonts;
    case "type":
      return file.typeStyles;
    case "padding":
      return file.spacing.padding;
    case "gap":
      return file.spacing.gap;
    case "margin":
      return file.spacing.margin;
    case "radius":
      return file.radius;
  }
}

export function groupCount(file: DesignSystemFile, group: GroupId): number {
  return tokensFor(file, group).length;
}

export type Selection =
  | { group: "color"; item: ColorToken }
  | { group: "font"; item: FontToken }
  | { group: "type"; item: TypeStyle }
  | { group: "padding" | "gap" | "margin"; item: SpacingToken }
  | { group: "radius"; item: RadiusToken };

export function findSelection(
  file: DesignSystemFile,
  group: GroupId,
  id: string | null,
): Selection | null {
  if (!id) return null;
  if (group === "color") {
    const item = file.colors.find((token) => token.id === id);
    return item ? { group, item } : null;
  }
  if (group === "font") {
    const item = file.fonts.find((token) => token.id === id);
    return item ? { group, item } : null;
  }
  if (group === "type") {
    const item = file.typeStyles.find((token) => token.id === id);
    return item ? { group, item } : null;
  }
  if (group === "radius") {
    const item = file.radius.find((token) => token.id === id);
    return item ? { group, item } : null;
  }
  const list =
    group === "padding" ? file.spacing.padding : group === "gap" ? file.spacing.gap : file.spacing.margin;
  const item = list.find((token) => token.id === id);
  return item ? { group, item } : null;
}

export function groupOfId(file: DesignSystemFile, id: string): GroupId | null {
  for (const group of GROUPS) {
    if (tokensFor(file, group.id).some((token) => token.id === id)) return group.id;
  }
  return null;
}

export function createId(prefix: string): string {
  const uuid = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${uuid}`;
}

function uniqueName(names: string[], base: string): string {
  if (!names.includes(base)) return base;
  let index = 2;
  while (names.includes(`${base} ${index}`)) index += 1;
  return `${base} ${index}`;
}

export function addToGroup(file: DesignSystemFile, group: GroupId): { file: DesignSystemFile; id: string } {
  if (group === "color") {
    const id = createId("color");
    const name = uniqueName(
      file.colors.map((item) => item.name),
      "New color",
    );
    return {
      id,
      file: { ...file, colors: [...file.colors, { id, name, value: "#78716c" }] },
    };
  }
  if (group === "font") {
    const id = createId("font");
    const name = uniqueName(
      file.fonts.map((item) => item.name),
      "New font",
    );
    return {
      id,
      file: { ...file, fonts: [...file.fonts, { id, name, stack: SANS_STACK, source: "" }] },
    };
  }
  if (group === "type") {
    const id = createId("type");
    const name = uniqueName(
      file.typeStyles.map((item) => item.name),
      "New style",
    );
    return {
      id,
      file: {
        ...file,
        typeStyles: [
          ...file.typeStyles,
          {
            id,
            name,
            tag: "p",
            fontId: file.fonts[0]?.id ?? "font-sans",
            sizePt: 16,
            lineHeight: 1.2,
            weight: 400,
          },
        ],
      },
    };
  }
  if (group === "radius") {
    const id = createId("radius");
    const name = uniqueName(
      file.radius.map((item) => item.name),
      "New radius",
    );
    return {
      id,
      file: { ...file, radius: [...file.radius, { id, name, value: "0.5rem" }] },
    };
  }
  const id = createId(group);
  const base = group === "padding" ? "New padding" : group === "gap" ? "New gap" : "New margin";
  const list =
    group === "padding" ? file.spacing.padding : group === "gap" ? file.spacing.gap : file.spacing.margin;
  const name = uniqueName(
    list.map((item) => item.name),
    base,
  );
  const token = { id, name, mobile: "8px", desktop: "12px" };
  return {
    id,
    file: {
      ...file,
      spacing: {
        ...file.spacing,
        [group]: [...list, token],
      },
    },
  };
}

export function removeFromGroup(file: DesignSystemFile, group: GroupId, id: string): DesignSystemFile {
  if (group === "color") return { ...file, colors: file.colors.filter((item) => item.id !== id) };
  if (group === "font") return { ...file, fonts: file.fonts.filter((item) => item.id !== id) };
  if (group === "type") return { ...file, typeStyles: file.typeStyles.filter((item) => item.id !== id) };
  if (group === "radius") return { ...file, radius: file.radius.filter((item) => item.id !== id) };
  const key = group;
  return {
    ...file,
    spacing: {
      ...file.spacing,
      [key]: file.spacing[key].filter((item) => item.id !== id),
    },
  };
}

export function downloadDesignSystem(file: DesignSystemFile) {
  const clean = sanitizeDesignSystem(file);
  const blob = new Blob([`${JSON.stringify(clean, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = DESIGN_SYSTEM_FILE_NAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
