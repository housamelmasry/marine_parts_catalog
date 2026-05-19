import { MOCK_ENGINES, Part } from '../../constants/mockData';

export interface SearchResult {
  part: Part;
  engineName: string;
  assemblyName: string;
  matchScore: number;
}

export const SearchService = {
  searchParts(query: string): SearchResult[] {
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return [];

    const results: SearchResult[] = [];

    MOCK_ENGINES.forEach(engine => {
      engine.assemblies.forEach(assembly => {
        assembly.parts.forEach(part => {
          let matchScore = 0;

          // Perfect match on part number (highest priority)
          if (part.partNumber.toLowerCase() === cleaned) {
            matchScore += 100;
          } else if (part.partNumber.toLowerCase().includes(cleaned)) {
            matchScore += 50;
          }

          // Name matching
          if (part.name.toLowerCase() === cleaned) {
            matchScore += 80;
          } else if (part.name.toLowerCase().includes(cleaned)) {
            matchScore += 30;
          }

          // Description matching
          if (part.description.toLowerCase().includes(cleaned)) {
            matchScore += 10;
          }

          if (matchScore > 0) {
            results.push({
              part,
              engineName: engine.name,
              assemblyName: assembly.name,
              matchScore,
            });
          }
        });
      });
    });

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  },
};
export default SearchService;
