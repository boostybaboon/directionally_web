<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');
  
  // State to track if a production is active
  let hasProduction = false;
  let isPlaying = false;
  let currentTime = 0;
  let totalDuration = 0;
  
  // Register an observer to update hasProduction when the production changes
  const observer = {
    onProductionChanged(production: Production | null) {
      hasProduction = !!production;
      if (!production) {
        isPlaying = false;
        currentTime = 0;
        totalDuration = 0;
      }
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

  function handleRewind() {
    if (productionContext.currentProduction) {
      const animations = productionContext.currentProduction.animationManager.getAnimations();
      animations.forEach(animation => {
        animation.setTime(0);
      });
      currentTime = 0;
    }
  }

  function handlePlay() {
    if (productionContext.currentProduction) {
      const animations = productionContext.currentProduction.animationManager.getAnimations();
      animations.forEach(animation => {
        animation.play();
      });
      isPlaying = true;
    }
  }

  function handlePause() {
    if (productionContext.currentProduction) {
      const animations = productionContext.currentProduction.animationManager.getAnimations();
      animations.forEach(animation => {
        animation.pause();
      });
      isPlaying = false;
    }
  }

  function handleStop() {
    if (productionContext.currentProduction) {
      const animations = productionContext.currentProduction.animationManager.getAnimations();
      animations.forEach(animation => {
        animation.stopAndReset();
      });
      isPlaying = false;
      currentTime = 0;
    }
  }

  function handleFastForward() {
    if (productionContext.currentProduction) {
      const animations = productionContext.currentProduction.animationManager.getAnimations();
      animations.forEach(animation => {
        animation.setTime(totalDuration);
      });
      currentTime = totalDuration;
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="toolbar">
  <div class="toolbar-section">
    <button onclick={handleUndo} title="Undo" disabled={!hasProduction}>↩</button>
    <button onclick={handleRedo} title="Redo" disabled={!hasProduction}>↪</button>
  </div>

  <div class="toolbar-section">
    <button onclick={handleRewind} title="Rewind to start" disabled={!hasProduction}>⏮</button>
    {#if isPlaying}
      <button onclick={handlePause} title="Pause" disabled={!hasProduction}>⏸️</button>
    {:else}
      <button onclick={handlePlay} title="Play" disabled={!hasProduction}>▶️</button>
    {/if}
    <button onclick={handleStop} title="Stop and reset" disabled={!hasProduction}>⏹️</button>
    <button onclick={handleFastForward} title="Fast forward to end" disabled={!hasProduction}>⏭</button>
  </div>

  <div class="toolbar-section time-display">
    <span>{formatTime(currentTime)}</span>
    <span>/</span>
    <span>{formatTime(totalDuration)}</span>
  </div>
</div>

<style>
  .toolbar {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .toolbar-section {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .time-display {
    font-family: monospace;
    font-size: 0.9rem;
    color: #ccc;
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