import { LocalStorageDriver } from "./localStorageDriver";
import { STORAGE_KEYS } from "./driver";

// Zustand persist adapter (sync, driver-backed)
const driver = new LocalStorageDriver();

export const appStateKey = STORAGE_KEYS.appState;

export const zustandStorage = {
  getItem: (name: string) => {
    return driver.get(name);
  },
  setItem: (name: string, value: string) => {
    driver.set(name, value);
  },
  removeItem: (name: string) => {
    driver.remove(name);
  },
};

