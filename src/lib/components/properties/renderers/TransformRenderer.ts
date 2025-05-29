import type { PropertyRenderer, PropertyGroup, PropertyDescriptor } from '../types';
import type { TransformProperties } from '$core/interfaces/PropertyProvider';
import * as THREE from 'three';

export class TransformRenderer implements PropertyRenderer<TransformProperties> {
  render(props: TransformProperties): PropertyGroup<TransformProperties>[] {
    return [{
      label: 'Transform',
      properties: [
        {
          type: 'vector3',
          label: 'Position',
          getValue: (props: TransformProperties) => props.position,
          setValue: (props: TransformProperties, value: THREE.Vector3) => props.position.copy(value)
        },
        {
          type: 'euler',
          label: 'Rotation',
          getValue: (props: TransformProperties) => props.rotation,
          setValue: (props: TransformProperties, value: THREE.Euler) => props.rotation.copy(value)
        },
        {
          type: 'vector3',
          label: 'Scale',
          getValue: (props: TransformProperties) => props.scale,
          setValue: (props: TransformProperties, value: THREE.Vector3) => props.scale.copy(value)
        }
      ]
    }];
  }
} 