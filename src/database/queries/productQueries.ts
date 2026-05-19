export const productQueries = {
  SEARCH_PARTS: (term: string) => `
    SELECT p.*, a.name as assembly_name, e.name as engine_name 
    FROM parts p
    JOIN assemblies a ON p.assembly_id = a.id
    JOIN engines e ON a.engine_id = e.id
    WHERE p.name LIKE '%${term}%' 
       OR p.part_number LIKE '%${term}%' 
       OR p.description LIKE '%${term}%'
  `,
  
  GET_PARTS_BY_ASSEMBLY: (assemblyId: string) => `
    SELECT * FROM parts 
    WHERE assembly_id = '${assemblyId}' 
    ORDER BY ref_no ASC
  `,

  GET_ASSEMBLIES_BY_ENGINE: (engineId: string) => `
    SELECT * FROM assemblies 
    WHERE engine_id = '${engineId}'
  `,
};
