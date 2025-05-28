
// Factory functions
import { DocumentManager } from './internal/DocumentManager';
import { CatalogManager } from './internal/CatalogManager';


// Document Management
export function createDocumentManager(): DocumentManager {
    return DocumentManager.getInstance();
}

// Catalog Management
export function createCatalogManager(): CatalogManager {
    return CatalogManager.getInstance();
}
