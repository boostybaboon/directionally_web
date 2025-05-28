// Core public API
export * from './interfaces/Catalog';
export * from './interfaces/DocumentInterfaces';
export * from './interfaces/CommandExecutor';
export * from './interfaces/SceneChanger';
export * from './interfaces/SceneViewer';
export * from './types/CameraType';
export * from './types/CatalogItemType';

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
