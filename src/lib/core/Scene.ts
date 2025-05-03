import * as THREE from 'three';
import { CommandHistory, type Command } from './Command';

export interface CommandExecutor {
    execute(command: Command): void;
    undo(): void;
    redo(): void;
}

export interface SceneChanger {
    addObject3D(object: THREE.Object3D): void;
    removeObject3D(object: THREE.Object3D): void;
    addDesignCamera(camera: THREE.PerspectiveCamera): string;
    removeDesignCamera(cameraId: string): void;
    addPlaybackCamera(camera: THREE.PerspectiveCamera): string;
    removePlaybackCamera(cameraId: string): void;
}

export enum CameraType {
    Design,
    Playback,
    // Future camera types can be added here
}

export interface CameraView {
    getCamera(): THREE.PerspectiveCamera;
    getCameraType(): CameraType;
}

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

export interface SceneViewer {
    getCameraViews(): readonly CameraView[];
}

export class Scene implements CommandExecutor, SceneChanger, SceneViewer {
    private threeScene: THREE.Scene;
    private commandHistory: CommandHistory;
    private designCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private playbackCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private nextCameraId: number = 0;
    private cameraViews: CameraView[] = [];

    constructor() {
        this.threeScene = new THREE.Scene();
        this.commandHistory = new CommandHistory();
    }

    public execute(command: Command): void {
        command.execute(this);
        this.commandHistory.push(command);
    }

    public undo(): void {
        const command = this.commandHistory.undo();
        if (command) {
            command.undo(this);
        }
    }

    public redo(): void {
        const command = this.commandHistory.redo();
        if (command) {
            command.execute(this);
        }
    }

    public addObject3D(object: THREE.Object3D): void {
        this.threeScene.add(object);
    }

    public removeObject3D(object: THREE.Object3D): void {
        this.threeScene.remove(object);
    }

    public getCameraViews(): readonly CameraView[] {
        return this.cameraViews;
    }

    public addDesignCamera(camera: THREE.PerspectiveCamera): string {
        const cameraId = `design_camera_${this.nextCameraId++}`;
        this.designCameras.set(cameraId, camera);
        this.threeScene.add(camera);

        const cameraView = new SingleCameraView(camera, CameraType.Design);
        this.cameraViews.push(cameraView);

        return cameraId;
    }

    public removeDesignCamera(cameraId: string): void {
        const camera = this.designCameras.get(cameraId);
        if (camera) {
            this.threeScene.remove(camera);
            this.designCameras.delete(cameraId);

            this.cameraViews = this.cameraViews.filter(
                (view) => view.getCamera() !== camera
            );
        }
    }

    public addPlaybackCamera(camera: THREE.PerspectiveCamera): string {
        const cameraId = `playback_camera_${this.nextCameraId++}`;
        this.playbackCameras.set(cameraId, camera);
        this.threeScene.add(camera);

        const cameraView = new SingleCameraView(camera, CameraType.Playback);
        this.cameraViews.push(cameraView);

        return cameraId;
    }

    public removePlaybackCamera(cameraId: string): void {
        const camera = this.playbackCameras.get(cameraId);
        if (camera) {
            this.threeScene.remove(camera);
            this.playbackCameras.delete(cameraId);

            this.cameraViews = this.cameraViews.filter(
                (view) => view.getCamera() !== camera
            );
        }
    }
}