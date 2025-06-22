import type { CameraView } from './CameraView';
import type { SceneChangeObserver } from './SceneChangeObserver';
import * as THREE from 'three';

export interface SceneViewer {
    getCameraViews(): readonly CameraView[];
    getScene(): THREE.Scene;
    addSceneChangeObserver(observer: SceneChangeObserver): () => void;
    update(): void;
}