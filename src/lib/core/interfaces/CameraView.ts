import * as THREE from 'three';
import type { CameraType } from '../types/CameraType';

export interface CameraView {
    getCamera(): THREE.PerspectiveCamera;
    getCameraType(): CameraType;
} 