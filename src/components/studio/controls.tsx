import { useEffect, useId, useState, type ReactNode } from "react";
import { colorInputValue, isHex, isLength } from "@/lib/design-system/model";

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
