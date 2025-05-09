import { Scene } from './Scene';
import { AddDesignCamera } from './commands/AddDesignCamera';
import * as THREE from 'three';
import type { DocumentInterfaces } from './interfaces/DocumentInterfaces';

export class DocumentManager {
  private static instance: DocumentManager;
  
  private constructor() {}
  
  public static getInstance(): DocumentManager {
    if (!DocumentManager.instance) {
      DocumentManager.instance = new DocumentManager();
    }
    return DocumentManager.instance;
  }
  
  public createDefaultDocument(): DocumentInterfaces {
    const scene = new Scene();
    this.createDefaultCameraViews(scene);
    
    return {
      commandExecutor: scene,
      sceneChanger: scene,
      sceneViewer: scene
    };
  }
  
  private createDefaultCameraViews(scene: Scene): void {
    // Create and add default design camera using command
    const cameraCommand = new AddDesignCamera(
      75, // FOV
      0.1, // Near
      1000, // Far
      new THREE.Vector3(0, 5, 10), // Position
      new THREE.Vector3(0, 0, 0)  // Look at
    );
    
    // Execute the command to add the camera
    scene.execute(cameraCommand);
  }
} 