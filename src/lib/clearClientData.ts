"use client";

// Clears common browser storage areas when the user logs out.
export async function clearUserData(): Promise<void> {
  try {
    if (typeof window === "undefined") return;

    // Clear storages
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }

    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }

    // Clear cookies by setting expiry in the past for each cookie
    try {
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // remove cookie for common paths
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${location.pathname}`;
      }
    } catch (e) {
      // ignore
    }

    // Clear Cache Storage (service worker caches)
    try {
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      // ignore
    }

    // Delete all IndexedDB databases (best-effort)
    try {
      type IDBInfo = { name?: string | null };
      const idb = indexedDB as IDBFactory & { databases?: () => Promise<IDBInfo[]> };
      if (idb && typeof idb.databases === "function") {
        const dbs = await idb.databases();
        const names = dbs
          .map((d) => d && d.name)
          .filter((n): n is string => typeof n === "string");

        await Promise.all(
          names.map((name) =>
            new Promise<void>((res) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = () => res();
              req.onerror = () => res();
              req.onblocked = () => res();
            })
          )
        );
      }
    } catch {
      // ignore
    }

    // Signal other tabs (optional)
    try {
      localStorage.setItem("codecapsule:logout", Date.now().toString());
      localStorage.removeItem("codecapsule:logout");
    } catch (e) {
      // ignore
    }
  } catch {
    // Best-effort only — don't block logout on client-clean failures
  }
}
