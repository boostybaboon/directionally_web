import * as THREE from 'three';
import type { PropertyProvider, LightProperties } from '../../interfaces/PropertyProvider';
import { BasePropertyProvider } from './BasePropertyProvider';

export class LightPropertyProvider extends BasePropertyProvider<LightProperties> implements PropertyProvider<LightProperties> {
  protected readonly type = 'light' as const;
  protected readonly object: THREE.Light;

  constructor(light: THREE.Light) {
    super();
    this.object = light;
  }

  getProperties(): LightProperties {
    return this.cloneProperties({
      type: 'light',
      position: this.object.position,
      rotation: this.object.rotation,
      scale: this.object.scale,
      color: this.object.color,
      intensity: this.object.intensity
    });
  }

  cloneProperties(props: LightProperties): LightProperties {
    return {
      ...this.cloneTransformBase(props),
      type: this.type,
      color: props.color.clone(),
      intensity: props.intensity
    };
  }

  applyProperties(props: LightProperties): void {
    this.object.position.copy(props.position);
    this.object.rotation.copy(props.rotation);
    this.object.scale.copy(props.scale);
    this.object.color.copy(props.color);
    this.object.intensity = props.intensity;
  }
} 