
import { MaterialDB, MaterialMapping, LearningMaterial } from "../types";

// Cached DB to avoid re-fetching/re-importing
let dbCache: MaterialDB | null = null;

export const MaterialService = {
  /**
   * Lazily loads the materials.json file only when needed.
   */
  async loadDatabase(): Promise<MaterialDB> {
    if (dbCache) return dbCache;

    try {
      // Dynamic import for lazy loading (code splitting)
      // This assumes materials.json is in the root or accessible via relative path
      const module = await import('../materials.json');
      // Handle both default export (if JSON module) or direct object
      dbCache = (module.default || module) as MaterialDB;
      return dbCache;
    } catch (error) {
      console.error("Failed to load materials.json", error);
      // Return empty structure on failure to prevent app crash
      return { generated_at: "", vault_name: "", mappings: [] };
    }
  },

  /**
   * Get materials for a specific grammar code.
   */
  async getMaterialsByCode(code: number): Promise<LearningMaterial[]> {
    const db = await this.loadDatabase();
    const mapping = db.mappings.find(m => m.code === code);
    return mapping ? mapping.materials : [];
  },

  /**
   * Helper to extract unique sources from a list of materials for filtering
   */
  getUniqueSources(materials: LearningMaterial[]): string[] {
    const sources = new Set(materials.map(m => m.source));
    return Array.from(sources).sort();
  },

  /**
   * Helper to extract unique types from a list of materials for filtering
   */
  getUniqueTypes(materials: LearningMaterial[]): string[] {
    const types = new Set(materials.map(m => m.type));
    return Array.from(types).sort();
  }
};
