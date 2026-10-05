import {
  safeColor,
  safeLength,
  safeStack,
  type DesignSystemFile,
  type SpacingToken,
} from "./model.ts";
import { cssLength, lengthEquivalents, readUnitSettings, typeSizeCss } from "./units.ts";

export type Viewport = "mobile" | "desktop";

export type SampleMessage = {
  type: "cc-sample";
  vars: Record<string, string>;
  theme: string;
  swatches: { name: string; color: string }[];
  types: {
    name: string;
    tag: string;
    fontName: string;
    family: string;
    sizePt: number;
    sizeCss: string;
    lineHeight: number;
    weight: number;
  }[];
  stack: {
    pad: string;
    gap: string;
    margin: string;
    radius: string;
    padNote: string;
    gapNote: string;
    marginNote: string;
    radiusNote: string;
  };
};

const TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label", "div", "small", "strong", "em"]);

export function sampleTag(tag: string): string {
  const next = tag.trim().toLowerCase();
  return TAGS.has(next) ? next : "p";
}

export function spacingCurrent(token: SpacingToken | undefined, viewport: Viewport): string {
  if (!token) return "0px";
  return safeLength(viewport === "mobile" ? token.mobile : token.desktop, "0px");
}

function byName<T extends { name: string }>(items: T[], name: string): T | undefined {
  return items.find((item) => item.name === name);
}

function themeKey(name: string, index: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const base = slug && !/^[0-9]/.test(slug) ? slug : `token${slug ? `-${slug}` : ""}`;
  return `${base}-${index}`;
}

export function buildTheme(file: DesignSystemFile): string {
  const lines = ["@theme {"];
  file.colors.forEach((color, index) => {
    lines.push(`  --color-${themeKey(color.name, index)}: ${safeColor(color.value)};`);
  });
  file.radius.forEach((token, index) => {
    lines.push(`  --radius-${themeKey(token.name, index)}: ${safeLength(token.value, "0px")};`);
  });
  lines.push("}");
  return lines.join("\n");
}

export function buildSampleMessage(file: DesignSystemFile, viewport: Viewport): SampleMessage {
  const ink = byName(file.colors, "Ink");
  const muted = byName(file.colors, "Muted");
  const surface = byName(file.colors, "Surface");
  const brand = byName(file.colors, "Brand");
  const pad = byName(file.spacing.padding, "Comfortable");
  const gap = byName(file.spacing.gap, "Tight");
  const margin = byName(file.spacing.margin, "Screen");
  const radius = byName(file.radius, "Card");
  const units = readUnitSettings(file.units);
  const padValue = spacingCurrent(pad, viewport);
  const gapValue = spacingCurrent(gap, viewport);
  const marginValue = spacingCurrent(margin, viewport);
  const radiusValue = radius ? safeLength(radius.value, "0px") : "0px";
  const padCss = cssLength(padValue, units, "spacing");
  const gapCss = cssLength(gapValue, units, "spacing");
  const marginCss = cssLength(marginValue, units, "spacing");
  const radiusCss = cssLength(radiusValue, units, "radius");

  return {
    type: "cc-sample",
    theme: buildTheme(file),
    vars: {
      "--surface": surface ? safeColor(surface.value, "#ffffff") : "#ffffff",
      "--ink": ink ? safeColor(ink.value, "#1c1917") : "#1c1917",
      "--muted": muted ? safeColor(muted.value, "#78716c") : "#78716c",
      "--brand": brand ? safeColor(brand.value, "#9a3412") : file.colors[0] ? safeColor(file.colors[0].value) : "#9a3412",
      "--margin": marginCss,
      "--pad": padCss,
      "--gap": gapCss,
      "--radius": radiusCss,
      "--root-px": `${units.rootPx}px`,
    },
    swatches: file.colors.map((color) => ({
      name: color.name,
      color: safeColor(color.value),
    })),
    types: file.typeStyles.map((style) => {
      const font = file.fonts.find((item) => item.id === style.fontId) ?? file.fonts[0];
      return {
        name: style.name,
        tag: sampleTag(style.tag),
        fontName: font?.name ?? "Missing font",
        family: safeStack(font?.stack ?? ""),
        sizePt: style.sizePt,
        sizeCss: typeSizeCss(style.sizePt, units),
        lineHeight: style.lineHeight,
        weight: style.weight,
      };
    }),
    stack: {
      pad: padCss,
      gap: gapCss,
      margin: marginCss,
      radius: radiusCss,
      padNote: pad ? `Comfortable padding · ${padValue} · ${lengthEquivalents(padValue, units, "spacing")}` : "Missing: Comfortable (padding).",
      gapNote: gap ? `Tight gap · ${gapValue} · ${lengthEquivalents(gapValue, units, "spacing")}` : "Missing: Tight (gap).",
      marginNote: margin ? `Screen margin · ${marginValue} · ${lengthEquivalents(marginValue, units, "spacing")}` : "Missing: Screen (margin).",
      radiusNote: radius ? `Card radius · ${radiusValue} · ${lengthEquivalents(radiusValue, units, "radius")}` : "Missing: Card (radius).",
    },
  };
}

export function namedSpacing(file: DesignSystemFile, axis: "padding" | "gap" | "margin", name: string) {
  return byName(file.spacing[axis], name);
}
