import * as THREE from 'three';
import type { ObjectProperties, TransformBase } from '../../interfaces/PropertyProvider';

export abstract class BasePropertyProvider<T extends ObjectProperties> {
  protected abstract get type(): T['type'];
  protected abstract get object(): THREE.Object3D;

  protected cloneTransformBase(props: TransformBase): TransformBase {
    return {
      position: props.position.clone(),
      rotation: props.rotation.clone(),
      scale: props.scale.clone()
    };
  }

  getProperties(): T {
    const baseProps = {
      type: this.type,
      position: this.object.position,
      rotation: this.object.rotation,
      scale: this.object.scale
    } as unknown as T;

    return this.cloneProperties(baseProps);
  }

  protected abstract cloneProperties(props: T): T;
  abstract applyProperties(props: T): void;
} 