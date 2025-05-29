import type { PropertyType } from '../types';
import NumberInput from './NumberInput.svelte';
import ColorInput from './ColorInput.svelte';
import Vector3Input from './Vector3Input.svelte';

type ImplementedPropertyType = 'number' | 'color' | 'vector3';

// Map property types to their input components
const inputComponents: Record<ImplementedPropertyType, any> = {
  number: NumberInput,
  color: ColorInput,
  vector3: Vector3Input
};

// Get the appropriate input component for a property type
export function getInputComponent(type: PropertyType) {
  return inputComponents[type as ImplementedPropertyType];
} 