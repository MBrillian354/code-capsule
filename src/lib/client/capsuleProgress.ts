// Client-side helpers for capsule learning progress

export function computeProgress(lastPage: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.max(0, (lastPage / total) * 100));
}

type ProgressSave = { last_page_read: number; overall_progress: number };

export function storageKey(id: string) {
  return `capsule-progress:${id}`;
}

export function getSavedProgress(id: string): ProgressSave | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as ProgressSave) : null;
  } catch {
    return null;
  }
}

export function setSavedProgress(id: string, data: ProgressSave) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch {
    // no-op
  }
}

export async function saveProgressToDatabase(
  capsuleId: string,
  lastPageRead: number,
  overallProgress: number
) {
  try {
    await fetch("/api/capsule/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        capsuleId, 
        lastPageRead, 
        overallProgress,
        lastAccessed: new Date().toISOString()
      }),
      keepalive: true,
    });
  } catch (error) {
    // Best-effort only; server is source of truth eventually
    console.warn("Failed to save progress to database:", error);
  }
}

export async function updateLastAccessed(capsuleId: string) {
  try {
    await fetch("/api/capsule/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        capsuleId,
        lastAccessed: new Date().toISOString()
      }),
      keepalive: true,
    });
  } catch (error) {
    // Best-effort only; server is source of truth eventually
    console.warn("Failed to update last accessed time:", error);
  }
}

// Debounced save helper to limit network chatter
const debouncers = new Map<string, number>();

export function debouncedSaveProgress(
  capsuleId: string,
  lastPageRead: number,
  overallProgress: number,
  delay = 600
) {
  if (typeof window === 'undefined') return;
  const key = storageKey(capsuleId);
  const existing = debouncers.get(key);
  if (existing) window.clearTimeout(existing);
  const timeout = window.setTimeout(() => {
    saveProgressToDatabase(capsuleId, lastPageRead, overallProgress);
    debouncers.delete(key);
  }, delay);
  debouncers.set(key, timeout);
}

// Attempt to persist latest progress reliably on unload
export function sendBeaconProgress(
  capsuleId: string,
  lastPageRead: number,
  overallProgress: number
) {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return false;
  const payload = JSON.stringify({
    capsuleId,
    lastPageRead,
    overallProgress,
    lastAccessed: new Date().toISOString(),
  });
  try {
    return navigator.sendBeacon('/api/capsule/progress', new Blob([payload], { type: 'application/json' }));
  } catch {
    return false;
  }
}
