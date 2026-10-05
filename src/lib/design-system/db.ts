import { parseDesignSystem, type DesignSystemFile } from "./model.ts";

const DB_NAME = "compositional-canvas";
const STORE = "libraries";
const KEY = "design-system";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open the design system library."));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("The design system library failed."));
  });
}

export async function loadDesignSystem(): Promise<DesignSystemFile | null> {
  const db = await openDb();
  try {
    const raw = await requestToPromise(db.transaction(STORE, "readonly").objectStore(STORE).get(KEY));
    if (raw == null) return null;
    const parsed = parseDesignSystem(raw);
    return parsed.ok ? parsed.file : null;
  } finally {
    db.close();
  }
}

export async function saveDesignSystem(file: DesignSystemFile): Promise<void> {
  const db = await openDb();
  try {
    const store = db.transaction(STORE, "readwrite").objectStore(STORE);
    await requestToPromise(store.put(file, KEY));
  } finally {
    db.close();
  }
}
