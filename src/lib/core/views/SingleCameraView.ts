import * as THREE from 'three';
import { CameraType } from '../types/CameraType';
import type { CameraView } from '../interfaces/CameraView';

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

    public updateAspectRatio(aspect: number): void {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }
}