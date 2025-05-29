<script lang="ts">
  import type { InputComponent, PropertyDescriptor } from '../types';
  import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
  import * as THREE from 'three';
  
  export let prop: PropertyDescriptor;
  export let props: ObjectProperties;
  export let inputId: string;
  export let onChange: (value: THREE.Color) => void;
  
  $: value = prop.getValue(props);
  
  function formatColor(color: THREE.Color): string {
    return `#${color.getHexString()}`;
  }
</script>

<input 
  id={inputId}
  type="color"
  value={`#${value.getHexString()}`}
  on:change={(e) => onChange(new THREE.Color(e.currentTarget.value))}
/> 