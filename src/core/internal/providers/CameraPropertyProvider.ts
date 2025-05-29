import * as THREE from 'three';
import type { PropertyProvider, CameraProperties } from '../../interfaces/PropertyProvider';

export class CameraPropertyProvider implements PropertyProvider {
  constructor(private camera: THREE.PerspectiveCamera) {}

  getProperties(): CameraProperties {
    return {
      position: this.camera.position.clone(),
      rotation: this.camera.rotation.clone(),
      scale: this.camera.scale.clone(),
      fov: this.camera.fov,
      near: this.camera.near,
      far: this.camera.far
    };
  }

  applyProperties(props: CameraProperties): void {
    if (!this.isCameraProperties(props)) return;

    this.camera.position.copy(props.position);
    this.camera.rotation.copy(props.rotation);
    this.camera.scale.copy(props.scale);
    this.camera.fov = props.fov;
    this.camera.near = props.near;
    this.camera.far = props.far;
    this.camera.updateProjectionMatrix();
  }

  private isCameraProperties(props: any): props is CameraProperties {
    return 'fov' in props && 'near' in props && 'far' in props;
  }
} 