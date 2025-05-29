import * as THREE from 'three';
import type { PropertyProvider, MeshProperties } from '../../interfaces/PropertyProvider';

export class MeshPropertyProvider implements PropertyProvider<MeshProperties> {
  constructor(private mesh: THREE.Mesh) {}

  getProperties(): MeshProperties {
    const material = this.mesh.material as THREE.MeshBasicMaterial;
    return {
      type: 'mesh',
      position: this.mesh.position.clone(),
      rotation: this.mesh.rotation.clone(),
      scale: this.mesh.scale.clone(),
      material: material.clone()
    };
  }

  applyProperties(props: MeshProperties): void {
    this.mesh.position.copy(props.position);
    this.mesh.rotation.copy(props.rotation);
    this.mesh.scale.copy(props.scale);

    const material = this.mesh.material as THREE.MeshBasicMaterial;
    material.color.copy(props.material.color);
    material.opacity = props.material.opacity;
    material.transparent = props.material.transparent;
  }
} 