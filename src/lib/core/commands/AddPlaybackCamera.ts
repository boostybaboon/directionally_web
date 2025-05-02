import * as THREE from 'three';
import type { Command } from '../Command';
import type { SceneChanger } from '../Scene';

export class AddPlaybackCamera implements Command {
    private camera: THREE.PerspectiveCamera;
    private cameraId: string | null = null;

    constructor(
        fov: number = 75,
        near: number = 0.1,
        far: number = 1000,
        position: THREE.Vector3 = new THREE.Vector3(0, 0, 5),
        target: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {
        this.camera = new THREE.PerspectiveCamera(fov, 1, near, far);
        this.camera.position.copy(position);
        this.camera.lookAt(target);
    }

    execute(scene: SceneChanger): void {
        this.cameraId = scene.addPlaybackCamera(this.camera);
    }

    undo(scene: SceneChanger): void {
        if (this.cameraId) {
            scene.removePlaybackCamera(this.cameraId);
            this.cameraId = null;
        }
    }
} 