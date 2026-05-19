import { MOCK_ENGINES, EngineModel, Part } from '../../../constants/mockData';

export const ProductService = {
  async getEnginesList(): Promise<EngineModel[]> {
    return MOCK_ENGINES;
  },

  async getEngineDetails(id: string): Promise<EngineModel | null> {
    return MOCK_ENGINES.find(e => e.id === id) || null;
  },

  async queryParts(query: string): Promise<Part[]> {
    if (!query) return [];
    const term = query.toLowerCase().trim();
    const allParts: Part[] = [];
    MOCK_ENGINES.forEach(engine => {
      engine.assemblies.forEach(assembly => {
        assembly.parts.forEach(part => {
          if (
            part.name.toLowerCase().includes(term) ||
            part.partNumber.toLowerCase().includes(term) ||
            part.description.toLowerCase().includes(term)
          ) {
            allParts.push(part);
          }
        });
      });
    });
    return allParts;
  },

  checkStockStatus(part: Part, warehouse: string): { status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'; count: number } {
    const count = part.warehouses[warehouse] ?? 0;
    if (count > 5) {
      return { status: 'IN_STOCK', count };
    } else if (count > 0) {
      return { status: 'LOW_STOCK', count };
    } else {
      return { status: 'OUT_OF_STOCK', count };
    }
  },
};
export default ProductService;
