import { Catalog } from '../internal/Catalog';

export interface CatalogManager {
    getStandardCatalog(): Catalog;
} 