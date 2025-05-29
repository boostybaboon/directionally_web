import * as THREE from 'three';
import type { Command } from '../Command';
import type { Scene } from '../Scene';
import type { ObjectProperties } from '../../interfaces/PropertyProvider';
import { PropertyProviderFactory } from '../providers/PropertyProviderFactory';

export class ApplyPropertiesCommand implements Command {
  constructor(
    private object: THREE.Object3D,
    private newProperties: ObjectProperties,
    private oldProperties: ObjectProperties
  ) {}

  execute(scene: Scene): void {
    const provider = PropertyProviderFactory.createProvider(this.object);
    if (provider) {
      provider.applyProperties(this.newProperties);
    }
  }

  undo(scene: Scene): void {
    const provider = PropertyProviderFactory.createProvider(this.object);
    if (provider) {
      provider.applyProperties(this.oldProperties);
    }
  }
} 