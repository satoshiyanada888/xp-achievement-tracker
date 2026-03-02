export type StorageDriver = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

export type StorageKeyspace = {
  appState: string;
};

export const STORAGE_KEYS: StorageKeyspace = {
  appState: "xp-tracker:state",
};

