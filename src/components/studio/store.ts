import { useMemo } from "react";
import { create } from "zustand";
import { loadDesignSystem, saveDesignSystem } from "@/lib/design-system/db";
import {
  addToGroup,
  findSelection,
  groupOfId,
  IMPORTED_DESIGN_SYSTEM,
  openingDesignSystem,
  parseDesignSystemJson,
  removeFromGroup,
  sanitizeDesignSystem,
  SAVED_DESIGN_SYSTEM,
  type ColorToken,
  type DesignSystemFile,
  type FontToken,
  type GroupId,
  type RadiusToken,
  type SpacingToken,
  type TypeStyle,
} from "@/lib/design-system/model";
import type { Viewport } from "@/lib/design-system/sample";
import { convertLength, type SwapUnit, type UnitSettings } from "@/lib/design-system/units";

const opening = openingDesignSystem();

type StudioState = {
  file: DesignSystemFile;
  dirty: boolean;
  group: GroupId;
  selectedId: string | null;
  viewport: Viewport;
  query: string;
  status: string | null;
  error: string | null;
  deleteOpen: boolean;
  setGroup: (group: GroupId) => void;
  select: (group: GroupId, id: string) => void;
  setQuery: (query: string) => void;
  setViewport: (viewport: Viewport) => void;
  setDeleteOpen: (open: boolean) => void;
  updateColor: (id: string, patch: Partial<Pick<ColorToken, "name" | "value">>) => void;
  updateFont: (id: string, patch: Partial<Pick<FontToken, "name" | "stack" | "source">>) => void;
  updateType: (id: string, patch: Partial<Omit<TypeStyle, "id">>) => void;
  updateSpacing: (
    group: "padding" | "gap" | "margin",
    id: string,
    patch: Partial<Pick<SpacingToken, "name" | "mobile" | "desktop">>,
  ) => void;
  updateRadius: (id: string, patch: Partial<Pick<RadiusToken, "name" | "value">>) => void;
  updateUnits: (patch: Partial<UnitSettings>, rewrite?: "spacing" | "radius") => void;
  add: () => void;
  removeSelected: () => void;
  save: () => Promise<void>;
  importText: (text: string) => Promise<void>;
  hydrate: () => Promise<void>;
  note: (status: string) => void;
};

function edited(file: DesignSystemFile) {
  return { file, dirty: true, status: null as string | null, error: null as string | null };
}

export const useStudio = create<StudioState>((set, get) => ({
  file: opening,
  dirty: false,
  group: "type",
  selectedId: "type-h1",
  viewport: "desktop",
  query: "",
  status: null,
  error: null,
  deleteOpen: false,
  setGroup: (group) => set({ group, selectedId: null, deleteOpen: false }),
  select: (group, id) => set({ group, selectedId: id, deleteOpen: false }),
  setQuery: (query) => set({ query }),
  setViewport: (viewport) => set({ viewport }),
  setDeleteOpen: (deleteOpen) => set({ deleteOpen }),
  updateColor: (id, patch) =>
    set((state) =>
      edited({
        ...state.file,
        colors: state.file.colors.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }),
    ),
  updateFont: (id, patch) =>
    set((state) =>
      edited({
        ...state.file,
        fonts: state.file.fonts.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }),
    ),
  updateType: (id, patch) =>
    set((state) =>
      edited({
        ...state.file,
        typeStyles: state.file.typeStyles.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }),
    ),
  updateSpacing: (group, id, patch) =>
    set((state) =>
      edited({
        ...state.file,
        spacing: {
          ...state.file.spacing,
          [group]: state.file.spacing[group].map((item) => (item.id === id ? { ...item, ...patch } : item)),
        },
      }),
    ),
  updateRadius: (id, patch) =>
    set((state) =>
      edited({
        ...state.file,
        radius: state.file.radius.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }),
    ),
  updateUnits: (patch, rewrite) =>
    set((state) => {
      const units = { ...state.file.units, ...patch };
      const file = { ...state.file, units };
      if (rewrite === "spacing") {
        const unit = units.spacingUnit;
        file.spacing = {
          padding: file.spacing.padding.map((item) => rewriteSpacing(item, unit, units)),
          gap: file.spacing.gap.map((item) => rewriteSpacing(item, unit, units)),
          margin: file.spacing.margin.map((item) => rewriteSpacing(item, unit, units)),
        };
      }
      if (rewrite === "radius") {
        file.radius = file.radius.map((item) => ({
          ...item,
          value: convertLength(item.value, units.radiusUnit, units, "radius"),
        }));
      }
      return edited(file);
    }),
  add: () => {
    const { file, group } = get();
    const next = addToGroup(file, group);
    set({ ...edited(next.file), selectedId: next.id, query: "" });
  },
  removeSelected: () => {
    const { file, group, selectedId } = get();
    if (!selectedId) return;
    set({
      ...edited(removeFromGroup(file, group, selectedId)),
      selectedId: null,
      deleteOpen: false,
    });
  },
  save: async () => {
    const file = sanitizeDesignSystem({ ...get().file, updatedAt: new Date().toISOString() });
    try {
      await saveDesignSystem(file);
    } catch {
      set({
        error: "Could not save the design system in this browser. Export a copy.",
        status: null,
      });
      return;
    }
    set({ file, dirty: false, status: SAVED_DESIGN_SYSTEM, error: null });
  },
  importText: async (text) => {
    const parsed = parseDesignSystemJson(text);
    if (!parsed.ok) {
      set({ error: parsed.message, status: null });
      return;
    }
    const file = sanitizeDesignSystem(parsed.file);
    try {
      await saveDesignSystem(file);
    } catch {
      set({
        file,
        dirty: true,
        error: "Imported the design system, but this browser could not store it. Save again.",
        status: null,
        selectedId: keepSelection(get().selectedId, file),
        group: groupOfId(file, keepSelection(get().selectedId, file) ?? "") ?? get().group,
      });
      return;
    }
    const selectedId = keepSelection(get().selectedId, file);
    set({
      file,
      dirty: false,
      error: null,
      status: IMPORTED_DESIGN_SYSTEM,
      selectedId,
      group: (selectedId && groupOfId(file, selectedId)) || get().group,
      deleteOpen: false,
    });
  },
  hydrate: async () => {
    if (get().dirty) return;
    try {
      const stored = await loadDesignSystem();
      if (!stored || get().dirty) return;
      const selectedId = stored.typeStyles.find((style) => style.id === "type-h1")?.id ?? stored.typeStyles[0]?.id ?? null;
      set({
        file: stored,
        dirty: false,
        selectedId,
        group: selectedId ? (groupOfId(stored, selectedId) ?? "type") : "type",
      });
    } catch {
      set({ error: "Could not open the saved design system. The opening system is shown.", status: null });
    }
  },
  note: (status) => set({ status, error: null }),
}));

function keepSelection(selectedId: string | null, file: DesignSystemFile): string | null {
  if (selectedId && groupOfId(file, selectedId)) return selectedId;
  return file.typeStyles.find((style) => style.name === "H1")?.id ?? file.typeStyles[0]?.id ?? null;
}

export function useSelection() {
  const file = useStudio((state) => state.file);
  const group = useStudio((state) => state.group);
  const selectedId = useStudio((state) => state.selectedId);
  return useMemo(() => findSelection(file, group, selectedId), [file, group, selectedId]);
}

function rewriteSpacing(token: SpacingToken, unit: SwapUnit, units: UnitSettings): SpacingToken {
  return {
    ...token,
    mobile: convertLength(token.mobile, unit, units, "spacing"),
    desktop: convertLength(token.desktop, unit, units, "spacing"),
  };
}
