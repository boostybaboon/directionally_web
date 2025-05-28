// Factory functions
import { ProductionManager } from './internal/ProductionManager';
import type { CatalogManager } from './types/CatalogManager';
import { CatalogManagerImpl } from './internal/CatalogManagerImpl';


// Production Management
export function getProductionManager(): ProductionManager {
    return ProductionManager.getInstance();
}

// Catalog Management
export function getCatalogManager(): CatalogManager {
    return CatalogManagerImpl.getInstance();
}
