import type { CameraView } from './CameraView';

export interface SceneViewer {
    getCameraViews(): readonly CameraView[];
} 