import * as THREE from 'three';

export interface SelectionListener {
    onSelectionChanged(selectedObjects: THREE.Object3D[]): void;
}

export interface SceneSelector {
    getSelectedObjects(): THREE.Object3D[];
    setSelectedObjects(objects: THREE.Object3D[]): void;
    addSelectionListener(listener: SelectionListener): () => void;
} 