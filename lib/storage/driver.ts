export type StorageDriver = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
};

export type StorageKeyspace = {
  appState: string;
};

export const STORAGE_KEYS: StorageKeyspace = {
  appState: "xp-tracker:state",
};

