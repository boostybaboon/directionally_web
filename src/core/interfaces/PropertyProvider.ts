import * as THREE from 'three';

export interface TransformProperties {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface MeshProperties extends TransformProperties {
  material: {
    color: THREE.Color;
    opacity: number;
    transparent: boolean;
  };
}

export interface LightProperties extends TransformProperties {
  color: THREE.Color;
  intensity: number;
}

export interface CameraProperties extends TransformProperties {
  fov: number;
  near: number;
  far: number;
}

export type ObjectProperties = MeshProperties | LightProperties | CameraProperties;

export interface PropertyProvider<T extends ObjectProperties = ObjectProperties> {
  getProperties(): T;
  applyProperties(properties: T): void;
} 