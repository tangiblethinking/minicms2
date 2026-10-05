import * as Dialog from "@radix-ui/react-dialog";
import { fontStackFor, googleFontStylesheet } from "@/lib/design-system/fonts";
import { groupMeta } from "@/lib/design-system/model";
import { HexControl, NumberControl, SelectControl, SwappableLengthControl, TextControl, TypeSizeControl } from "./controls";
import { typeEquivalents } from "@/lib/design-system/units";
import { useSelection, useStudio } from "./store";

export function SelectionPane() {
  const file = useStudio((state) => state.file);
  const selection = useSelection();
  const deleteOpen = useStudio((state) => state.deleteOpen);
  const setDeleteOpen = useStudio((state) => state.setDeleteOpen);
  const updateColor = useStudio((state) => state.updateColor);
  const updateFont = useStudio((state) => state.updateFont);
  const updateType = useStudio((state) => state.updateType);
  const updateSpacing = useStudio((state) => state.updateSpacing);
  const updateRadius = useStudio((state) => state.updateRadius);
  const updateUnits = useStudio((state) => state.updateUnits);
  const removeSelected = useStudio((state) => state.removeSelected);
  const units = file.units;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
      <h2 className="text-xs font-semibold tracking-wide text-muted">This selection</h2>
      {selection == null ? (
        <p className="mt-3 text-sm text-pretty text-ink">
          Nothing selected. Click a color, font, type style, spacing rule, or radius.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <p className="font-display text-3xl leading-none text-balance text-ink">{selection.item.name || "Untitled"}</p>
            <p className="mt-2 text-sm text-muted">{groupMeta(selection.group).kind}</p>
            {groupMeta(selection.group).meaning ? (
              <p className="mt-2 text-sm text-muted">{groupMeta(selection.group).meaning}</p>
            ) : null}
          </div>
          {selection.group === "color" ? (
            <>
              <TextControl
                label="Name"
                value={selection.item.name}
                onChange={(name) => updateColor(selection.item.id, { name })}
              />
              <HexControl
                label="Hex"
                value={selection.item.value}
                hint={`${selection.item.name || "Color"} · ${selection.item.value}`}
                swatchLabel={`${selection.item.name || "Color"} swatch`}
                onChange={(value) => updateColor(selection.item.id, { value })}
              />
            </>
          ) : null}
          {selection.group === "font" ? (
            <>
              <TextControl
                label="Name"
                value={selection.item.name}
                onChange={(name) => updateFont(selection.item.id, { name })}
              />
              <TextControl
                label="Stack"
                value={selection.item.stack}
                hint="Family name first, then fallbacks. The sample paints this list."
                onChange={(stack) => updateFont(selection.item.id, { stack })}
              />
              <TextControl
                label="Source URL"
                value={selection.item.source}
                hint="Google Fonts stylesheet, or an https .woff2, .woff, .ttf, or .otf file. The sample loads it."
                onChange={(source) => updateFont(selection.item.id, { source })}
              />
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-line bg-studio px-3 text-center text-sm font-semibold text-ink"
                onClick={() =>
                  updateFont(selection.item.id, {
                    stack: fontStackFor(selection.item.name),
                    source: googleFontStylesheet(selection.item.name),
                  })
                }
              >
                Load {selection.item.name || "this family"} from Google Fonts
              </button>
            </>
          ) : null}
          {selection.group === "type" ? (
            <>
              <TextControl
                label="Name"
                value={selection.item.name}
                onChange={(name) => updateType(selection.item.id, { name })}
              />
              <TextControl
                label="Tag"
                value={selection.item.tag}
                onChange={(tag) => updateType(selection.item.id, { tag })}
              />
              <SelectControl
                label="Font"
                value={selection.item.fontId}
                hint={file.fonts.find((font) => font.id === selection.item.fontId)?.stack ?? "Choose a font."}
                onChange={(fontId) => updateType(selection.item.id, { fontId })}
              >
                {file.fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
                {file.fonts.some((font) => font.id === selection.item.fontId) ? null : (
                  <option value={selection.item.fontId}>Missing font</option>
                )}
              </SelectControl>
              <TypeSizeControl
                sizePt={selection.item.sizePt}
                unit={units.typeUnit}
                settings={units}
                onChangePt={(sizePt) => updateType(selection.item.id, { sizePt })}
                onUnit={(typeUnit) => updateUnits({ typeUnit })}
              />
              <p className="text-sm text-muted tabular-nums">{typeEquivalents(selection.item.sizePt, units)}</p>
              <NumberControl
                label="Line height"
                value={selection.item.lineHeight}
                hint="Times the size"
                min={0.5}
                max={4}
                step={0.05}
                onChange={(lineHeight) => updateType(selection.item.id, { lineHeight })}
              />
              <NumberControl
                label="Weight"
                value={selection.item.weight}
                min={1}
                max={900}
                step={1}
                onChange={(weight) => updateType(selection.item.id, { weight })}
              />
            </>
          ) : null}
          {selection.group === "padding" || selection.group === "gap" || selection.group === "margin" ? (
            <>
              <TextControl
                label="Name"
                value={selection.item.name}
                hint={`${selection.item.name || "Rule"} · ${selection.item.mobile} / ${selection.item.desktop}`}
                onChange={(name) => updateSpacing(selection.group, selection.item.id, { name })}
              />
              <SwappableLengthControl
                label="Mobile"
                value={selection.item.mobile}
                unit={units.spacingUnit}
                kind="spacing"
                settings={units}
                onChange={(mobile) => updateSpacing(selection.group, selection.item.id, { mobile })}
                onUnit={(spacingUnit) => updateUnits({ spacingUnit }, "spacing")}
              />
              <SwappableLengthControl
                label="Desktop"
                value={selection.item.desktop}
                unit={units.spacingUnit}
                kind="spacing"
                settings={units}
                onChange={(desktop) => updateSpacing(selection.group, selection.item.id, { desktop })}
                onUnit={(spacingUnit) => updateUnits({ spacingUnit }, "spacing")}
              />
            </>
          ) : null}
          {selection.group === "radius" ? (
            <>
              <TextControl
                label="Name"
                value={selection.item.name}
                onChange={(name) => updateRadius(selection.item.id, { name })}
              />
              <SwappableLengthControl
                label="Value"
                value={selection.item.value}
                unit={units.radiusUnit}
                kind="radius"
                settings={units}
                onChange={(value) => updateRadius(selection.item.id, { value })}
                onUnit={(radiusUnit) => updateUnits({ radiusUnit }, "radius")}
              />
              <p className="text-sm text-muted tabular-nums">
                {selection.item.name || "Radius"} · {selection.item.value}
              </p>
            </>
          ) : null}
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-studio px-3 text-sm font-semibold text-ink"
            onClick={() => setDeleteOpen(true)}
          >
            Delete {selection.item.name || "token"}
          </button>
          <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-studio border border-line bg-studio p-5">
                <Dialog.Title className="font-display text-2xl text-ink">
                  Delete {selection.item.name || "this token"}?
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted">
                  This removes it from the design system.
                </Dialog.Description>
                <div className="mt-5 flex gap-2">
                  <Dialog.Close className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control border border-line bg-studio px-3 text-sm font-semibold text-ink">
                    Cancel
                  </Dialog.Close>
                  <button
                    type="button"
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-control border border-ink bg-studio px-3 text-sm font-semibold text-ink"
                    onClick={removeSelected}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}
    </div>
  );
}
