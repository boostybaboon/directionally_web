import * as THREE from 'three';
import type { ObjectProperties } from './PropertyProvider';

export interface SceneChanger {
    addObject3D(object: THREE.Object3D): void;
    removeObject3D(object: THREE.Object3D): void;
    addDesignCamera(camera: THREE.PerspectiveCamera): string;
    removeDesignCamera(cameraId: string): void;
    addPlaybackCamera(camera: THREE.PerspectiveCamera): string;
    removePlaybackCamera(cameraId: string): void;
    updateObjectProperties(object: THREE.Object3D, properties: ObjectProperties): void;
} 