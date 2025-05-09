import { getDocument } from '$lib/stores/DocumentStore.svelte';
import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';

function isCommandExecutor(obj: unknown): obj is CommandExecutor {
  return obj !== null && 
         typeof obj === 'object' && 
         'execute' in obj && 
         'undo' in obj && 
         'redo' in obj;
}

export function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {  // metaKey for Mac
      const document = getDocument();
      if (!document) return;

      if (e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          document.commandExecutor.redo();
        } else {
          document.commandExecutor.undo();
        }
      } else if (e.key === 'y') {
        e.preventDefault();
        document.commandExecutor.redo();
      }
    }
  });
} 