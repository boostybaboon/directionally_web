import * as THREE from 'three';
import type { PropertyProvider } from '../../interfaces/PropertyProvider';
import { MeshPropertyProvider } from './MeshPropertyProvider';
import { LightPropertyProvider } from './LightPropertyProvider';
import { CameraPropertyProvider } from './CameraPropertyProvider';

export class PropertyProviderFactory {
  static createProvider(object: THREE.Object3D): PropertyProvider | null {
    if (object instanceof THREE.Mesh) {
      return new MeshPropertyProvider(object);
    }
    if (object instanceof THREE.Light) {
      return new LightPropertyProvider(object);
    }
    if (object instanceof THREE.PerspectiveCamera) {
      return new CameraPropertyProvider(object);
    }
    return null;
  }
} 