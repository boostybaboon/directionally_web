import { Catalog } from './Catalog';
import { StandardCatalogBuilder } from './catalog/StandardCatalogBuilder';
import type { CatalogItem } from './interfaces/Catalog';

export class CatalogManager {
    private static instance: CatalogManager;
    private standardCatalog: Catalog;
    private catalogs: Map<string, Catalog> = new Map();

    private constructor() {
        this.standardCatalog = StandardCatalogBuilder.build();
        this.catalogs.set('standard', this.standardCatalog);
    }

    public static getInstance(): CatalogManager {
        if (!CatalogManager.instance) {
            CatalogManager.instance = new CatalogManager();
        }
        return CatalogManager.instance;
    }

    public getStandardCatalog(): Catalog {
        return this.standardCatalog;
    }

    public getCatalog(id: string): Catalog | undefined {
        return this.catalogs.get(id);
    }

    public getAllCatalogs(): readonly Catalog[] {
        return Array.from(this.catalogs.values());
    }
} 