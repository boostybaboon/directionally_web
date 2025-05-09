import { documentService } from '$lib/stores/DocumentService';

export function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {  // metaKey for Mac
      if (e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          documentService.commandExecutor?.redo();
        } else {
          documentService.commandExecutor?.undo();
        }
      } else if (e.key === 'y') {
        e.preventDefault();
        documentService.commandExecutor?.redo();
      }
    }
  });
} 