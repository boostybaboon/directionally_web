<script lang="ts">
  import type { InputComponent, PropertyDescriptor } from '../types';
  import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
  
  export let prop: PropertyDescriptor;
  export let props: ObjectProperties;
  export let inputId: string;
  export let onChange: (value: number) => void;
  
  $: ({ min, max, step } = prop);
  $: value = prop.getValue(props);
</script>

<input 
  id={inputId}
  type="number"
  {min}
  {max}
  {step}
  {value}
  on:change={(e) => onChange(parseFloat(e.currentTarget.value))}
/> 