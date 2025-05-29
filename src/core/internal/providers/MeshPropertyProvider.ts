import * as THREE from 'three';
import type { PropertyProvider, MeshProperties } from '../../interfaces/PropertyProvider';

export class MeshPropertyProvider implements PropertyProvider {
  constructor(private mesh: THREE.Mesh) {}

  getProperties(): MeshProperties {
    const material = this.mesh.material as THREE.MeshBasicMaterial;
    return {
      position: this.mesh.position.clone(),
      rotation: this.mesh.rotation.clone(),
      scale: this.mesh.scale.clone(),
      material: {
        color: material.color.clone(),
        opacity: material.opacity,
        transparent: material.transparent
      }
    };
  }

  applyProperties(props: MeshProperties): void {
    if (!this.isMeshProperties(props)) return;

    this.mesh.position.copy(props.position);
    this.mesh.rotation.copy(props.rotation);
    this.mesh.scale.copy(props.scale);

    const material = this.mesh.material as THREE.MeshBasicMaterial;
    material.color.copy(props.material.color);
    material.opacity = props.material.opacity;
    material.transparent = props.material.transparent;
  }

  private isMeshProperties(props: any): props is MeshProperties {
    return 'material' in props;
  }
} 