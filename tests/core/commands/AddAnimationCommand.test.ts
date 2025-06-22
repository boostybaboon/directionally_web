import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { AddAnimationCommand } from '$core/internal/commands/AddAnimationCommand';
import { ProductionImpl } from '$core/internal/ProductionImpl';

describe('AddAnimationCommand', () => {
    let production: ProductionImpl;
    let cube: THREE.Mesh;

    beforeEach(() => {
        production = new ProductionImpl();
        
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

        // Advance time directly on the mixer
        const advanceTime = (delta: number) => {
            // Access the scene's animation actions directly
            const scene = production.sceneViewer as any;
            const action = scene.getAnimationAction('moveCube');
            console.log('Action found:', !!action, 'Delta:', delta);
            if (action) {
                console.log('Action time before:', action.time);
                action.getMixer().update(delta);
                console.log('Action time after:', action.time);
                console.log('Cube position after update:', cube.position.x);
            }
        };

        // Check position at different times by advancing
        advanceTime(0);  // Start at 0
        expect(cube.position.x).toBeCloseTo(0);

        advanceTime(0.2);  // Advance by 0.2s to reach 0.2s
        expect(cube.position.x).toBeCloseTo(1);

        advanceTime(0.2);  // Advance by another 0.2s to reach 0.4s
        expect(cube.position.x).toBeCloseTo(2);

        // Test pause
        animation!.pause();
        const pausedPos = cube.position.x;
        advanceTime(0.5);  // Advance by 0.5s while paused
        expect(cube.position.x).toBeCloseTo(pausedPos);

        // Test rewind
        animation!.stopAndReset();
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