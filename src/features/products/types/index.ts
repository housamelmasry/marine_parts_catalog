import { Part, Assembly, EngineModel } from '../../../constants/mockData';

export type { Part, Assembly, EngineModel };

export interface PartsFilter {
  query?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
