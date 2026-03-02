import type { StorageDriver } from "./driver";

export class LocalStorageDriver implements StorageDriver {
  async get(key: string) {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore quota / private mode
    }
  }

  async remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

