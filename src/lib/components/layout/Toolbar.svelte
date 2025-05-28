<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');
  
  // State to track if a production is active
  let hasProduction = false;
  
  // Register an observer to update hasProduction when the production changes
  const observer = {
    onProductionChanged(production: Production | null) {
      hasProduction = !!production;
    }
  };
  const unsubscribe = productionContext.registerObserver(observer);
  
  onDestroy(() => {
    unsubscribe();
  });
  
  function handleUndo() {
    if (productionContext.currentProduction) {
      productionContext.currentProduction.commandExecutor.undo();
    }
  }
  
  function handleRedo() {
    if (productionContext.currentProduction) {
      productionContext.currentProduction.commandExecutor.redo();
    }
  }
</script>

<div class="toolbar">
  <button onclick={handleUndo} title="Undo" disabled={!hasProduction}>↩</button>
  <button onclick={handleRedo} title="Redo" disabled={!hasProduction}>↪</button>
</div>

<style>
  .toolbar {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.25rem 0.5rem;
    background: #2d2d2d;
    border: 1px solid #444;
    color: #ccc;
    cursor: pointer;
  }
  
  button:hover:not(:disabled) {
    background: #3d3d3d;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 