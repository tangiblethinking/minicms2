import { useEffect, useRef, useState } from "react";
import { downloadDesignSystem, EXPORTED_DESIGN_SYSTEM, groupMeta } from "@/lib/design-system/model";
import { LibraryRail } from "./LibraryRail";
import { SamplePane } from "./SamplePane";
import { SelectionPane } from "./SelectionPane";
import { useSelection, useStudio } from "./store";

type Pane = "library" | "sample" | "selection";

export function DesignStudio() {
  const file = useStudio((state) => state.file);
  const group = useStudio((state) => state.group);
  const viewport = useStudio((state) => state.viewport);
  const dirty = useStudio((state) => state.dirty);
  const status = useStudio((state) => state.status);
  const error = useStudio((state) => state.error);
  const setViewport = useStudio((state) => state.setViewport);
  const save = useStudio((state) => state.save);
  const importText = useStudio((state) => state.importText);
  const hydrate = useStudio((state) => state.hydrate);
  const note = useStudio((state) => state.note);
  const selection = useSelection();
  const [pane, setPane] = useState<Pane>("sample");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const crumb = [file.name, groupMeta(group).label, selection?.item.name].filter(Boolean);

  return (
    <div className="flex h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-line bg-studio px-3 py-3 md:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl leading-none text-balance text-ink">Compositional Canvas</h1>
            <p className="mt-1 truncate text-sm text-muted">{file.name}</p>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
            <div role="group" aria-label="Sample spacing" className="grid grid-cols-2 rounded-control border border-line p-1 lg:flex">
              <button
                type="button"
                aria-pressed={viewport === "mobile"}
                className={`${viewportButton(viewport === "mobile")} w-full`}
                onClick={() => setViewport("mobile")}
              >
                Mobile
              </button>
              <button
                type="button"
                aria-pressed={viewport === "desktop"}
                className={`${viewportButton(viewport === "desktop")} w-full`}
                onClick={() => setViewport("desktop")}
              >
                Desktop
              </button>
            </div>
            <div className="grid grid-cols-2 items-stretch gap-2 lg:contents">
              <button type="button" className={`${outlineButton} h-full w-full lg:h-auto lg:w-auto`} onClick={() => importRef.current?.click()}>
                Import
              </button>
              <button
                type="button"
                id="export-design-system"
                className={`${outlineButton} h-full w-full whitespace-normal px-2 text-center leading-tight lg:h-auto lg:w-auto lg:px-3`}
                onClick={() => {
                  downloadDesignSystem(file);
                  note(EXPORTED_DESIGN_SYSTEM);
                }}
              >
                Export design system
              </button>
            </div>
            <button type="button" className={`${filledButton} w-full lg:w-auto`} onClick={() => void save()}>
              Save design system
            </button>
          </div>
        </div>
        <input
          ref={importRef}
          id="import-design-system"
          className="sr-only"
          type="file"
          accept="application/json,.json"
          tabIndex={-1}
          aria-label="Import design system file"
          onChange={(event) => {
            const picked = event.target.files?.[0];
            event.target.value = "";
            if (!picked) return;
            void picked.text().then((text) => importText(text));
          }}
        />
      </header>
      {error ? (
        <div role="alert" className="border-b border-line bg-paper px-4 py-2 text-sm text-ink">
          {error}
        </div>
      ) : status ? (
        <div role="status" className="border-b border-line bg-studio px-4 py-2 text-sm text-muted">
          {status}
        </div>
      ) : (
        <div role="status" className="sr-only" />
      )}
      <div className="grid grid-cols-3 border-b border-line bg-studio lg:hidden">
        {(
          [
            ["library", "Library"],
            ["sample", "Sample"],
            ["selection", "Selection"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={pane === id}
            className={
              pane === id
                ? "min-h-11 border-b-2 border-ink text-sm font-semibold text-ink"
                : "min-h-11 text-sm text-muted"
            }
            onClick={() => setPane(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={
            pane === "library"
              ? "flex min-h-0 min-w-0 flex-1 flex-col bg-studio lg:w-rail lg:flex-none lg:shrink-0 lg:border-r lg:border-line"
              : "hidden min-h-0 min-w-0 bg-studio lg:flex lg:w-rail lg:flex-none lg:shrink-0 lg:border-r lg:border-line"
          }
        >
          <LibraryRail onPick={() => setPane("selection")} />
        </aside>
        <main
          className={
            pane === "sample"
              ? "flex min-h-0 min-w-0 flex-1 flex-col bg-paper"
              : "hidden min-h-0 min-w-0 flex-1 bg-paper lg:flex"
          }
        >
          <SamplePane />
        </main>
        <aside
          className={
            pane === "selection"
              ? "flex min-h-0 min-w-0 flex-1 flex-col bg-studio lg:w-inspector lg:flex-none lg:shrink-0 lg:border-l lg:border-line"
              : "hidden min-h-0 min-w-0 bg-studio lg:flex lg:w-inspector lg:flex-none lg:shrink-0 lg:border-l lg:border-line"
          }
        >
          <SelectionPane />
        </aside>
      </div>
      <footer className="flex min-h-11 items-center justify-between gap-3 border-t border-line bg-studio px-3 md:px-4">
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-2 text-sm text-ink">
            {crumb.map((part, index) => (
              <li key={`${part}-${index}`} className="flex min-w-0 items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden className="text-muted">
                    /
                  </span>
                ) : null}
                <span className={index === crumb.length - 1 ? "truncate" : "shrink-0"}>{part}</span>
              </li>
            ))}
          </ol>
        </nav>
        {dirty ? <p className="shrink-0 text-sm text-muted">Unsaved changes</p> : null}
      </footer>
    </div>
  );
}

const outlineButton =
  "inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-studio px-3 text-sm font-semibold text-ink";
const filledButton =
  "inline-flex min-h-11 items-center justify-center rounded-control border border-fill bg-fill px-3 text-sm font-semibold text-on-fill hover:opacity-90";

function viewportButton(pressed: boolean) {
  return pressed
    ? "inline-flex min-h-11 items-center justify-center rounded-control border border-ink bg-studio px-3 text-sm font-semibold text-ink"
    : "inline-flex min-h-11 items-center justify-center rounded-control border border-transparent px-3 text-sm text-muted";
}
