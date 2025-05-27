import type { CameraView } from './CameraView';
import * as THREE from 'three';

export interface SceneViewer {
    getCameraViews(): readonly CameraView[];
    getScene(): THREE.Scene;
}