import { useEffect, useId, useState, type ReactNode } from "react";
import { colorInputValue, isHex, isLength } from "@/lib/design-system/model";
import {
  convertLength,
  formatAmount,
  parseLength,
  typeAmount,
  typeAmountToPt,
  type LengthKind,
  type SwapUnit,
  type TypeUnit,
  type UnitSettings,
} from "@/lib/design-system/units";

const control =
  "h-11 w-full rounded-control border border-line bg-studio px-3 text-sm text-ink";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string, describedBy?: string) => ReactNode;
}) {
  const id = useId();
  const hintId = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children(id, hint ? hintId : undefined)}
      {hint ? (
        <p id={hintId} className="text-sm text-muted tabular-nums" data-hint={label.toLowerCase()}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextControl({
  label,
  value,
  hint,
  onChange,
  autoComplete = "off",
}: {
  label: string;
  value: string;
  hint?: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <input
          id={id}
          className={control}
          value={value}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

export function NumberControl({
  label,
  value,
  hint,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <input
          id={id}
          className={`${control} tabular-nums`}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          aria-describedby={describedBy}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            if (Number.isFinite(next)) onChange(next);
          }}
        />
      )}
    </Field>
  );
}

export function SelectControl({
  label,
  value,
  hint,
  onChange,
  children,
}: {
  label: string;
  value: string;
  hint?: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <select
          id={id}
          className={control}
          value={value}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        >
          {children}
        </select>
      )}
    </Field>
  );
}

export function HexControl({
  label,
  value,
  hint,
  swatchLabel,
  onChange,
}: {
  label: string;
  value: string;
  hint?: string;
  swatchLabel: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <Field label={label} hint={hint}>
      {(id, describedBy) => (
        <div className="flex gap-2">
          <input
            aria-label={swatchLabel}
            className="size-11 shrink-0 rounded-control border border-line bg-studio p-1"
            type="color"
            value={colorInputValue(value)}
            onChange={(event) => onChange(event.target.value.toLowerCase())}
          />
          <input
            id={id}
            className={`${control} font-sans tabular-nums`}
            value={draft}
            spellCheck={false}
            autoComplete="off"
            aria-describedby={describedBy}
            onChange={(event) => {
              const next = event.target.value;
              setDraft(next);
              if (isHex(next)) onChange(next.trim());
            }}
            onBlur={() => setDraft(value)}
          />
        </div>
      )}
    </Field>
  );
}

export function LengthControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <Field label={label}>
      {(id) => (
        <input
          id={id}
          className={`${control} tabular-nums`}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (isLength(next)) onChange(next.trim());
          }}
          onBlur={() => setDraft(value)}
        />
      )}
    </Field>
  );
}

const unitButton =
  "inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-control border px-2 text-sm font-semibold";

export function UnitSwitch({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label="Unit" className="grid min-w-0 gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          className={
            value === option
              ? `${unitButton} border-ink bg-studio text-ink`
              : `${unitButton} border-line bg-studio text-muted`
          }
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function TypeSizeControl({
  sizePt,
  unit,
  settings,
  onChangePt,
  onUnit,
}: {
  sizePt: number;
  unit: TypeUnit;
  settings: UnitSettings;
  onChangePt: (sizePt: number) => void;
  onUnit: (unit: TypeUnit) => void;
}) {
  const shown = typeAmount(sizePt, unit, settings);
  return (
    <Field label="Size" hint={`${formatAmount(sizePt)}pt · ${formatAmount(typeAmount(sizePt, "rem", settings))}rem`}>
      {(id, describedBy) => (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2">
          <input
            id={id}
            className={`${control} min-w-0 tabular-nums`}
            type="number"
            inputMode="decimal"
            min={0.001}
            max={400}
            step={unit === "pt" ? 1 : 0.001}
            value={Number.isFinite(shown) ? formatAmount(shown) : ""}
            aria-describedby={describedBy}
            onChange={(event) => {
              const next = event.target.valueAsNumber;
              if (Number.isFinite(next)) onChangePt(typeAmountToPt(next, unit, settings));
            }}
          />
          <div className="grid w-28 shrink-0 grid-cols-2 gap-1">
            {(["pt", "rem"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={unit === option}
                className={
                  unit === option
                    ? "h-11 rounded-control border border-ink bg-studio text-sm font-semibold text-ink"
                    : "h-11 rounded-control border border-line bg-studio text-sm text-muted"
                }
                onClick={() => onUnit(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </Field>
  );
}

export function SwappableLengthControl({
  label,
  value,
  unit,
  kind,
  settings,
  onChange,
  onUnit,
}: {
  label: string;
  value: string;
  unit: SwapUnit;
  kind: LengthKind;
  settings: UnitSettings;
  onChange: (value: string) => void;
  onUnit: (unit: SwapUnit) => void;
}) {
  const parsed = parseLength(value);
  const shown = parsed ? convertLength(value, unit, settings, kind) : value;
  const amount = parseLength(shown)?.amount;
  return (
    <Field label={label} hint={parsed ? `${value} · ${convertLength(value, unit === "pt" ? "rem" : "pt", settings, kind)}` : "Use pt, rem, or px"}>
      {(id, describedBy) => (
        <div className="flex min-w-0 flex-col gap-2">
          <input
            id={id}
            className={`${control} min-w-0 tabular-nums`}
            type="number"
            inputMode="decimal"
            min={0}
            step={0.001}
            value={amount == null ? "" : formatAmount(amount)}
            aria-describedby={describedBy}
            onChange={(event) => {
              const next = event.target.valueAsNumber;
              if (Number.isFinite(next)) onChange(`${formatAmount(next)}${unit}`);
            }}
          />
          <UnitSwitch value={unit} options={["pt", "rem", "px"]} onChange={(next) => onUnit(next as SwapUnit)} />
        </div>
      )}
    </Field>
  );
}
