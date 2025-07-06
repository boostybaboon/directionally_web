import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { AddObject3D } from '$core/internal/commands/AddObject3D';
import { Scene } from '$core/internal/Scene';
import { ToneProviderMock } from '../../mocks/ToneProviderMock';

describe('AddObject3D', () => {
    it('should add an object to the scene when executed', () => {
        // Arrange
        const toneMock = new ToneProviderMock();
        const scene = new Scene(toneMock, undefined);
        const object = new THREE.Mesh();
        const command = new AddObject3D(object);

        // Act
        command.execute(scene);

        // Assert
        const threeScene = scene.getScene();
        expect(threeScene.children).toContain(object);
    });

    it('should remove the object from the scene when undone', () => {
        // Arrange
        const toneMock = new ToneProviderMock();
        const scene = new Scene(toneMock, undefined);
        const object = new THREE.Mesh();
        const command = new AddObject3D(object);
        command.execute(scene);

        // Act
        command.undo(scene);

        // Assert
        const threeScene = scene.getScene();
        expect(threeScene.children).not.toContain(object);
    });
}); 