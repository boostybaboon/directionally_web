import type { PropertyRenderer, PropertyGroup } from '../types';
import type { LightProperties } from '$core/interfaces/PropertyProvider';
import { TransformRenderer } from './TransformRenderer';

export class LightRenderer implements PropertyRenderer<LightProperties> {
  render(props: LightProperties): PropertyGroup<LightProperties>[] {
    const transformGroups = new TransformRenderer().render(props as any) as unknown as PropertyGroup<LightProperties>[];
    const lightGroup: PropertyGroup<LightProperties> = {
      label: 'Light',
      properties: [
        {
          type: 'color',
          label: 'Color',
          getValue: (props) => props.color,
          setValue: (props, value) => props.color.copy(value)
        },
        {
          type: 'number',
          label: 'Intensity',
          min: 0,
          max: 10,
          step: 0.1,
          getValue: (props) => props.intensity,
          setValue: (props, value) => props.intensity = value
        }
      ]
    };
    return [...transformGroups, lightGroup];
  }
} 