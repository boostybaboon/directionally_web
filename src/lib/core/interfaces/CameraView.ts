import * as THREE from 'three';
import { CameraType } from '../types/CameraType';

export interface CameraView {
    getCamera(): THREE.PerspectiveCamera;
    getCameraType(): CameraType;
}