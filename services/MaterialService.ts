
import { MaterialDB, MaterialMapping, LearningMaterial } from "../types";

// ⚠️ [설정] 깃허브 Raw 파일 주소 적용
const REMOTE_DB_URL = "https://raw.githubusercontent.com/wondk850/syntax-/main/materials.json"; 

// Cached DB to avoid re-fetching/re-importing
let dbCache: MaterialDB | null = null;

export const MaterialService = {
  /**
   * Lazily loads the materials.json file.
   * Priority: 1. Remote URL (if configured) -> 2. Local File -> 3. Empty Fallback
   */
  async loadDatabase(): Promise<MaterialDB> {
    if (dbCache) {
      // console.log("[MaterialService] Using cached DB.");
      return dbCache;
    }

    // 1. Try fetching from Remote URL (GitHub) if configured
    if (REMOTE_DB_URL && REMOTE_DB_URL.startsWith("http")) {
      try {
        console.log(`[MaterialService] Fetching from remote: ${REMOTE_DB_URL}`);
        const response = await fetch(REMOTE_DB_URL);
        
        if (response.ok) {
          const data = await response.json();
          dbCache = data as MaterialDB;
          console.log("[MaterialService] Remote DB loaded successfully.");
          return dbCache;
        } else {
           console.warn(`[MaterialService] Remote fetch failed with status: ${response.status}`);
        }
      } catch (error) {
        console.warn("[MaterialService] Remote fetch failed, falling back to local.", error);
      }
    }

    // 2. Fallback to Local File
    try {
      // Using 'materials.json' works if the file is served at the project root
      const response = await fetch('materials.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      dbCache = data as MaterialDB;
      return dbCache;
    } catch (error) {
      console.error("[MaterialService] Failed to load local materials.json", error);
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
