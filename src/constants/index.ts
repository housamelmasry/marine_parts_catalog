import { MOCK_ENGINES, EngineModel, Assembly, Part } from './mockData';

export { MOCK_ENGINES };
export type { EngineModel, Assembly, Part };

export const APP_CONFIG = {
  APP_NAME: 'Marine Parts Catalog',
  VERSION: '1.0.0',
  DEFAULT_WAREHOUSE: 'Miami',
  WAREHOUSES: ['Miami', 'Seattle', 'Houston'],
  BRANDS: ['Yamaha', 'Mercury', 'Volvo Penta', 'Rotax'] as const,
  CATEGORIES: ['Outboard', 'Inboard', 'Sterndrive', 'JetSki'] as const,
};
