import * as THREE from 'three';

export interface ObjectProperties {
  type: 'transform' | 'mesh' | 'light' | 'camera';
}

export interface TransformBase {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface TransformProperties extends ObjectProperties, TransformBase {
  type: 'transform';
}

export interface MeshProperties extends ObjectProperties, TransformBase {
  type: 'mesh';
  material: THREE.MeshBasicMaterial;
}

export interface LightProperties extends ObjectProperties, TransformBase {
  type: 'light';
  color: THREE.Color;
  intensity: number;
}

export interface CameraProperties extends ObjectProperties, TransformBase {
  type: 'camera';
  fov: number;
  near: number;
  far: number;
}

export interface PropertyProvider<T extends ObjectProperties = ObjectProperties> {
  getProperties(): T;
  applyProperties(properties: T): void;
} 