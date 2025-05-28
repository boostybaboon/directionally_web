<script lang="ts">
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  import type { SelectionListener } from '$core/interfaces/SceneSelector';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';
  import * as THREE from 'three';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');

  // Selection state
  let selectedObjects: THREE.Object3D[] = [];

  // Selection observer
  const selectionObserver: SelectionListener = {
    onSelectionChanged(objects: THREE.Object3D[]) {
      selectedObjects = objects;
    }
  };

  let unsubscribe: (() => void) | null = null;

  // Update selection listener when production changes
  function updateSelectionListener(production: Production | null) {
    // Clean up previous listener
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    // Set up new listener if we have a production
    if (production) {
      unsubscribe = production.sceneSelector.addSelectionListener(selectionObserver);
      // Get initial selection
      selectedObjects = production.sceneSelector.getSelectedObjects();
    } else {
      selectedObjects = [];
    }
  }

  onMount(() => {
    // Set up initial listener
    updateSelectionListener(productionContext.currentProduction);

    // Register as production observer
    const unsubscribeProduction = productionContext.registerObserver({
      onProductionChanged: (production) => {
        updateSelectionListener(production);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      unsubscribeProduction();
    };
  });

  // Format number for display
  function formatNumber(value: number): string {
    return value.toFixed(2);
  }
</script>

<div class="properties-panel">
  {#if selectedObjects.length === 0}
    <div class="empty-state">No object selected</div>
  {:else if selectedObjects.length === 1}
    {@const object = selectedObjects[0]}
    <div class="property-group">
      <h3>Transform</h3>
      <div class="property">
        <label for="pos-x">Position</label>
        <div class="vector3-inputs">
          <div class="input-group">
            <span class="axis-label">X</span>
            <input id="pos-x" type="number" value={formatNumber(object.position.x)} readonly />
          </div>
          <div class="input-group">
            <span class="axis-label">Y</span>
            <input id="pos-y" type="number" value={formatNumber(object.position.y)} readonly />
          </div>
          <div class="input-group">
            <span class="axis-label">Z</span>
            <input id="pos-z" type="number" value={formatNumber(object.position.z)} readonly />
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="empty-state">Multiple objects selected</div>
  {/if}
</div>

<style>
  .properties-panel {
    padding: 1rem;
  }

  .empty-state {
    color: #888;
    font-style: italic;
    padding: 1rem 0;
  }

  .property-group {
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 0.9rem;
    color: #ccc;
    margin: 0 0 0.5rem 0;
  }

  .property {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 0.25rem;
  }

  .vector3-inputs {
    display: flex;
    gap: 0.5rem;
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .axis-label {
    font-size: 0.8rem;
    color: #999;
    width: 1rem;
  }

  input {
    width: 4rem;
    padding: 0.25rem;
    background: #2a2a2a;
    border: 1px solid #333;
    color: #fff;
    font-size: 0.8rem;
  }

  input:read-only {
    opacity: 0.7;
  }
</style> 