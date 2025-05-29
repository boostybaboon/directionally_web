import * as THREE from 'three';
import type { PropertyProvider, MeshProperties } from '../../interfaces/PropertyProvider';
import { BasePropertyProvider } from './BasePropertyProvider';

export class MeshPropertyProvider extends BasePropertyProvider<MeshProperties> implements PropertyProvider<MeshProperties> {
  protected readonly type = 'mesh' as const;
  protected readonly object: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    super();
    this.object = mesh;
  }

  getProperties(): MeshProperties {
    const material = this.object.material as THREE.MeshBasicMaterial;
    return this.cloneProperties({
      type: this.type,
      position: this.object.position,
      rotation: this.object.rotation,
      scale: this.object.scale,
      material
    });
  }

  cloneProperties(props: MeshProperties): MeshProperties {
    const material = props.material.clone();
    material.color = props.material.color.clone();
    material.opacity = props.material.opacity;
    material.transparent = props.material.transparent;
    material.needsUpdate = true;

    return {
      ...this.cloneTransformBase(props),
      type: this.type,
      material
    };
  }

  applyProperties(props: MeshProperties): void {
    this.object.position.copy(props.position);
    this.object.rotation.copy(props.rotation);
    this.object.scale.copy(props.scale);

    const material = this.object.material as THREE.MeshBasicMaterial;
    if (material) {
      material.color = new THREE.Color(props.material.color.getHex());
      material.opacity = props.material.opacity;
      material.transparent = props.material.transparent;
      material.needsUpdate = true;
    }
  }
} 