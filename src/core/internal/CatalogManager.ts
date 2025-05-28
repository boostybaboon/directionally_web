import { Catalog } from './Catalog';
import { StandardCatalogBuilder } from './catalog/StandardCatalogBuilder';

/**
 * Unclear how cataloging will work eventually,
 * but this gets us started in a hard coded way
 */
export class CatalogManager {
    private static instance: CatalogManager;
    private standardCatalog: Catalog;

    private constructor() {
        this.standardCatalog = StandardCatalogBuilder.build();
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
} 