import * as THREE from 'three';
import type { Command } from '../Command';
import type { Scene } from '../Scene';
import type { ObjectProperties, PropertyProvider } from '../../interfaces/PropertyProvider';
import { PropertyProviderFactory } from '../providers/PropertyProviderFactory';

export class ApplyPropertiesCommand implements Command {
  private readonly newProperties: ObjectProperties;
  private readonly oldProperties: ObjectProperties;
  private readonly provider: PropertyProvider;

  constructor(
    private readonly object: THREE.Object3D,
    newProps: ObjectProperties,
    oldProps: ObjectProperties
  ) {
    const provider = PropertyProviderFactory.createProvider(object);
    if (!provider) {
      throw new Error(`No property provider found for object type: ${object.type}`);
    }

    // Validate property types match
    if (newProps.type !== oldProps.type) {
      throw new Error(`Property type mismatch: ${newProps.type} !== ${oldProps.type}`);
    }

    this.provider = provider;
    this.newProperties = provider.cloneProperties(newProps);
    this.oldProperties = provider.cloneProperties(oldProps);
  }

  execute(scene: Scene): void {
    this.provider.applyProperties(this.newProperties);
  }

  undo(scene: Scene): void {
    this.provider.applyProperties(this.oldProperties);
  }
} 