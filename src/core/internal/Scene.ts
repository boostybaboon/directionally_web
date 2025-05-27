import * as THREE from 'three';
import { CommandHistory } from './Command';
import type { Command } from './Command';
import type { CommandExecutor } from '../interfaces/CommandExecutor';
import type { SceneChanger } from '../interfaces/SceneChanger';
import type { SceneViewer } from '../interfaces/SceneViewer';
import type { CameraView } from '../interfaces/CameraView';
import type { SceneChangeObserver } from '../interfaces/SceneChangeObserver';
import { CameraType } from '../types/CameraType';
import { SingleCameraView } from './views/SingleCameraView';

export class Scene implements CommandExecutor, SceneChanger, SceneViewer {
    private threeScene: THREE.Scene;
    private commandHistory: CommandHistory;
    private designCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private playbackCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private nextCameraId: number = 0;
    private cameraViews: CameraView[] = [];
    private sceneChangeObservers: SceneChangeObserver[] = [];

    constructor() {
        this.threeScene = new THREE.Scene();
        this.commandHistory = new CommandHistory();
    }

    public getScene(): THREE.Scene {
        return this.threeScene;
    }

    public addSceneChangeObserver(observer: SceneChangeObserver): () => void {
        this.sceneChangeObservers.push(observer);
        return () => {
            const index = this.sceneChangeObservers.indexOf(observer);
            if (index !== -1) {
                this.sceneChangeObservers.splice(index, 1);
            }
        };
    }

    private notifySceneChangeObservers(): void {
        this.sceneChangeObservers.forEach(observer => observer.onSceneChanged());
    }

    public execute(command: Command): void {
        command.execute(this);
        this.commandHistory.push(command);
        this.notifySceneChangeObservers();
    }

    public undo(): void {
        const command = this.commandHistory.undo();
        if (command) {
            command.undo(this);
            this.notifySceneChangeObservers();
        }
    }

    public redo(): void {
        const command = this.commandHistory.redo();
        if (command) {
            command.execute(this);
            this.notifySceneChangeObservers();
        }
    }

    public addObject3D(object: THREE.Object3D): void {
        this.threeScene.add(object);
        this.notifySceneChangeObservers();
    }

    public removeObject3D(object: THREE.Object3D): void {
        this.threeScene.remove(object);
        this.notifySceneChangeObservers();
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
        this.notifySceneChangeObservers();

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
            this.notifySceneChangeObservers();
        }
    }

    public addPlaybackCamera(camera: THREE.PerspectiveCamera): string {
        const cameraId = `playback_camera_${this.nextCameraId++}`;
        this.playbackCameras.set(cameraId, camera);
        this.threeScene.add(camera);

        const cameraView = new SingleCameraView(camera, CameraType.Playback);
        this.cameraViews.push(cameraView);
        this.notifySceneChangeObservers();

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
            this.notifySceneChangeObservers();
        }
    }
}