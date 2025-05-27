import { describe, it, expect } from 'vitest';
import { StandardCatalogBuilder } from '$core/internal/catalog/StandardCatalogBuilder';
import type { CatalogItem } from '$core/interfaces/Catalog';
import { CatalogItemType } from '$core/types/CatalogItemType';

describe('StandardCatalogBuilder', () => {
    it('should create a catalog with standard items', () => {
        const catalog = StandardCatalogBuilder.build();
        
        // Test that all items have unique IDs
        const ids = catalog.getAllItems().map((item: CatalogItem) => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
        
        // Test mesh items
        const meshNames = catalog.getItemsByType(CatalogItemType.Mesh).map((item: CatalogItem) => item.name);
        expect(meshNames).toContain('Cube');
        expect(meshNames).toContain('Sphere');
        expect(meshNames).toContain('Plane');
        
        // Test light items
        const lightNames = catalog.getItemsByType(CatalogItemType.Light).map((item: CatalogItem) => item.name);
        expect(lightNames).toContain('Directional Light');
        expect(lightNames).toContain('Point Light');
        expect(lightNames).toContain('Ambient Light');
    });
}); 