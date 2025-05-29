import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Scene } from '$core/internal/Scene';
import { StandardCatalogBuilder } from '$core/internal/catalog/StandardCatalogBuilder';
import { CatalogItemType } from '$core/types/CatalogItemType';
import type { CatalogItem } from '$core/interfaces/Catalog';
import type { MeshProperties } from '$core/interfaces/PropertyProvider';

describe('Property Change Sequence', () => {
    it('should maintain correct state through undo/redo sequence', () => {
        // Arrange
        const scene = new Scene();
        const catalog = StandardCatalogBuilder.build();
        
        // Find the sphere item in the catalog
        const sphereItem = catalog.getItemsByType(CatalogItemType.Mesh)
            .find((item: CatalogItem) => item.name === 'Sphere');
        expect(sphereItem).toBeDefined();
        
        if (!sphereItem) return;

        // Act - Add sphere
        const addCommand = sphereItem.createCommand();
        scene.execute(addCommand);
        
        // Get the added sphere
        const threeScene = scene.getScene();
        const sphere = threeScene.children.find(
            child => child instanceof THREE.Mesh && 
            child.geometry instanceof THREE.SphereGeometry
        ) as THREE.Mesh;
        expect(sphere).toBeDefined();
        
        // Act - Move sphere
        const newPosition = new THREE.Vector3(2, 0, 0);
        const moveMaterial = (sphere.material as THREE.MeshBasicMaterial).clone();
        moveMaterial.color = (sphere.material as THREE.MeshBasicMaterial).color.clone();
        const moveProperties: MeshProperties = {
            type: 'mesh',
            position: newPosition,
            rotation: sphere.rotation.clone(),
            scale: sphere.scale.clone(),
            material: moveMaterial
        };
        scene.updateObjectProperties(sphere, moveProperties);
        
        // Act - Change color to blue
        const blueColor = new THREE.Color(0x0000ff);
        const colorMaterial = moveMaterial.clone();
        colorMaterial.color = blueColor.clone();
        const colorProperties: MeshProperties = {
            type: 'mesh',
            position: sphere.position.clone(),
            rotation: sphere.rotation.clone(),
            scale: sphere.scale.clone(),
            material: colorMaterial
        };
        scene.updateObjectProperties(sphere, colorProperties);
        
        // Assert - Current state should be blue sphere at new position
        expect((sphere.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0x0000ff);
        expect(sphere.position.x).toBe(2);
        
        // Act - Undo color change
        scene.undo();
        
        // Assert - Should be red sphere at new position
        expect((sphere.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0xe24a4a); // Original red color
        expect(sphere.position.x).toBe(2);
        
        // Act - Undo position change
        scene.undo();
        
        // Assert - Should be red sphere at original position
        expect((sphere.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0xe24a4a);
        expect(sphere.position.x).toBe(0);
        
        // Act - Redo position change
        scene.redo();
        
        // Assert - Should be red sphere at new position
        expect((sphere.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0xe24a4a);
        expect(sphere.position.x).toBe(2);
        
        // Act - Redo color change
        scene.redo();
        
        // Assert - Should be blue sphere at new position
        expect((sphere.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0x0000ff);
        expect(sphere.position.x).toBe(2);
    });
}); 