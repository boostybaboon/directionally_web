<script lang="ts">
  import { getContext } from 'svelte';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { SelectedObject } from '$core/interfaces/SceneSelector';
  import { AddAnimationCommand } from '$core/internal/commands/AddAnimationCommand';
  import * as THREE from 'three';

  // Props
  export let visible = false;
  export let onClose: () => void = () => {};

  // Get production context
  const productionContext = getContext<ProductionContext>('production');

  // Form state
  let selectedObject: SelectedObject | null = null;
  let selectedProperty = '';
  let startValue = { x: 0, y: 0, z: 0 };
  let endValue = { x: 1, y: 0, z: 0 };
  let duration = 1;
  let animationName = '';
  let selectedObjects: SelectedObject[] = [];

  // Initialize selectedObjects if context is available
  if (productionContext && productionContext.currentProduction) {
    selectedObjects = productionContext.currentProduction.sceneSelector.getSelectedObjects();
  }

  // Available properties for animation
  const availableProperties = [
    { value: '.position', label: 'Position' },
    { value: '.rotation', label: 'Rotation' },
    { value: '.scale', label: 'Scale' }
  ];

  // Get selected objects from production
  function getSelectedObjects(): SelectedObject[] {
    try {
      if (!productionContext || !productionContext.currentProduction) return [];
      return productionContext.currentProduction.sceneSelector.getSelectedObjects();
    } catch (error) {
      console.warn('Error getting selected objects:', error);
      return [];
    }
  }

  function handleCreate() {
    if (!productionContext || !productionContext.currentProduction || !selectedObject || !selectedProperty || !animationName) {
      return;
    }

    // Create Vector3 values for the animation
    const startVector = new THREE.Vector3(startValue.x, startValue.y, startValue.z);
    const endVector = new THREE.Vector3(endValue.x, endValue.y, endValue.z);

    // Create animation command
    const command = new AddAnimationCommand(
      animationName,
      selectedObject.object,
      selectedProperty,
      startVector,
      endVector,
      0,
      duration
    );

    // Execute command
    productionContext.currentProduction.commandExecutor.execute(command);

    // Close dialog
    onClose();
  }

  function handleCancel() {
    onClose();
  }

  // Update selected objects when dialog becomes visible
  $: if (visible) {
    selectedObjects = getSelectedObjects();
    // Don't automatically set selectedObject to avoid infinite loops
    // The user should select objects before opening the dialog
  }

  function getPropertyValue(object: THREE.Object3D, propertyPath: string): { x: number, y: number, z: number } {
    if (!object) return { x: 0, y: 0, z: 0 };
    
    try {
      // Remove the leading dot from the property path
      const cleanPath = propertyPath.startsWith('.') ? propertyPath.slice(1) : propertyPath;
      const value = (object as any)[cleanPath];
      if (value && typeof value.x === 'number' && typeof value.y === 'number' && typeof value.z === 'number') {
        return { x: value.x, y: value.y, z: value.z };
      }
      return { x: 0, y: 0, z: 0 };
    } catch (error) {
      console.warn('Error getting property value:', error);
      return { x: 0, y: 0, z: 0 };
    }
  }

  function handlePropertyChange() {
    if (selectedObject && selectedProperty) {
      const currentValue = getPropertyValue(selectedObject.object, selectedProperty);
      startValue = { ...currentValue };
      endValue = { x: currentValue.x + 1, y: currentValue.y, z: currentValue.z };
    }
  }

  function handleObjectSelect(object: SelectedObject) {
    selectedObject = object;
    // Reset property selection when object changes
    selectedProperty = '';
    startValue = { x: 0, y: 0, z: 0 };
    endValue = { x: 1, y: 0, z: 0 };
  }
</script>

