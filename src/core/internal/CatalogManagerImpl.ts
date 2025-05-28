import { Catalog } from './Catalog';
import { StandardCatalogBuilder } from './catalog/StandardCatalogBuilder';
import type { CatalogManager } from '../types/CatalogManager';

/**
 * Unclear how cataloging will work eventually,
 * but this gets us started in a hard coded way
 */
export class CatalogManagerImpl implements CatalogManager {
    private static instance: CatalogManagerImpl;
    private standardCatalog: Catalog;

    private constructor() {
        this.standardCatalog = StandardCatalogBuilder.build();
    }

    public static getInstance(): CatalogManagerImpl {
        if (!CatalogManagerImpl.instance) {
            CatalogManagerImpl.instance = new CatalogManagerImpl();
        }
        return CatalogManagerImpl.instance;
    }

    public getStandardCatalog(): Catalog {
        return this.standardCatalog;
    }
} 