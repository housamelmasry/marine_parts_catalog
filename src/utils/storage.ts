let RNFS: any = null;
try {
  const fs = require('react-native-fs');
  RNFS = fs.default || fs;
} catch (e) {
  console.warn('react-native-fs failed to load, falling back to memory-only storage mode', e);
}

type StorageListener = () => void;

class AppStorage {
  private data: Map<string, string> = new Map();
  private listeners: Map<string, Set<StorageListener>> = new Map();
  private filepath: string = '';
  private isInitialized = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    // Set default initial values
    this.data.set('theme', 'dark');
    this.data.set('preferred_warehouse', 'Miami');
    this.data.set('cart', '[]');
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (RNFS && RNFS.DocumentDirectoryPath) {
          this.filepath = `${RNFS.DocumentDirectoryPath}/app_storage.json`;
          const exists = await RNFS.exists(this.filepath);
          if (exists) {
            const content = await RNFS.readFile(this.filepath, 'utf8');
            if (content) {
              const parsed = JSON.parse(content);
              Object.entries(parsed).forEach(([key, val]) => {
                this.data.set(key, String(val));
              });
              console.log('AppStorage async loaded successfully from disk. Loaded keys:', Array.from(this.data.keys()));
            }
          } else {
            console.log('AppStorage: No persistent file found on disk, using defaults.');
          }
        } else {
          console.warn('AppStorage init: RNFS or DocumentDirectoryPath not available.');
        }
      } catch (e) {
        console.error('AppStorage failed async initialize:', e);
      } finally {
        this.isInitialized = true;
      }
      return true;
    })();

    return this.initPromise;
  }

  private async saveToDisk(): Promise<void> {
    if (!RNFS) return;
    try {
      if (!this.filepath && RNFS.DocumentDirectoryPath) {
        this.filepath = `${RNFS.DocumentDirectoryPath}/app_storage.json`;
      }
      if (!this.filepath) return;

      const obj: Record<string, string> = {};
      this.data.forEach((val, key) => {
        obj[key] = val;
      });
      const content = JSON.stringify(obj, null, 2);
      await RNFS.writeFile(this.filepath, content, 'utf8');
    } catch (e) {
      console.error('Failed to save AppStorage to disk:', e);
    }
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
    this.notify(key);
    this.saveToDisk();
  }

  removeItem(key: string): void {
    this.data.delete(key);
    this.notify(key);
    this.saveToDisk();
  }

  clear(): void {
    this.data.clear();
    this.saveToDisk();
  }

  subscribe(key: string, callback: StorageListener): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      const set = this.listeners.get(key);
      if (set) {
        set.delete(callback);
        if (set.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notify(key: string): void {
    const set = this.listeners.get(key);
    if (set) {
      set.forEach((cb) => {
        try {
          cb();
        } catch (e) {
          console.error('Error running storage listener', e);
        }
      });
    }
  }
}

export const storage = new AppStorage();

