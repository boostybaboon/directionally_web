import * as THREE from 'three';
import type { CameraView } from '../interfaces/CameraView';
import type { CameraType } from '../types/CameraType';

export class SingleCameraView implements CameraView {
    private camera: THREE.PerspectiveCamera;
    private cameraType: CameraType;

    constructor(camera: THREE.PerspectiveCamera, cameraType: CameraType) {
        this.camera = camera;
        this.cameraType = cameraType;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }
    
    public getCameraType(): CameraType {
        return this.cameraType;
    }
} 