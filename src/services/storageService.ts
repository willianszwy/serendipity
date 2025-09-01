import { CONFIG } from '../constants';

/**
 * Enhanced localStorage service with error handling and type safety
 */
export class StorageService {
  private static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private static handleStorageError(error: unknown, operation: string): void {
    console.error(`Storage ${operation} failed:`, error);
    // In a real app, you might want to send this to an error tracking service
  }

  static get<T>(key: string, fallback: T): T {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available, using fallback value');
      return fallback;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      this.handleStorageError(error, 'read');
      return fallback;
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available, data will not be persisted');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      this.handleStorageError(error, 'write');
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available');
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.handleStorageError(error, 'remove');
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      this.handleStorageError(error, 'clear');
      return false;
    }
  }

  // App-specific methods
  static getEntries() {
    return this.get(CONFIG.STORAGE_KEYS.ENTRIES, []);
  }

  static setEntries(entries: unknown[]) {
    return this.set(CONFIG.STORAGE_KEYS.ENTRIES, entries);
  }

  static getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false, usage: null };
    }

    try {
      const entries = this.getEntries();
      return {
        available: true,
        usage: {
          entryCount: entries.length,
          storageSize: new Blob([JSON.stringify(entries)]).size
        }
      };
    } catch (error) {
      this.handleStorageError(error, 'info');
      return { available: true, usage: null };
    }
  }
}