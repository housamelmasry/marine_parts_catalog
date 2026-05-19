type StorageListener = () => void;

class AppStorage {
  private data: Map<string, string> = new Map();
  private listeners: Map<string, Set<StorageListener>> = new Map();

  constructor() {
    // Set default initial values
    this.data.set('theme', 'dark');
    this.data.set('preferred_warehouse', 'Miami');
    this.data.set('cart', '[]');
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
    this.notify(key);
  }

  removeItem(key: string): void {
    this.data.delete(key);
    this.notify(key);
  }

  clear(): void {
    this.data.clear();
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
