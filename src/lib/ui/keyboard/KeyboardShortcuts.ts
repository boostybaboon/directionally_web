import type { DocumentContext } from '$lib/types/document';

export function setupKeyboardShortcuts(documentContext: DocumentContext) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {  // metaKey for Mac
      const { currentDocument } = documentContext;
      if (!currentDocument) return;

      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          currentDocument.commandExecutor.redo();
        } else {
          currentDocument.commandExecutor.undo();
        }
      } else if (key === 'y') {
        e.preventDefault();
        currentDocument.commandExecutor.redo();
      }
    }
  });
} 