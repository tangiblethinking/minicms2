export const CSS_PT_IN_PX = 4 / 3;
export const CSS_PT_PER_REM_AT_16 = 12;
export const LOGICAL_PT_PER_REM = 16;
export const DEFAULT_ROOT_PX = 16;

export type SwapUnit = "pt" | "rem" | "px";
export type TypeUnit = "pt" | "rem";
export type LengthKind = "spacing" | "radius";

export type UnitSettings = {
  rootPx: number;
  fontPtPerRem: number;
  radiusPxPerRem: number;
  typeUnit: TypeUnit;
  spacingUnit: SwapUnit;
  radiusUnit: SwapUnit;
};

export function defaultUnitSettings(): UnitSettings {
  return {
    rootPx: DEFAULT_ROOT_PX,
    fontPtPerRem: LOGICAL_PT_PER_REM,
    radiusPxPerRem: DEFAULT_ROOT_PX,
    typeUnit: "pt",
    spacingUnit: "px",
    radiusUnit: "rem",
  };
}

export function cssPrintPreset(current: UnitSettings = defaultUnitSettings()): UnitSettings {
  return { ...current, rootPx: DEFAULT_ROOT_PX, fontPtPerRem: CSS_PT_PER_REM_AT_16 };
}

export function logicalPreset(current: UnitSettings = defaultUnitSettings()): UnitSettings {
  return { ...current, rootPx: DEFAULT_ROOT_PX, fontPtPerRem: LOGICAL_PT_PER_REM, radiusPxPerRem: DEFAULT_ROOT_PX };
}

export function readUnitSettings(value: unknown): UnitSettings {
  const defaults = defaultUnitSettings();
  if (!isRecord(value)) return defaults;
  return {
    rootPx: positive(value.rootPx, defaults.rootPx),
    fontPtPerRem: positive(value.fontPtPerRem, defaults.fontPtPerRem),
    radiusPxPerRem: positive(value.radiusPxPerRem, defaults.radiusPxPerRem),
    typeUnit: value.typeUnit === "rem" ? "rem" : "pt",
    spacingUnit: swapUnit(value.spacingUnit, defaults.spacingUnit),
    radiusUnit: swapUnit(value.radiusUnit, defaults.radiusUnit),
  };
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

export function parseLength(value: string): { amount: number; unit: string } | null {
  const match = value.trim().match(/^(-?(?:\d+|\d*\.\d+))(px|rem|em|%|pt)$/);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  return { amount, unit: match[2] };
}

export function ptToRem(pt: number, settings: UnitSettings): number {
  return pt / settings.fontPtPerRem;
}

export function remToPt(rem: number, settings: UnitSettings): number {
  return rem * settings.fontPtPerRem;
}

export function typeAmount(sizePt: number, unit: TypeUnit, settings: UnitSettings): number {
  return unit === "pt" ? sizePt : ptToRem(sizePt, settings);
}

export function typeAmountToPt(amount: number, unit: TypeUnit, settings: UnitSettings): number {
  return unit === "pt" ? amount : remToPt(amount, settings);
}

export function typeSizeCss(sizePt: number, settings: UnitSettings): string {
  return `${formatAmount(sizePt * (settings.rootPx / settings.fontPtPerRem))}px`;
}

export function lengthToPx(value: string, settings: UnitSettings, kind: LengthKind): number | null {
  const parsed = parseLength(value);
  if (!parsed || parsed.unit === "%") return null;
  if (parsed.unit === "px") return parsed.amount;
  if (parsed.unit === "pt") return parsed.amount * (settings.rootPx / settings.fontPtPerRem);
  const pxPerRem = kind === "radius" ? settings.radiusPxPerRem : settings.rootPx;
  return parsed.amount * pxPerRem;
}

export function pxToUnit(px: number, unit: SwapUnit, settings: UnitSettings, kind: LengthKind): number {
  if (unit === "px") return px;
  if (unit === "rem") {
    const pxPerRem = kind === "radius" ? settings.radiusPxPerRem : settings.rootPx;
    return px / pxPerRem;
  }
  return px * (settings.fontPtPerRem / settings.rootPx);
}

export function convertLength(value: string, unit: SwapUnit, settings: UnitSettings, kind: LengthKind): string {
  const parsed = parseLength(value);
  if (!parsed || parsed.unit === "%" || parsed.unit === unit) return value.trim();
  const px = lengthToPx(value, settings, kind);
  if (px == null) return value.trim();
  return `${formatAmount(pxToUnit(px, unit, settings, kind))}${unit}`;
}

export function cssLength(value: string, settings: UnitSettings, kind: LengthKind): string {
  const px = lengthToPx(value, settings, kind);
  if (px == null) return value.trim() || "0px";
  return `${formatAmount(px)}px`;
}

export function lengthEquivalents(value: string, settings: UnitSettings, kind: LengthKind): string {
  const px = lengthToPx(value, settings, kind);
  if (px == null) return value.trim();
  const rem = pxToUnit(px, "rem", settings, kind);
  const pt = pxToUnit(px, "pt", settings, kind);
  return `${formatAmount(px)}px · ${formatAmount(rem)}rem · ${formatAmount(pt)}pt`;
}

export function typeEquivalents(sizePt: number, settings: UnitSettings): string {
  const rem = ptToRem(sizePt, settings);
  const px = sizePt * (settings.rootPx / settings.fontPtPerRem);
  return `${formatAmount(sizePt)}pt · ${formatAmount(rem)}rem · ${formatAmount(px)}px`;
}

function positive(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;
}

function swapUnit(value: unknown, fallback: SwapUnit): SwapUnit {
  return value === "pt" || value === "rem" || value === "px" ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
