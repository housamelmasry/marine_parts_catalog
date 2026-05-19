import { storage } from '../utils/storage';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;       // English name shown in UI
  name_ar: string;    // Arabic name shown in RTL mode
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  tags: string; // space or comma separated tags, e.g. "#yamaha #pump #40hp"
  category?: string; // stores the category name string
  notes: string;
  image_path: string;
  thumbnail_path: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// LocalDatabase
// ─────────────────────────────────────────────

class LocalDatabase {
  private isInitialized = false;

  // Products table
  private products: Map<number, Product> = new Map();
  private autoIncrementId = 1;

  // Categories table
  private categories: Map<number, Category> = new Map();
  private categoryAutoIncrementId = 1;

  // ── Initialization ──────────────────────────

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    this._loadProducts();
    this._loadCategories();

    this.isInitialized = true;
    console.log(
      `DB initialized: ${this.products.size} products, ${this.categories.size} categories.`
    );
    return true;
  }

  // ── Products ────────────────────────────────

  private _loadProducts() {
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
        this._seedProducts();
      }
    } else {
      this._seedProducts();
    }
  }

  private _seedProducts() {
    const initialList: Omit<Product, 'id'>[] = [
      {
        title: 'Yamaha Water Pump',
        price: 2500,
        tags: '#yamaha #pump #40hp',
        category: 'Engine Parts',
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
        category: 'Propellers',
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
        category: 'Filters',
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
        category: 'Electrical',
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
    this._saveProducts();
  }

  private _saveProducts() {
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
    const newProduct: Product = { id, ...product, created_at: now, updated_at: now };
    this.products.set(id, newProduct);
    this._saveProducts();
    return newProduct;
  }

  async update(
    id: number,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Product | null> {
    await this.initialize();
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated: Product = { ...existing, ...data, updated_at: new Date().toISOString() };
    this.products.set(id, updated);
    this._saveProducts();
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    await this.initialize();
    const deleted = this.products.delete(id);
    if (deleted) this._saveProducts();
    return deleted;
  }

  async search(query: string): Promise<Product[]> {
    await this.initialize();
    const term = query.toLowerCase().trim();
    if (!term) return this.getAll();
    return Array.from(this.products.values())
      .filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.tags.toLowerCase().includes(term) ||
          p.notes.toLowerCase().includes(term)
      )
      .sort((a, b) => b.id - a.id);
  }

  // ── Categories ──────────────────────────────

  private _loadCategories() {
    const saved = storage.getItem('sqlite_categories_db');
    if (saved) {
      try {
        const list = JSON.parse(saved) as Category[];
        let maxId = 0;
        list.forEach(c => {
          this.categories.set(c.id, c);
          if (c.id > maxId) maxId = c.id;
        });
        this.categoryAutoIncrementId = maxId + 1;
      } catch (e) {
        console.error('Failed to parse sqlite_categories_db', e);
        this._seedCategories();
      }
    } else {
      this._seedCategories();
    }
  }

  private _seedCategories() {
    const defaults: Omit<Category, 'id' | 'created_at'>[] = [
      { name: 'Engine Parts',  name_ar: 'أجزاء المحرك' },
      { name: 'Propellers',    name_ar: 'رفاصات (بروبيلر)' },
      { name: 'Filters',       name_ar: 'فلاتر' },
      { name: 'Electrical',    name_ar: 'كهرباء' },
      { name: 'General',       name_ar: 'عام' },
      { name: 'Fuel System',   name_ar: 'منظومة الوقود' },
      { name: 'Steering',      name_ar: 'توجيه' },
      { name: 'Hull & Body',   name_ar: 'الهيكل والجسم' },
    ];
    const now = new Date().toISOString();
    defaults.forEach(c => {
      const id = this.categoryAutoIncrementId++;
      this.categories.set(id, { id, ...c, created_at: now });
    });
    this._saveCategories();
  }

  private _saveCategories() {
    const list = Array.from(this.categories.values());
    storage.setItem('sqlite_categories_db', JSON.stringify(list));
  }

  async getAllCategories(): Promise<Category[]> {
    await this.initialize();
    return Array.from(this.categories.values()).sort((a, b) => a.id - b.id);
  }

  async createCategory(name: string, name_ar: string = ''): Promise<Category> {
    await this.initialize();
    // Prevent duplicates (case-insensitive)
    const duplicate = Array.from(this.categories.values()).find(
      c => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) return duplicate;

    const id = this.categoryAutoIncrementId++;
    const category: Category = {
      id,
      name: name.trim(),
      name_ar: name_ar.trim() || name.trim(),
      created_at: new Date().toISOString(),
    };
    this.categories.set(id, category);
    this._saveCategories();
    return category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await this.initialize();
    const deleted = this.categories.delete(id);
    if (deleted) this._saveCategories();
    return deleted;
  }
}

export const db = new LocalDatabase();
export default db;

