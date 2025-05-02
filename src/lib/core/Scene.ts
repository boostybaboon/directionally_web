import * as THREE from 'three';
import { CommandHistory, type Command } from './Command';

export interface CommandExecutor {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
}

export class Scene implements CommandExecutor {
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
} 