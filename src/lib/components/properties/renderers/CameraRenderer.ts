import type { PropertyRenderer, PropertyGroup } from '../types';
import type { CameraProperties } from '$core/interfaces/PropertyProvider';
import { TransformRenderer } from './TransformRenderer';

export class CameraRenderer implements PropertyRenderer<CameraProperties> {
  render(props: CameraProperties): PropertyGroup<CameraProperties>[] {
    const transformGroups = new TransformRenderer().render(props as any) as unknown as PropertyGroup<CameraProperties>[];
    const cameraGroup: PropertyGroup<CameraProperties> = {
      label: 'Camera',
      properties: [
        {
          type: 'number',
          label: 'FOV',
          min: 1,
          max: 180,
          step: 1,
          getValue: (props) => props.fov,
          setValue: (props, value) => props.fov = value
        },
        {
          type: 'number',
          label: 'Near',
          min: 0.1,
          max: 1000,
          step: 0.1,
          getValue: (props) => props.near,
          setValue: (props, value) => props.near = value
        },
        {
          type: 'number',
          label: 'Far',
          min: 0.1,
          max: 10000,
          step: 0.1,
          getValue: (props) => props.far,
          setValue: (props, value) => props.far = value
        }
      ]
    };
    return [...transformGroups, cameraGroup];
  }
} 