import { documentStore } from '$lib/stores/DocumentStore';
import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';
import { get } from 'svelte/store';

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
      const state = get(documentStore);
      const scene = state.activeDocument?.scene;
      if (!scene || !isCommandExecutor(scene)) return;

      if (e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          scene.redo();
        } else {
          scene.undo();
        }
      } else if (e.key === 'y') {
        e.preventDefault();
        scene.redo();
      }
    }
  });
} 