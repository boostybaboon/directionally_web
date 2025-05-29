<script lang="ts">
  import { getContext } from 'svelte';
  import type { PropertyDescriptor } from './types';
  import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
  import type { ProductionContext } from '$lib/types/ProductionContext';
  import type { SelectedObject } from '$core/interfaces/SceneSelector';
  import { getInputComponent } from './inputs';
  
  export let prop: PropertyDescriptor<any>;
  export let props: ObjectProperties;
  export let selectedObject: SelectedObject;
  
  const productionContext = getContext<ProductionContext>('production');
  const InputComponent = getInputComponent(prop.type);
  const inputId = `prop-${prop.label.toLowerCase().replace(/\s+/g, '-')}`;

  function handleChange(value: any) {
    // Get the current production
    const production = productionContext.currentProduction;
    if (!production) return;

    // Create a copy of the current properties
    const newProps = { ...props };
    
    // Update the property value
    prop.setValue(newProps, value);
    
    // Execute the command to update the object's properties
    production.sceneChanger.updateObjectProperties(selectedObject.object, newProps);
  }
</script>

<div class="property">
  <label for={inputId}>{prop.label}</label>
  <svelte:component this={InputComponent} {prop} {props} {inputId} onChange={handleChange} />
</div>

<style>
  .property {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 0.25rem;
  }
</style> 