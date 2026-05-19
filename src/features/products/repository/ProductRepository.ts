import { db, Product } from '../../../database/db';

export class ProductRepository {
  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return db.create(product);
  }

  async update(id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    return db.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return db.delete(id);
  }

  async search(query: string): Promise<Product[]> {
    return db.search(query);
  }

  async getAll(): Promise<Product[]> {
    return db.getAll();
  }

  async findById(id: number): Promise<Product | null> {
    return db.findById(id);
  }
}

export const productRepository = new ProductRepository();
export default productRepository;
