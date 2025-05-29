<script lang="ts">
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  import type { SelectionListener, SelectedObject } from '$core/interfaces/SceneSelector';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { Production } from '$core/interfaces/Production';
  import type { ObjectProperties, MeshProperties, LightProperties, CameraProperties } from '$core/interfaces/PropertyProvider';
  import { MeshPropertyProvider } from '$core/internal/providers/MeshPropertyProvider';
  import { LightPropertyProvider } from '$core/internal/providers/LightPropertyProvider';
  import { CameraPropertyProvider } from '$core/internal/providers/CameraPropertyProvider';
  import * as THREE from 'three';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');

  // Selection state
  let selectedObjects: SelectedObject[] = [];
  let editingProperties: ObjectProperties | null = null;

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

  // Format number for display
  function formatNumber(value: number): string {
    return value.toFixed(2);
  }

  // Format color for display
  function formatColor(color: THREE.Color): string {
    return `#${color.getHexString()}`;
  }

  // Handle property changes
  function handlePropertyChange() {
    if (!selectedObjects.length || !editingProperties || !productionContext.currentProduction) return;

    const selected = selectedObjects[0];
    productionContext.currentProduction.sceneChanger.updateObjectProperties(
      selected.object,
      editingProperties
    );
  }

  // Handle vector3 changes
  function handleVector3Change(
    vector: THREE.Vector3,
    axis: 'x' | 'y' | 'z',
    value: string
  ) {
    if (!editingProperties) return;
    vector[axis] = parseFloat(value) || 0;
    handlePropertyChange();
  }

  // Handle euler changes
  function handleEulerChange(
    euler: THREE.Euler,
    axis: 'x' | 'y' | 'z',
    value: string
  ) {
    if (!editingProperties) return;
    euler[axis] = parseFloat(value) || 0;
    handlePropertyChange();
  }

  // Handle color change
  function handleColorChange(color: THREE.Color, value: string) {
    if (!editingProperties) return;
    color.set(value);
    handlePropertyChange();
  }

  // Handle number change
  function handleNumberChange(value: string, setter: (value: number) => void) {
    if (!editingProperties) return;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setter(numValue);
      handlePropertyChange();
    }
  }
</script>

<div class="properties-panel">
  {#if selectedObjects.length === 0}
    <div class="empty-state">No object selected</div>
  {:else if selectedObjects.length === 1 && editingProperties}
    {@const selected = selectedObjects[0]}
    {@const props = editingProperties}
    
    <div class="property-group">
      <h3>Transform</h3>
      <div class="property">
        <label for="pos-x">Position</label>
        <div class="vector3-inputs">
          <div class="input-group">
            <span class="axis-label">X</span>
            <input 
              id="pos-x" 
              type="number" 
              value={props.position.x} 
              on:change={(e) => handleVector3Change(props.position, 'x', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Y</span>
            <input 
              id="pos-y" 
              type="number" 
              value={props.position.y}
              on:change={(e) => handleVector3Change(props.position, 'y', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Z</span>
            <input 
              id="pos-z" 
              type="number" 
              value={props.position.z}
              on:change={(e) => handleVector3Change(props.position, 'z', e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
      <div class="property">
        <label for="rot-x">Rotation</label>
        <div class="vector3-inputs">
          <div class="input-group">
            <span class="axis-label">X</span>
            <input 
              id="rot-x" 
              type="number" 
              value={props.rotation.x}
              on:change={(e) => handleEulerChange(props.rotation, 'x', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Y</span>
            <input 
              id="rot-y" 
              type="number" 
              value={props.rotation.y}
              on:change={(e) => handleEulerChange(props.rotation, 'y', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Z</span>
            <input 
              id="rot-z" 
              type="number" 
              value={props.rotation.z}
              on:change={(e) => handleEulerChange(props.rotation, 'z', e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
      <div class="property">
        <label for="scale-x">Scale</label>
        <div class="vector3-inputs">
          <div class="input-group">
            <span class="axis-label">X</span>
            <input 
              id="scale-x" 
              type="number" 
              value={props.scale.x}
              on:change={(e) => handleVector3Change(props.scale, 'x', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Y</span>
            <input 
              id="scale-y" 
              type="number" 
              value={props.scale.y}
              on:change={(e) => handleVector3Change(props.scale, 'y', e.currentTarget.value)}
            />
          </div>
          <div class="input-group">
            <span class="axis-label">Z</span>
            <input 
              id="scale-z" 
              type="number" 
              value={props.scale.z}
              on:change={(e) => handleVector3Change(props.scale, 'z', e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
    </div>

    {#if selected.propertyProvider instanceof MeshPropertyProvider}
      {@const meshProps = props as MeshProperties}
      <div class="property-group">
        <h3>Material</h3>
        <div class="property">
          <label for="color">Color</label>
          <input 
            id="color" 
            type="color" 
            value={formatColor(meshProps.material.color)}
            on:change={(e) => handleColorChange(meshProps.material.color, e.currentTarget.value)}
          />
        </div>
        <div class="property">
          <label for="opacity">Opacity</label>
          <input 
            id="opacity" 
            type="number" 
            min="0" 
            max="1" 
            step="0.1" 
            value={meshProps.material.opacity}
            on:change={(e) => handleNumberChange(e.currentTarget.value, (v) => meshProps.material.opacity = v)}
          />
        </div>
      </div>
    {/if}

    {#if selected.propertyProvider instanceof LightPropertyProvider}
      {@const lightProps = props as LightProperties}
      <div class="property-group">
        <h3>Light</h3>
        <div class="property">
          <label for="light-color">Color</label>
          <input 
            id="light-color" 
            type="color" 
            value={formatColor(lightProps.color)}
            on:change={(e) => handleColorChange(lightProps.color, e.currentTarget.value)}
          />
        </div>
        <div class="property">
          <label for="intensity">Intensity</label>
          <input 
            id="intensity" 
            type="number" 
            min="0" 
            step="0.1" 
            value={lightProps.intensity}
            on:change={(e) => handleNumberChange(e.currentTarget.value, (v) => lightProps.intensity = v)}
          />
        </div>
      </div>
    {/if}

    {#if selected.propertyProvider instanceof CameraPropertyProvider}
      {@const cameraProps = props as CameraProperties}
      <div class="property-group">
        <h3>Camera</h3>
        <div class="property">
          <label for="fov">Field of View</label>
          <input 
            id="fov" 
            type="number" 
            min="1" 
            max="180" 
            value={cameraProps.fov}
            on:change={(e) => handleNumberChange(e.currentTarget.value, (v) => cameraProps.fov = v)}
          />
        </div>
        <div class="property">
          <label for="near">Near Plane</label>
          <input 
            id="near" 
            type="number" 
            min="0.1" 
            step="0.1" 
            value={cameraProps.near}
            on:change={(e) => handleNumberChange(e.currentTarget.value, (v) => cameraProps.near = v)}
          />
        </div>
        <div class="property">
          <label for="far">Far Plane</label>
          <input 
            id="far" 
            type="number" 
            min="1" 
            step="1" 
            value={cameraProps.far}
            on:change={(e) => handleNumberChange(e.currentTarget.value, (v) => cameraProps.far = v)}
          />
        </div>
      </div>
    {/if}
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

  input[type="color"] {
    width: 6rem;
    height: 1.5rem;
    padding: 0;
    border: none;
  }

  input:focus {
    outline: none;
    border-color: #666;
  }
</style> 