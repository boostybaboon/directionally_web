import * as THREE from 'three';
import type { Production } from '../interfaces/Production';
import type { Command } from '../interfaces/Command';
import type { CommandExecutor } from '../interfaces/CommandExecutor';
import type { SceneChanger } from '../interfaces/SceneChanger';
import type { SceneViewer } from '../interfaces/SceneViewer';
import type { SceneSelector, SelectionListener, SelectedObject } from '../interfaces/SceneSelector';
import type { AnimationManager } from '../interfaces/AnimationManager';
import { Scene } from './Scene';
import { AnimationManagerImpl } from './AnimationManagerImpl';

export class ProductionImpl implements Production {
    private readonly scene: Scene;
    public readonly commandExecutor: CommandExecutor;
    public readonly sceneChanger: SceneChanger;
    public readonly sceneViewer: SceneViewer;
    public readonly sceneSelector: SceneSelector;
    public readonly animationManager: AnimationManager;

    constructor() {
        this.scene = new Scene();
        this.commandExecutor = this.scene;
        this.sceneChanger = this.scene;
        this.sceneViewer = this.scene;
        this.sceneSelector = this.scene;
        this.animationManager = new AnimationManagerImpl(this.scene);
    }

    // CommandExecutor implementation
    execute(command: Command): void {
        this.scene.execute(command);
    }

    undo(): void {
        this.scene.undo();
    }

    redo(): void {
        this.scene.redo();
    }

    // SceneChanger implementation
    addObject3D(object: THREE.Object3D): void {
        this.scene.addObject3D(object);
    }

    removeObject3D(object: THREE.Object3D): void {
        this.scene.removeObject3D(object);
    }

    // SceneViewer implementation
    getScene(): THREE.Scene {
        return this.scene.getScene();
    }

    update(): void {
        this.scene.update();
    }

    // SceneSelector implementation
    getSelectedObjects(): SelectedObject[] {
        return this.scene.getSelectedObjects();
    }

    setSelectedObjects(objects: THREE.Object3D[]): void {
        this.scene.setSelectedObjects(objects);
    }

    addSelectionListener(listener: SelectionListener): () => void {
        return this.scene.addSelectionListener(listener);
    }
} 