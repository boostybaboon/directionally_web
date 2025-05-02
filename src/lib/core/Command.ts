import { Scene } from './Scene';

export interface Command {
    execute(scene: Scene): void;
    undo(scene: Scene): void;
}

export class CommandHistory {
    private undoStack: Command[] = [];
    private redoStack: Command[] = [];

    public push(command: Command): void {
        this.undoStack.push(command);
        this.redoStack = []; // Clear redo stack when new command is executed
    }

    public undo(): Command | undefined {
        const command = this.undoStack.pop();
        if (command) {
            this.redoStack.push(command);
        }
        return command;
    }

    public redo(): Command | undefined {
        const command = this.redoStack.pop();
        if (command) {
            this.undoStack.push(command);
        }
        return command;
    }

    public canUndo(): boolean {
        return this.undoStack.length > 0;
    }

    public canRedo(): boolean {
        return this.redoStack.length > 0;
    }
} 