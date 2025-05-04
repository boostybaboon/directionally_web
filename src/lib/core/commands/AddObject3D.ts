import * as THREE from 'three';
import type { Command } from '../Command';
import type { SceneChanger } from '../interfaces/SceneChanger';

export class AddObject3D implements Command {
    private object: THREE.Object3D;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }

    execute(scene: SceneChanger): void {
        scene.addObject3D(this.object);
    }

    undo(scene: SceneChanger): void {
        scene.removeObject3D(this.object);
    }
} 