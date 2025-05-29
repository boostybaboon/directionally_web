import * as THREE from 'three';
import type { PropertyProvider, LightProperties } from '../../interfaces/PropertyProvider';

export class LightPropertyProvider implements PropertyProvider {
  constructor(private light: THREE.Light) {}

  getProperties(): LightProperties {
    return {
      position: this.light.position.clone(),
      rotation: this.light.rotation.clone(),
      scale: this.light.scale.clone(),
      color: this.light.color.clone(),
      intensity: this.light.intensity
    };
  }

  applyProperties(props: LightProperties): void {
    if (!this.isLightProperties(props)) return;

    this.light.position.copy(props.position);
    this.light.rotation.copy(props.rotation);
    this.light.scale.copy(props.scale);
    this.light.color.copy(props.color);
    this.light.intensity = props.intensity;
  }

  private isLightProperties(props: any): props is LightProperties {
    return 'color' in props && 'intensity' in props;
  }
} 