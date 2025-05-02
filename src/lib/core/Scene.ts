import * as THREE from 'three';
import { CommandHistory, type Command } from './Command';

export interface CommandExecutor {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
}

export interface SceneChanger {
    addObject3D(object: THREE.Object3D): void;
    removeObject3D(object: THREE.Object3D): void;
}

export class Scene implements CommandExecutor, SceneChanger {
    private threeScene: THREE.Scene;
    private commandHistory: CommandHistory;

    constructor() {
        this.threeScene = new THREE.Scene();
        this.commandHistory = new CommandHistory();
    }

    public execute(command: Command): void {
        command.execute(this);
        this.commandHistory.push(command);
    }

    public undo(): void {
        const command = this.commandHistory.undo();
        if (command) {
            command.undo(this);
        }
    }

    public redo(): void {
        const command = this.commandHistory.redo();
        if (command) {
            command.execute(this);
        }
    }

    public addObject3D(object: THREE.Object3D): void {
        this.threeScene.add(object);
    }

    public removeObject3D(object: THREE.Object3D): void {
        this.threeScene.remove(object);
    }
} 