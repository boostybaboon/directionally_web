<script lang="ts">
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  import type { SelectionListener, SelectedObject } from '$core/interfaces/SceneSelector';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';
  import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
  import { TransformRenderer } from '../properties/renderers/TransformRenderer';
  import { MeshRenderer } from '../properties/renderers/MeshRenderer';
  import { LightRenderer } from '../properties/renderers/LightRenderer';
  import { CameraRenderer } from '../properties/renderers/CameraRenderer';
  import PropertyInput from '../properties/PropertyInput.svelte';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');

  // Selection state
  let selectedObjects: SelectedObject[] = [];
  let editingProperties: ObjectProperties | null = null;

  // Renderer registry
  const rendererRegistry = {
    transform: new TransformRenderer(),
    mesh: new MeshRenderer(),
    light: new LightRenderer(),
    camera: new CameraRenderer()
  };

  function getPropertyGroups(props: ObjectProperties) {
    const renderer = rendererRegistry[props.type];
    if (!renderer) return [];
    return renderer.render(props as any);
  }

  // Selection observer
  const selectionObserver: SelectionListener = {
    onSelectionChanged(objects: SelectedObject[]) {
      selectedObjects = objects;
      if (objects.length === 1) {
        editingProperties = objects[0].propertyProvider.getProperties();
      } else {
        editingProperties = null;
      }
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
      if (selectedObjects.length === 1) {
        editingProperties = selectedObjects[0].propertyProvider.getProperties();
      }
    } else {
      selectedObjects = [];
      editingProperties = null;
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
</script>

<div class="properties-panel">
  {#if selectedObjects.length === 0}
    <div class="empty-state">No object selected</div>
  {:else if selectedObjects.length === 1 && editingProperties}
    {@const groups = getPropertyGroups(editingProperties)}
    
    {#each groups as group}
      <div class="property-group">
        <h3>{group.label}</h3>
        {#each group.properties as prop}
          <PropertyInput {prop} props={editingProperties} selectedObject={selectedObjects[0]} />
        {/each}
      </div>
    {/each}
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
</style> 