import type { ObjectProperties } from '$core/interfaces/PropertyProvider';
import * as THREE from 'three';

export type PropertyType = 'number' | 'color' | 'vector3' | 'euler' | 'boolean';

export interface PropertyDescriptor<T extends ObjectProperties = ObjectProperties> {
  type: PropertyType;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  getValue: (props: T) => any;
  setValue: (props: T, value: any) => void;
}

export interface PropertyGroup<T extends ObjectProperties = ObjectProperties> {
  label: string;
  properties: PropertyDescriptor<T>[];
}

export interface InputComponent<T = any> {
  prop: PropertyDescriptor;
  props: ObjectProperties;
  value: T;
  onChange: (value: T) => void;
}

export interface PropertyRenderer<T extends ObjectProperties> {
  render(props: T): PropertyGroup<T>[];
} 