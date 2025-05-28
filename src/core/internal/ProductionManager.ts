import { Scene } from './Scene';
import { AddDesignCamera } from './commands/AddDesignCamera';
import * as THREE from 'three';
import type { Production } from '../interfaces/Production';

export class ProductionManager {
  private static instance: ProductionManager;
  
  private constructor() {}
  
  public static getInstance(): ProductionManager {
    if (!ProductionManager.instance) {
      ProductionManager.instance = new ProductionManager();
    }
    return ProductionManager.instance;
  }
  
  public createProduction(): Production {
    const scene = new Scene();
    this.createDefaultCameraViews(scene);
    
    return {
      commandExecutor: scene,
      sceneChanger: scene,
      sceneViewer: scene,
      sceneSelector: scene
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