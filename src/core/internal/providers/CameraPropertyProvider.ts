import * as THREE from 'three';
import type { PropertyProvider, CameraProperties } from '../../interfaces/PropertyProvider';
import { BasePropertyProvider } from './BasePropertyProvider';

export class CameraPropertyProvider extends BasePropertyProvider<CameraProperties> implements PropertyProvider<CameraProperties> {
  protected readonly type = 'camera' as const;
  protected readonly object: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    super();
    this.object = camera;
  }

  getProperties(): CameraProperties {
    return this.cloneProperties({
      type: 'camera',
      position: this.object.position,
      rotation: this.object.rotation,
      scale: this.object.scale,
      fov: this.object.fov,
      near: this.object.near,
      far: this.object.far
    });
  }

  cloneProperties(props: CameraProperties): CameraProperties {
    return {
      ...this.cloneTransformBase(props),
      type: this.type,
      fov: props.fov,
      near: props.near,
      far: props.far
    };
  }

  applyProperties(props: CameraProperties): void {
    this.object.position.copy(props.position);
    this.object.rotation.copy(props.rotation);
    this.object.scale.copy(props.scale);
    this.object.fov = props.fov;
    this.object.near = props.near;
    this.object.far = props.far;
    this.object.updateProjectionMatrix();
  }
} 