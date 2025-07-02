<script lang="ts">
  import { getContext } from 'svelte';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';
  import type { Animation } from '$core/interfaces/AnimationManager';
  import AnimationDialog from '../dialogs/AnimationDialog.svelte';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');

  // Animation state
  let animations: Animation[] = [];
  let currentProduction: Production | null = null;
  let showDialog = false;

  // Update animations when production changes
  function updateAnimations(production: Production | null) {
    currentProduction = production;
    if (production) {
      animations = production.animationManager.getAnimations();
    } else {
      animations = [];
    }
  }

  // Initialize
  updateAnimations(productionContext.currentProduction);
  const unsubscribe = productionContext.registerObserver({
    onProductionChanged: (production) => {
      updateAnimations(production);
    }
  });

  function handleCreateAnimation() {
    showDialog = true;
  }

  function handleCloseDialog() {
    showDialog = false;
    // Refresh animations list after dialog closes
    if (currentProduction) {
      animations = currentProduction.animationManager.getAnimations();
    }
  }

  function handlePlayAnimation(animation: Animation) {
    animation.play();
  }

  function handlePauseAnimation(animation: Animation) {
    animation.pause();
  }

  function handleStopAnimation(animation: Animation) {
    animation.stopAndReset();
  }
</script>

<div class="animation-panel">
  <div class="panel-header">
    <h3>Animations</h3>
    <button 
      class="create-button" 
      onclick={handleCreateAnimation}
      disabled={!currentProduction}
      title="Create new animation"
    >
      ➕
    </button>
  </div>

  <div class="animation-list">
    {#if animations.length === 0}
      <div class="empty-state">
        No animations created yet
      </div>
    {:else}
      {#each animations as animation}
        <div class="animation-item">
          <div class="animation-info">
            <span class="animation-name">{animation.id}</span>
          </div>
          <div class="animation-controls">
            <button 
              class="control-button" 
              onclick={() => handlePlayAnimation(animation)}
              title="Play"
            >
              ▶️
            </button>
            <button 
              class="control-button" 
              onclick={() => handlePauseAnimation(animation)}
              title="Pause"
            >
              ⏸️
            </button>
            <button 
              class="control-button" 
              onclick={() => handleStopAnimation(animation)}
              title="Stop"
            >
              ⏹️
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<AnimationDialog visible={showDialog} onClose={handleCloseDialog} />

<style>
  .animation-panel {
    padding: 1rem;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #ccc;
  }

  .create-button {
    background: #007acc;
    border: none;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .create-button:hover:not(:disabled) {
    background: #005a9e;
  }

  .create-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animation-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .empty-state {
    color: #888;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }

  .animation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #2d2d2d;
    border-radius: 4px;
    border: 1px solid #444;
  }

  .animation-info {
    flex: 1;
  }

  .animation-name {
    font-size: 0.9rem;
    color: #ccc;
  }

  .animation-controls {
    display: flex;
    gap: 0.25rem;
  }

  .control-button {
    background: #333;
    border: 1px solid #555;
    color: #ccc;
    padding: 0.25rem;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .control-button:hover {
    background: #444;
  }
</style> 