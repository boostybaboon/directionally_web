import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Catalog } from '$lib/core/Catalog';
import type { CatalogItem } from '$lib/core/interfaces/Catalog';
import { AddObject3D } from '$lib/core/commands/AddObject3D';
import { CatalogItemType } from '$lib/core/types/CatalogItemType';

// Mock CatalogItem for testing
class MockCatalogItem implements CatalogItem {
    constructor(
        public id: string,
        public name: string,
        public type: CatalogItemType,
        private object: THREE.Object3D,
        public metadata: Record<string, any> = {}
    ) {}

    createCommand(): AddObject3D {
        return new AddObject3D(this.object);
    }

    getPreview(): THREE.Object3D {
        return this.object;
    }
}

describe('Catalog', () => {
    it('should add and retrieve items', () => {
        const catalog = new Catalog();
        const item = new MockCatalogItem('1', 'Test Mesh', CatalogItemType.Mesh, new THREE.Mesh());

        catalog.addItem(item);
        expect(catalog.getItem('1')).toBe(item);
        expect(catalog.getItems()).toHaveLength(1);
    });

    it('should filter items by type', () => {
        const catalog = new Catalog();
        const meshItem = new MockCatalogItem('1', 'Test Mesh', CatalogItemType.Mesh, new THREE.Mesh());
        const lightItem = new MockCatalogItem('2', 'Test Light', CatalogItemType.Light, new THREE.DirectionalLight());

        catalog.addItem(meshItem);
        catalog.addItem(lightItem);

        expect(catalog.getItemsByType(CatalogItemType.Mesh)).toHaveLength(1);
        expect(catalog.getItemsByType(CatalogItemType.Light)).toHaveLength(1);
        expect(catalog.getItemsByType(CatalogItemType.Camera)).toHaveLength(0);
    });

    it('should remove items', () => {
        const catalog = new Catalog();
        const item = new MockCatalogItem('1', 'Test Mesh', CatalogItemType.Mesh, new THREE.Mesh());

        catalog.addItem(item);
        expect(catalog.getItems()).toHaveLength(1);

        catalog.removeItem('1');
        expect(catalog.getItems()).toHaveLength(0);
        expect(catalog.getItem('1')).toBeUndefined();
    });
}); 