{#if visible}
  <div class="dialog-overlay" role="button" tabindex="0" onclick={handleCancel} onkeydown={(e) => e.key === 'Escape' && handleCancel()}>
    <div class="dialog" role="dialog" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <div class="dialog-header">
        <h2>Create Animation</h2>
        <button class="close-button" onclick={handleCancel}>×</button>
      </div>

      <div class="dialog-body">
        <div class="form-group">
          <label for="object-select">Object:</label>
          {#if selectedObjects.length === 0}
            <div class="instruction-text">
              Please select an object in the Scene Graph panel first
            </div>
          {:else if selectedObjects.length === 1}
            <div class="selected-object">
              <span class="object-name">{selectedObjects[0]?.object?.name || 'Unnamed Object'}</span>
              <button 
                class="select-button" 
                onclick={() => handleObjectSelect(selectedObjects[0])}
                disabled={selectedObject === selectedObjects[0]}
              >
                {selectedObject === selectedObjects[0] ? 'Selected' : 'Select'}
              </button>
            </div>
          {:else}
            <div class="instruction-text">
              Please select exactly one object in the Scene Graph panel (currently {selectedObjects.length} selected)
            </div>
          {/if}
        </div>

        <div class="form-group">
          <label for="property-select">Property:</label>
          <select 
            id="property-select" 
            bind:value={selectedProperty}
            onclick={handlePropertyChange}
            disabled={!selectedObject}
          >
            <option value="">Select a property</option>
            {#each availableProperties as prop}
              <option value={prop.value}>{prop.label}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="animation-name">Animation Name:</label>
          <input 
            id="animation-name" 
            type="text" 
            bind:value={animationName}
            placeholder="Enter animation name"
          />
        </div>

        <div class="form-group">
          <label for="start-value-group">Start Value:</label>
          <div class="vector3-inputs" id="start-value-group">
            <div class="vector3-component">
              <label for="start-value-x">X:</label>
              <input 
                id="start-value-x" 
                type="number" 
                bind:value={startValue.x}
                step="0.1"
              />
            </div>
            <div class="vector3-component">
              <label for="start-value-y">Y:</label>
              <input 
                id="start-value-y" 
                type="number" 
                bind:value={startValue.y}
                step="0.1"
              />
            </div>
            <div class="vector3-component">
              <label for="start-value-z">Z:</label>
              <input 
                id="start-value-z" 
                type="number" 
                bind:value={startValue.z}
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="end-value-group">End Value:</label>
          <div class="vector3-inputs" id="end-value-group">
            <div class="vector3-component">
              <label for="end-value-x">X:</label>
              <input 
                id="end-value-x" 
                type="number" 
                bind:value={endValue.x}
                step="0.1"
              />
            </div>
            <div class="vector3-component">
              <label for="end-value-y">Y:</label>
              <input 
                id="end-value-y" 
                type="number" 
                bind:value={endValue.y}
                step="0.1"
              />
            </div>
            <div class="vector3-component">
              <label for="end-value-z">Z:</label>
              <input 
                id="end-value-z" 
                type="number" 
                bind:value={endValue.z}
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="duration">Duration (seconds):</label>
          <input 
            id="duration" 
            type="number" 
            bind:value={duration}
            min="0.1"
            step="0.1"
          />
        </div>
      </div>

      <div class="dialog-footer">
        <button class="cancel-button" onclick={handleCancel}>Cancel</button>
        <button 
          class="create-button" 
          onclick={handleCreate}
          disabled={!selectedObject || !selectedProperty || !animationName}
        >
          Create Animation
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: #252526;
    border: 1px solid #444;
    border-radius: 8px;
    min-width: 400px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #444;
  }

  .dialog-header h2 {
    margin: 0;
    color: #ccc;
    font-size: 1.2rem;
  }

  .close-button {
    background: none;
    border: none;
    color: #ccc;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    color: #fff;
  }

  .dialog-body {
    padding: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ccc;
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px solid #555;
    color: #ccc;
    border-radius: 4px;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: 1px solid #007acc;
  }

  .form-group input:disabled,
  .form-group select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .instruction-text {
    color: #888;
    font-style: italic;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px solid #555;
    border-radius: 4px;
  }

  .selected-object {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px solid #555;
    border-radius: 4px;
  }

  .object-name {
    color: #ccc;
    font-weight: 500;
  }

  .select-button {
    padding: 0.25rem 0.5rem;
    background: #007acc;
    border: 1px solid #005a9e;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .select-button:hover:not(:disabled) {
    background: #005a9e;
  }

  .select-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #444;
  }

  .cancel-button {
    padding: 0.5rem 1rem;
    background: #555;
    border: 1px solid #666;
    color: #ccc;
    border-radius: 4px;
    cursor: pointer;
  }

  .cancel-button:hover {
    background: #666;
  }

  .create-button {
    padding: 0.5rem 1rem;
    background: #007acc;
    border: 1px solid #005a9e;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  .create-button:hover:not(:disabled) {
    background: #005a9e;
  }

  .create-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .vector3-inputs {
    display: flex;
    gap: 0.5rem;
  }

  .vector3-component {
    flex: 1;
  }

  .vector3-component label {
    display: block;
    margin-bottom: 0.25rem;
    color: #ccc;
    font-size: 0.8rem;
  }

  .vector3-component input {
    width: 100%;
    padding: 0.5rem;
    background: #2d2d2d;
    border: 1px solid #555;
    color: #ccc;
    border-radius: 4px;
  }
</style> 