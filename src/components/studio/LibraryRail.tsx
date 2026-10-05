import { colorInputValue, GROUPS, groupCount, groupMeta, visibleCards } from "@/lib/design-system/model";
import { useStudio } from "./store";

const SHELVES = [
  { id: "design-system", label: "Design system", enabled: true },
  { id: "elements", label: "Elements", enabled: false },
  { id: "components", label: "Components", enabled: false },
  { id: "features", label: "Features", enabled: false },
  { id: "sections", label: "Sections", enabled: false },
  { id: "pages", label: "Pages", enabled: false },
] as const;

export function LibraryRail({ onPick }: { onPick?: () => void }) {
  const file = useStudio((state) => state.file);
  const group = useStudio((state) => state.group);
  const selectedId = useStudio((state) => state.selectedId);
  const query = useStudio((state) => state.query);
  const setGroup = useStudio((state) => state.setGroup);
  const select = useStudio((state) => state.select);
  const setQuery = useStudio((state) => state.setQuery);
  const add = useStudio((state) => state.add);
  const meta = groupMeta(group);
  const cards = visibleCards(file, group, query);
  const searching = query.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line px-3 py-3">
        <h2 className="text-xs font-semibold tracking-wide text-muted">Libraries</h2>
        <div className="mt-2 flex w-full min-w-0 gap-2 overflow-x-auto pb-1">
          {SHELVES.map((shelf) =>
            shelf.enabled ? (
              <button
                key={shelf.id}
                type="button"
                aria-current="page"
                className="flex h-14 shrink-0 items-center rounded-control bg-paper px-3 text-sm font-semibold text-ink"
              >
                {shelf.label}
              </button>
            ) : (
              <button
                key={shelf.id}
                type="button"
                disabled
                className="flex h-14 shrink-0 flex-col items-start justify-center rounded-control px-3 text-left text-muted"
              >
                <span className="text-sm">{shelf.label}</span>
                <span className="text-xs">Available in a later phase</span>
              </button>
            ),
          )}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="library-search" className="text-sm font-semibold text-ink">
            Search
          </label>
          <input
            id="library-search"
            className="h-11 w-full rounded-control border border-line bg-studio px-3 text-sm text-ink"
            value={query}
            placeholder="Search tokens"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-wide text-muted">Folders</h2>
          {searching ? (
            <p className="mt-2 text-sm text-muted">Search matches in the design system.</p>
          ) : (
            <div className="mt-1">
              {GROUPS.map((item) => {
                const open = item.id === group;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      aria-expanded={open}
                      className="flex min-h-11 w-full items-center justify-between rounded-control px-2 text-left text-sm"
                      onClick={() => setGroup(item.id)}
                    >
                      <span className={open ? "font-semibold text-ink" : "text-ink"}>{item.label}</span>
                      <span className="tabular-nums text-muted">{groupCount(file, item.id)}</span>
                    </button>
                    {open ? (
                      <FolderBody
                        meaning={meta.meaning}
                        addLabel={meta.add}
                        empty={meta.empty}
                        cards={cards}
                        selectedId={selectedId}
                        fileColors={file.colors}
                        onAdd={() => {
                          add();
                          onPick?.();
                        }}
                        onSelect={(id) => {
                          select(group, id);
                          onPick?.();
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          {searching ? (
            cards.length === 0 ? (
              <div className="mt-3 flex flex-col items-start gap-2">
                <p className="text-sm text-ink">No tokens match "{query.trim()}".</p>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-studio px-3 text-sm font-semibold text-ink"
                  onClick={() => setQuery("")}
                >
                  Clear the search
                </button>
              </div>
            ) : (
              <ul className="mt-2 flex flex-col gap-1">
                {cards.map((card) => (
                  <li key={card.id}>
                    <TokenButton
                      name={card.name}
                      kind={card.kind}
                      selected={card.id === selectedId}
                      swatch={
                        card.group === "color"
                          ? file.colors.find((color) => color.id === card.id)?.value
                          : undefined
                      }
                      onClick={() => {
                        select(card.group, card.id);
                        onPick?.();
                      }}
                    />
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FolderBody({
  meaning,
  addLabel,
  empty,
  cards,
  selectedId,
  fileColors,
  onAdd,
  onSelect,
}: {
  meaning?: string;
  addLabel: string;
  empty: string;
  cards: { id: string; name: string; kind: string; group: string }[];
  selectedId: string | null;
  fileColors: { id: string; value: string }[];
  onAdd: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-2 flex flex-col gap-2 pl-2">
      {meaning ? <p className="text-sm text-muted">{meaning}</p> : null}
      <button
        type="button"
        className="inline-flex min-h-11 items-center justify-center rounded-control border border-line bg-studio px-3 text-sm font-semibold text-ink"
        onClick={onAdd}
      >
        {addLabel}
      </button>
      {cards.length === 0 ? (
        <p className="text-sm text-ink">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {cards.map((card) => (
            <li key={card.id}>
              <TokenButton
                name={card.name}
                kind={card.kind}
                selected={card.id === selectedId}
                swatch={
                  card.group === "color" ? fileColors.find((color) => color.id === card.id)?.value : undefined
                }
                onClick={() => onSelect(card.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TokenButton({
  name,
  kind,
  selected,
  swatch,
  onClick,
}: {
  name: string;
  kind: string;
  selected: boolean;
  swatch?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      className={
        selected
          ? "flex min-h-11 w-full items-center gap-2 rounded-control bg-ink px-3 py-2 text-left text-studio"
          : "flex min-h-11 w-full items-center gap-2 rounded-control px-3 py-2 text-left text-ink hover:bg-paper"
      }
      onClick={onClick}
    >
      {swatch ? (
        <span
          aria-hidden
          className="size-4 shrink-0 rounded-full border border-line"
          style={{ backgroundColor: colorInputValue(swatch) }}
        />
      ) : null}
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{name || "Untitled"}</span>
        <span className={selected ? "block truncate text-xs text-studio/80" : "block truncate text-xs text-muted"}>
          {kind}
        </span>
      </span>
    </button>
  );
}
