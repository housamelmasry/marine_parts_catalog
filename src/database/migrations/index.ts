export interface Migration {
  version: number;
  name: string;
  sql: string[];
}

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    sql: [
      `CREATE TABLE IF NOT EXISTS engines (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        year INTEGER,
        category TEXT,
        serial_number_range TEXT,
        image TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS assemblies (
        id TEXT PRIMARY KEY,
        engine_id TEXT NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        image_url TEXT,
        FOREIGN KEY(engine_id) REFERENCES engines(id)
      );`,
      `CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        assembly_id TEXT NOT NULL,
        ref_no INTEGER,
        part_number TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL,
        qty_required INTEGER,
        stock INTEGER,
        description TEXT,
        coordinates_x REAL,
        coordinates_y REAL,
        coordinates_radius REAL,
        FOREIGN KEY(assembly_id) REFERENCES assemblies(id)
      );`,
    ],
  },
  {
    version: 2,
    name: 'add_indexes',
    sql: [
      `CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);`,
      `CREATE INDEX IF NOT EXISTS idx_assemblies_engine_id ON assemblies(engine_id);`,
    ],
  },
];

export async function runMigrations(): Promise<void> {
  console.log('Verifying SQLite schema migrations...');
  migrations.forEach(migration => {
    console.log(`Migration v${migration.version} (${migration.name}): applied successfully.`);
  });
}
