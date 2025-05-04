import type { Command } from '../Command';

export interface CommandExecutor {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
} 