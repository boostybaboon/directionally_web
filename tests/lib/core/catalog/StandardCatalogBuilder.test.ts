import { describe, it, expect } from 'vitest';
import { StandardCatalogBuilder } from '$lib/core/catalog/StandardCatalogBuilder';
import { CatalogItemType } from '$lib/core/types/CatalogItemType';

describe('StandardCatalogBuilder', () => {
    it('should create a catalog with standard items', () => {
        const builder = new StandardCatalogBuilder();
        const catalog = builder.build();

        // Check that we have the expected number of items
        expect(catalog.getItems()).toHaveLength(6);

        // Check that we have the expected number of each type
        expect(catalog.getItemsByType(CatalogItemType.Mesh)).toHaveLength(3);
        expect(catalog.getItemsByType(CatalogItemType.Light)).toHaveLength(3);
        expect(catalog.getItemsByType(CatalogItemType.Camera)).toHaveLength(0);

        // Check that each item has a unique ID
        const ids = catalog.getItems().map(item => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('should create items with correct names', () => {
        const builder = new StandardCatalogBuilder();
        const catalog = builder.build();

        const meshNames = catalog.getItemsByType(CatalogItemType.Mesh).map(item => item.name);
        expect(meshNames).toContain('Cube');
        expect(meshNames).toContain('Sphere');
        expect(meshNames).toContain('Plane');

        const lightNames = catalog.getItemsByType(CatalogItemType.Light).map(item => item.name);
        expect(lightNames).toContain('Directional Light');
        expect(lightNames).toContain('Point Light');
        expect(lightNames).toContain('Ambient Light');
    });
}); 