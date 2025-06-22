import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { AddAnimationCommand } from '$core/internal/commands/AddAnimationCommand';
import { ProductionManager } from '$core/internal/ProductionManager';
import type { Production } from '$core/interfaces/Production';

describe('AddAnimationCommand', () => {
    let production: Production;
    let cube: THREE.Mesh;
    let mockClock: THREE.Clock;
    let currentDelta = 0;

    beforeEach(() => {
        // Create a mock clock that allows setting delta values for testing
        currentDelta = 0;
        mockClock = {
            getDelta: () => currentDelta,
            start: () => {},
            stop: () => {},
            getElapsedTime: () => 0,
            autoStart: true
        } as THREE.Clock;
        
        production = ProductionManager.getInstance().createProduction(mockClock);
        
        // Create a test cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial();
        cube = new THREE.Mesh(geometry, material);
        production.sceneChanger.addObject3D(cube);
    });

    it('should animate an object and update its properties', () => {
        // Create animation command
        const startPos = new THREE.Vector3(0, 0, 0);
        const endPos = new THREE.Vector3(5, 0, 0);
        const command = new AddAnimationCommand(
            'moveCube',
            cube,
            '.position',
            startPos,
            endPos,
            0,
            1
        );

        // Execute command on production
        production.commandExecutor.execute(command);

        // Get the animation
        const animation = production.animationManager.getAnimation('moveCube');
        expect(animation).toBeDefined();

        // Start animation
        animation!.play();

        // Check position at different times by advancing with specific deltas
        currentDelta = 0;
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(0);

        currentDelta = 0.2;
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(1);

        currentDelta = 0.2;
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(2);

        // Test pause
        animation!.pause();
        const pausedPos = cube.position.x;
        currentDelta = 0.4; // Should not advance while paused
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(pausedPos);

        // Test rewind
        animation!.stopAndReset();
        currentDelta = 0.5;
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(0);
    });

    it('should clean up animations on undo', () => {
        // Create and execute animation command
        const command = new AddAnimationCommand(
            'moveCube',
            cube,
            '.position',
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 0, 0),
            0,
            1
        );
        production.commandExecutor.execute(command);

        // Verify animation exists
        expect(production.animationManager.getAnimation('moveCube')).toBeDefined();

        // Undo command
        production.commandExecutor.undo();

        // Verify animation is removed
        expect(production.animationManager.getAnimation('moveCube')).toBeUndefined();
    });
}); 