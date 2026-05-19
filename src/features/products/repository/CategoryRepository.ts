import { db, Category } from '../../../database/db';

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return db.getAllCategories();
  }

  async create(name: string, name_ar: string = ''): Promise<Category> {
    return db.createCategory(name, name_ar);
  }

  async delete(id: number): Promise<boolean> {
    return db.deleteCategory(id);
  }
}

export const categoryRepository = new CategoryRepository();
export default categoryRepository;
