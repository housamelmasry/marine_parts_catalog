import { db } from '../db';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findAll(): Promise<T[]> {
    if (this.tableName === 'products') {
      const results = await db.getAll();
      return results as unknown as T[];
    }
    return [];
  }

  async findById(id: number): Promise<T | null> {
    if (this.tableName === 'products') {
      const result = await db.findById(id);
      return result as unknown as T;
    }
    return null;
  }
}
