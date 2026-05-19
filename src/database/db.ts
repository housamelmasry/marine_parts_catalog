import { storage } from '../utils/storage';

export interface Product {
  id: number;
  title: string;
  price: number;
  tags: string; // space or comma separated tags, e.g. "#yamaha #pump #40hp"
  notes: string;
  image_path: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
}

class LocalDatabase {
  private isInitialized = false;
  private products: Map<number, Product> = new Map();
  private autoIncrementId = 1;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    // Load from memory storage
    const savedProducts = storage.getItem('sqlite_products_db');
    if (savedProducts) {
      try {
        const list = JSON.parse(savedProducts) as Product[];
        let maxId = 0;
        list.forEach(p => {
          this.products.set(p.id, p);
          if (p.id > maxId) maxId = p.id;
        });
        this.autoIncrementId = maxId + 1;
      } catch (e) {
        console.error('Failed to parse sqlite_products_db', e);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }

    this.isInitialized = true;
    console.log(`Seeded SQLite DB containing ${this.products.size} marine parts.`);
    return true;
  }

  private seedInitialData() {
    const initialList: Omit<Product, 'id'>[] = [
      {
        title: 'Yamaha Water Pump',
        price: 2500,
        tags: '#yamaha #pump #40hp',
        notes: 'Original Japanese water pump kit. Reliable cooling for Yamaha 40HP outboards.',
        image_path: 'part_pump',
        thumbnail_path: 'part_pump',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: 'Mercury Propeller 3-Blade',
        price: 3200,
        tags: '#mercury #propeller #outboard',
        notes: 'High-performance aluminum 3-blade propeller for Mercury motors.',
        image_path: 'part_prop',
        thumbnail_path: 'part_prop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: 'Volvo Penta Primary Fuel Filter',
        price: 1800,
        tags: '#volvo #filter #fuel',
        notes: 'Water separating fuel filter element. Crucial for clean diesel combustion.',
        image_path: 'part_filter',
        thumbnail_path: 'part_filter',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: 'Rotax Spark Plug LFR6A',
        price: 450,
        tags: '#rotax #spark #sparkplug',
        notes: 'Fits Rotax 1630 ACE and Sea-Doo Spark personal watercraft engines.',
        image_path: 'part_spark',
        thumbnail_path: 'part_spark',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    initialList.forEach(p => {
      const id = this.autoIncrementId++;
      this.products.set(id, { id, ...p });
    });
    this.saveToStorage();
  }

  private saveToStorage() {
    const list = Array.from(this.products.values());
    storage.setItem('sqlite_products_db', JSON.stringify(list));
  }

  async getAll(): Promise<Product[]> {
    await this.initialize();
    return Array.from(this.products.values()).sort((a, b) => b.id - a.id);
  }

  async findById(id: number): Promise<Product | null> {
    await this.initialize();
    return this.products.get(id) || null;
  }

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await this.initialize();
    const id = this.autoIncrementId++;
    const now = new Date().toISOString();
    const newProduct: Product = {
      id,
      ...product,
      created_at: now,
      updated_at: now,
    };
    this.products.set(id, newProduct);
    this.saveToStorage();
    return newProduct;
  }

  async update(id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    await this.initialize();
    const existing = this.products.get(id);
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    };
    this.products.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    await this.initialize();
    const deleted = this.products.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  async search(query: string): Promise<Product[]> {
    await this.initialize();
    const term = query.toLowerCase().trim();
    if (!term) return this.getAll();

    return Array.from(this.products.values()).filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.tags.toLowerCase().includes(term) ||
      p.notes.toLowerCase().includes(term)
    ).sort((a, b) => b.id - a.id);
  }
}

export const db = new LocalDatabase();
export default db;
