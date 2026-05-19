export interface Part {
  id: string;
  refNo: number;
  partNumber: string;
  name: string;
  price: number;
  qtyRequired: number;
  stock: number;
  description: string;
  coordinates: { x: number; y: number; radius: number };
  compatibleModels: string[];
  warehouses: { [key: string]: number };
}

export interface Assembly {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  parts: Part[];
}

export interface EngineModel {
  id: string;
  name: string;
  brand: 'Yamaha' | 'Mercury' | 'Volvo Penta' | 'Rotax';
  year: number;
  category: 'Outboard' | 'Inboard' | 'Sterndrive' | 'JetSki';
  serialNumberRange: string;
  image: string;
  assemblies: Assembly[];
}

export const MOCK_ENGINES: EngineModel[] = [
  {
    id: 'yamaha-f150',
    name: 'Yamaha F150 Four-Stroke',
    brand: 'Yamaha',
    year: 2022,
    category: 'Outboard',
    serialNumberRange: '64P-1000001 - 1050000',
    image: 'engine_yamaha',
    assemblies: [
      {
        id: 'y-cylinder-block',
        name: 'Cylinder Block & Crankcase',
        code: 'Y-01-CBC',
        imageUrl: 'cylinder_block_diagram',
        parts: [
          {
            id: 'y-part-01',
            refNo: 1,
            partNumber: '63P-11311-00-00',
            name: 'Cylinder Sleeve / Liner',
            price: 245.99,
            qtyRequired: 4,
            stock: 8,
            description: 'Genuine Yamaha cylinder sleeve for the F150. High-grade alloy iron provides excellent heat dissipation and wear resistance.',
            coordinates: { x: 80, y: 70, radius: 15 },
            compatibleModels: ['Yamaha F150 (2018-2023)', 'Yamaha LF150'],
            warehouses: { Miami: 4, Seattle: 3, Houston: 1 },
          },
          {
            id: 'y-part-02',
            refNo: 2,
            partNumber: '63P-11325-01-00',
            name: 'Anode Metal Cover',
            price: 18.50,
            qtyRequired: 2,
            stock: 45,
            description: 'Zinc anode cover. Crucial for galvanic corrosion protection in saltwater environments.',
            coordinates: { x: 190, y: 80, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha F200', 'Yamaha F115'],
            warehouses: { Miami: 20, Seattle: 15, Houston: 10 },
          },
          {
            id: 'y-part-03',
            refNo: 3,
            partNumber: '63P-11328-00-00',
            name: 'Gasket, Anode Cover',
            price: 4.75,
            qtyRequired: 2,
            stock: 120,
            description: 'Anode cover sealing gasket. Always replace whenever anode is checked or replaced.',
            coordinates: { x: 190, y: 120, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha F200', 'Yamaha F115'],
            warehouses: { Miami: 50, Seattle: 40, Houston: 30 },
          },
          {
            id: 'y-part-04',
            refNo: 4,
            partNumber: '90430-14M09-00',
            name: 'Gasket, Drain Bolt',
            price: 2.10,
            qtyRequired: 1,
            stock: 350,
            description: 'Fiber compression washer gasket for engine block water drain plug.',
            coordinates: { x: 135, y: 220, radius: 15 },
            compatibleModels: ['All Yamaha Outboards 50HP+'],
            warehouses: { Miami: 150, Seattle: 100, Houston: 100 },
          },
          {
            id: 'y-part-05',
            refNo: 5,
            partNumber: '63P-12411-00-00',
            name: 'Thermostat (60C / 140F)',
            price: 38.25,
            qtyRequired: 1,
            stock: 22,
            description: 'Genuine engine cooling thermostat. Opens at 60C (140F) to regulate engine temperature.',
            coordinates: { x: 260, y: 150, radius: 15 },
            compatibleModels: ['Yamaha F150 (2004-2023)', 'Yamaha F225', 'Yamaha F250'],
            warehouses: { Miami: 10, Seattle: 8, Houston: 4 },
          },
          {
            id: 'y-part-06',
            refNo: 6,
            partNumber: '63P-12413-00-1S',
            name: 'Cover, Thermostat',
            price: 29.90,
            qtyRequired: 1,
            stock: 14,
            description: 'Protective metal thermostat cover housing.',
            coordinates: { x: 260, y: 190, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha LF150'],
            warehouses: { Miami: 5, Seattle: 5, Houston: 4 },
          },
        ],
      },
      {
        id: 'y-water-pump',
        name: 'Water Pump & Lower Unit Cooling',
        code: 'Y-02-WPU',
        imageUrl: 'water_pump_diagram',
        parts: [
          {
            id: 'y-part-11',
            refNo: 1,
            partNumber: '6E5-44352-01-00',
            name: 'Impeller, Water Pump',
            price: 28.50,
            qtyRequired: 1,
            stock: 85,
            description: 'High-durability neoprene water pump impeller. Crucial for raw water cooling intake. Replace annually.',
            coordinates: { x: 150, y: 80, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha F115', 'Yamaha F200 (V6)'],
            warehouses: { Miami: 40, Seattle: 30, Houston: 15 },
          },
          {
            id: 'y-part-12',
            refNo: 2,
            partNumber: '6G5-44323-00-00',
            name: 'Outer Plate, Cartridge',
            price: 19.95,
            qtyRequired: 1,
            stock: 40,
            description: 'Stainless steel wear plate for water pump housing. Forms the upper wear seal surface.',
            coordinates: { x: 150, y: 130, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha F200'],
            warehouses: { Miami: 20, Seattle: 15, Houston: 5 },
          },
          {
            id: 'y-part-13',
            refNo: 3,
            partNumber: '93606-12019-00',
            name: 'Dowel Pin, Half-Round',
            price: 3.20,
            qtyRequired: 1,
            stock: 90,
            description: 'Key pin locking the impeller rotation onto the driveshaft.',
            coordinates: { x: 230, y: 105, radius: 15 },
            compatibleModels: ['All Yamaha Outboards 115-300HP'],
            warehouses: { Miami: 40, Seattle: 30, Houston: 20 },
          },
          {
            id: 'y-part-14',
            refNo: 4,
            partNumber: '6E5-44315-A0-00',
            name: 'Gasket, Water Pump',
            price: 6.30,
            qtyRequired: 1,
            stock: 140,
            description: 'Lower sealing gasket for the water pump wear plate.',
            coordinates: { x: 150, y: 180, radius: 15 },
            compatibleModels: ['Yamaha F150', 'Yamaha 150F', 'Yamaha V6 200-250'],
            warehouses: { Miami: 60, Seattle: 50, Houston: 30 },
          },
        ],
      },
    ],
  },
  {
    id: 'mercury-200-verado',
    name: 'Mercury 200HP Verado L4',
    brand: 'Mercury',
    year: 2021,
    category: 'Outboard',
    serialNumberRange: '2B100000 - 2B750000',
    image: 'engine_mercury',
    assemblies: [
      {
        id: 'm-gearcase',
        name: 'Gearcase Assembly (4.8" Shaft)',
        code: 'M-05-GCA',
        imageUrl: 'gearcase_diagram',
        parts: [
          {
            id: 'm-part-01',
            refNo: 1,
            partNumber: '8M0154749',
            name: 'Gearcase Housing (Empty)',
            price: 1250.00,
            qtyRequired: 1,
            stock: 2,
            description: 'Genuine Mercury Marine lower gearcase housing. Precision machined cast aluminum with anti-corrosion primer coating.',
            coordinates: { x: 90, y: 110, radius: 18 },
            compatibleModels: ['Mercury Verado L4 175-200HP'],
            warehouses: { Miami: 1, Seattle: 0, Houston: 1 },
          },
          {
            id: 'm-part-02',
            refNo: 2,
            partNumber: '43-859473A1',
            name: 'Forward Gear & Pinion Set',
            price: 495.80,
            qtyRequired: 1,
            stock: 5,
            description: 'Bevel gear set, forward and driving pinion gear. Heat-treated steel alloy.',
            coordinates: { x: 190, y: 130, radius: 15 },
            compatibleModels: ['Mercury Verado', 'Mercury Optimax 150+'],
            warehouses: { Miami: 2, Seattle: 2, Houston: 1 },
          },
          {
            id: 'm-part-03',
            refNo: 3,
            partNumber: '26-8M0204781',
            name: 'Propeller Shaft Seal Kit',
            price: 34.50,
            qtyRequired: 1,
            stock: 35,
            description: 'Complete sealing kit containing dual high-temperature prop shaft seals and spacer ring.',
            coordinates: { x: 260, y: 150, radius: 15 },
            compatibleModels: ['Mercury Marine 4.8" Gearcases'],
            warehouses: { Miami: 15, Seattle: 10, Houston: 10 },
          },
        ],
      },
    ],
  },
];
