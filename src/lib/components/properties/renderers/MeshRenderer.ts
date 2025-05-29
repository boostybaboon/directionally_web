import type { PropertyRenderer, PropertyGroup } from '../types';
import type { MeshProperties } from '$core/interfaces/PropertyProvider';
import { TransformRenderer } from './TransformRenderer';

export class MeshRenderer implements PropertyRenderer<MeshProperties> {
  render(props: MeshProperties): PropertyGroup<MeshProperties>[] {
    const transformGroups = new TransformRenderer().render(props as any) as unknown as PropertyGroup<MeshProperties>[];
    const meshGroup: PropertyGroup<MeshProperties> = {
      label: 'Material',
      properties: [
        {
          type: 'color',
          label: 'Color',
          getValue: (props) => props.material.color,
          setValue: (props, value) => props.material.color.copy(value)
        },
        {
          type: 'number',
          label: 'Opacity',
          min: 0,
          max: 1,
          step: 0.1,
          getValue: (props) => props.material.opacity,
          setValue: (props, value) => {
            props.material.opacity = value;
            props.material.transparent = value < 1;
          }
        }
      ]
    };
    return [...transformGroups, meshGroup];
  }
} 