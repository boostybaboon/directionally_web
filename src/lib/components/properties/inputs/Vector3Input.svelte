<script lang="ts">
  import type { InputComponent, PropertyDescriptor } from '../types';
  import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
  import * as THREE from 'three';
  
  export let prop: PropertyDescriptor;
  export let props: ObjectProperties;
  export let inputId: string;
  export let onChange: (value: THREE.Vector3) => void;
  
  $: value = prop.getValue(props);
</script>

<div class="vector3-inputs">
  {#each ['x', 'y', 'z'] as axis}
    <div class="input-group">
      <span class="axis-label">{axis.toUpperCase()}</span>
      <input 
        type="number"
        value={value[axis]}
        on:change={(e) => {
          const newValue = value.clone();
          newValue[axis] = parseFloat(e.currentTarget.value);
          onChange(newValue);
        }}
      />
    </div>
  {/each}
</div>

<style>
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

  input:focus {
    outline: none;
    border-color: #666;
  }
</style> 