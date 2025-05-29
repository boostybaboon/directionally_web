import * as THREE from 'three';
import type { PropertyProvider } from './PropertyProvider';

export interface SelectedObject {
  object: THREE.Object3D;
  propertyProvider: PropertyProvider;
}

export interface SelectionListener {
  onSelectionChanged(selectedObjects: SelectedObject[]): void;
}

export interface SceneSelector {
  getSelectedObjects(): SelectedObject[];
  setSelectedObjects(objects: THREE.Object3D[]): void;
  addSelectionListener(listener: SelectionListener): () => void;
} 