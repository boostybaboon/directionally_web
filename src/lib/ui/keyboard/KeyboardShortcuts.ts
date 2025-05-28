import type { ProductionContext } from '$lib/types/ProductionContext';

export function setupKeyboardShortcuts(productionContext: ProductionContext) {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {  // metaKey for Mac
      const { currentProduction: currentProduction } = productionContext;
      if (!currentProduction) return;

      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          currentProduction.commandExecutor.redo();
        } else {
          currentProduction.commandExecutor.undo();
        }
      } else if (key === 'y') {
        e.preventDefault();
        currentProduction.commandExecutor.redo();
      }
    }
  });
} 