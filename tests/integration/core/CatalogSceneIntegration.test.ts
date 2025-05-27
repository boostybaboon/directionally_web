import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { StandardCatalogBuilder } from '$core/internal/catalog/StandardCatalogBuilder';
import { Scene } from '$core/internal/Scene';
import { CatalogItemType } from '$core/types/CatalogItemType';
import type { CatalogItem } from '$core/interfaces/Catalog';

describe('Catalog and Scene Integration', () => {
    it('should add a cube from catalog to scene', () => {
        // Arrange
        const catalog = StandardCatalogBuilder.build();
        const scene = new Scene();

        // Find the cube item in the catalog
        const cubeItem = catalog.getItemsByType(CatalogItemType.Mesh)
            .find((item: CatalogItem) => item.name === 'Cube');
        expect(cubeItem).toBeDefined();

        // Act
        if (cubeItem) {
            const command = cubeItem.createCommand();
            scene.execute(command);
        }

        // Assert
        const threeScene = scene.getScene();
        const cubeMesh = threeScene.children.find(
            child => child instanceof THREE.Mesh && 
            child.geometry instanceof THREE.BoxGeometry
        );
        expect(cubeMesh).toBeDefined();
        expect(cubeMesh).toBeInstanceOf(THREE.Mesh);
    });

    it('should add and remove a directional light from catalog to scene', () => {
        // Arrange
        const catalog = StandardCatalogBuilder.build();
        const scene = new Scene();

        // Find the directional light item in the catalog
        const lightItem = catalog.getItemsByType(CatalogItemType.Light)
            .find((item: CatalogItem) => item.name === 'Directional Light');
        expect(lightItem).toBeDefined();

        // Act - Add light
        if (lightItem) {
            const command = lightItem.createCommand();
            scene.execute(command);
        }

        // Assert - Light is added
        const threeScene = scene.getScene();
        const light = threeScene.children.find(
            child => child instanceof THREE.DirectionalLight
        );
        expect(light).toBeDefined();
        expect(light).toBeInstanceOf(THREE.DirectionalLight);

        // Act - Undo command
        scene.undo();

        // Assert - Light is removed
        const lightAfterUndo = threeScene.children.find(
            child => child instanceof THREE.DirectionalLight
        );
        expect(lightAfterUndo).toBeUndefined();
    });

    it('should create a catalog with standard items', () => {
        const catalog = StandardCatalogBuilder.build();
        
        // Test mesh items
        const cubeItem = catalog.getAllItems()
            .find((item: CatalogItem) => item.name === 'Cube');
        expect(cubeItem).toBeDefined();
        expect(cubeItem?.type).toBe(CatalogItemType.Mesh);
        
        // Test light items
        const directionalLight = catalog.getAllItems()
            .find((item: CatalogItem) => item.name === 'Directional Light');
        expect(directionalLight).toBeDefined();
        expect(directionalLight?.type).toBe(CatalogItemType.Light);
    });
}); 