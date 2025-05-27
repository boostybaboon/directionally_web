import type { Command } from '../internal/Command';
 
export interface CommandExecutor {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
} 