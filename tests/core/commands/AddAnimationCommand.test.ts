import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { AddAnimationCommand } from '$core/internal/commands/AddAnimationCommand';
import { ProductionManager } from '$core/internal/ProductionManager';
import { ToneProviderMock } from '../../mocks/ToneProviderMock';
import type { Production } from '$core/interfaces/Production';

describe('AddAnimationCommand', () => {
    let production: Production;
    let cube: THREE.Mesh;
    let mockClock: THREE.Clock;
    let toneMock: ToneProviderMock;
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
        
        // Create a mock tone provider for testing
        toneMock = new ToneProviderMock();
        
        production = ProductionManager.getInstance().createProduction(toneMock, mockClock);
        
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
            0,  // Start at 0 seconds in global timeline
            1   // Duration of 1 second
        );

        // Execute command on production
        production.commandExecutor.execute(command);

        // Get the animation
        const animation = production.animationManager.getAnimation('moveCube');
        expect(animation).toBeDefined();

        // Check initial position
        expect(cube.position.x).toBeCloseTo(0);

        // Advance timeline to 0.2 seconds - animation should be 20% complete
        toneMock.triggerEventsUpTo(0.2); // Trigger scheduled events up to 0.2s
        currentDelta = 0.2; // Set clock delta for smooth animation
        production.sceneViewer.update(); // Update scene to apply animation
        expect(cube.position.x).toBeCloseTo(1); // 20% of 5 = 1

        // Advance timeline to 0.4 seconds - animation should be 40% complete
        toneMock.triggerEventsUpTo(0.4); // Trigger scheduled events up to 0.4s
        currentDelta = 0.2; // Set clock delta for smooth animation
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(2); // 40% of 5 = 2

        // Test pause
        production.animationManager.pause();
        const pausedPos = cube.position.x;
        toneMock.triggerEventsUpTo(0.6); // Should not advance while paused
        currentDelta = 0.2;
        production.sceneViewer.update();
        expect(cube.position.x).toBeCloseTo(pausedPos);

        // Test stop and reset
        production.animationManager.stop();
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