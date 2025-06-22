import * as THREE from 'three';
import { CommandHistory } from './Command';
import type { Command } from './Command';
import type { CommandExecutor } from '../interfaces/CommandExecutor';
import type { SceneChanger } from '../interfaces/SceneChanger';
import type { SceneViewer } from '../interfaces/SceneViewer';
import type { SceneSelector, SelectionListener, SelectedObject } from '../interfaces/SceneSelector';
import type { CameraView } from '../interfaces/CameraView';
import type { SceneChangeObserver } from '../interfaces/SceneChangeObserver';
import { CameraType } from '../types/CameraType';
import { SingleCameraView } from './views/SingleCameraView';
import { PropertyProviderFactory } from './providers/PropertyProviderFactory';
import { ApplyPropertiesCommand } from './commands/ApplyPropertiesCommand';
import type { ObjectProperties } from '../interfaces/PropertyProvider';

//SceneSelector could be a separate object potentially, if that was an advantage
export class Scene implements CommandExecutor, SceneChanger, SceneViewer, SceneSelector {
    private threeScene: THREE.Scene;
    private commandHistory: CommandHistory;
    private designCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private playbackCameras: Map<string, THREE.PerspectiveCamera> = new Map();
    private nextCameraId: number = 0;
    private cameraViews: CameraView[] = [];
    private sceneChangeObservers: SceneChangeObserver[] = [];
    private selectedObjects: SelectedObject[] = [];
    private selectionListeners: SelectionListener[] = [];
    private mixers: THREE.AnimationMixer[] = [];
    private animationDict: { [key: string]: THREE.AnimationAction } = {};
    private clock: THREE.Clock = new THREE.Clock();

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

    public updateObjectProperties(object: THREE.Object3D, properties: ObjectProperties): void {
        const command = new ApplyPropertiesCommand(object, properties, this.getCurrentProperties(object));
        this.execute(command);
    }

    private getCurrentProperties(object: THREE.Object3D): ObjectProperties {
        const provider = PropertyProviderFactory.createProvider(object);
        if (provider) {
            return provider.getProperties();
        }
        // Return default transform properties if no provider exists
        return {
            type: 'transform',
            position: object.position.clone(),
            rotation: object.rotation.clone(),
            scale: object.scale.clone()
        } as import('../interfaces/PropertyProvider').TransformProperties;
    }

    // SceneSelector implementation
    public getSelectedObjects(): SelectedObject[] {
        return [...this.selectedObjects];
    }

    public setSelectedObjects(objects: THREE.Object3D[]): void {
        this.selectedObjects = objects
            .map(obj => {
                const provider = PropertyProviderFactory.createProvider(obj);
                return provider ? { object: obj, propertyProvider: provider } : null;
            })
            .filter((selected): selected is SelectedObject => selected !== null);
        
        this.notifySelectionListeners();
    }

    public addSelectionListener(listener: SelectionListener): () => void {
        this.selectionListeners.push(listener);
        return () => {
            const index = this.selectionListeners.indexOf(listener);
            if (index !== -1) {
                this.selectionListeners.splice(index, 1);
            }
        };
    }

    private notifySelectionListeners(): void {
        this.selectionListeners.forEach(listener => 
            listener.onSelectionChanged(this.getSelectedObjects())
        );
    }

    public update(): void {
        const delta = this.clock.getDelta();
        this.mixers.forEach(mixer => mixer.update(delta));
    }

    public addAnimationMixer(mixer: THREE.AnimationMixer): void {
        this.mixers.push(mixer);
    }

    public removeAnimationMixer(mixer: THREE.AnimationMixer): void {
        const index = this.mixers.indexOf(mixer);
        if (index !== -1) {
            this.mixers.splice(index, 1);
        }
    }

    public addAnimationAction(id: string, action: THREE.AnimationAction): void {
        this.animationDict[id] = action;
    }

    public removeAnimationAction(id: string): void {
        delete this.animationDict[id];
    }

    public getAnimationAction(id: string): THREE.AnimationAction | undefined {
        return this.animationDict[id];
    }

    public getAnimationActions(): { [key: string]: THREE.AnimationAction } {
        return { ...this.animationDict };
    }
}