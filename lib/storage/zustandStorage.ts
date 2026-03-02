import { LocalStorageDriver } from "./localStorageDriver";
import { STORAGE_KEYS } from "./driver";

// Zustand persist adapter (async, driver-backed)
const driver = new LocalStorageDriver();

export const appStateKey = STORAGE_KEYS.appState;

export const zustandStorage = {
  getItem: async (name: string) => {
    return await driver.get(name);
  },
  setItem: async (name: string, value: string) => {
    await driver.set(name, value);
  },
  removeItem: async (name: string) => {
    await driver.remove(name);
  },
};

