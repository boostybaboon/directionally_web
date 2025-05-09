import * as THREE from 'three';
import type { CatalogItem } from '../interfaces/Catalog';
import { CatalogItemType } from '../types/CatalogItemType';
import { AddObject3D } from '../commands/AddObject3D';

export abstract class StandardCatalogItem implements CatalogItem {
    constructor(
        public id: string,
        public name: string,
        public type: CatalogItemType,
        protected object: THREE.Object3D,
        public metadata: Record<string, any> = {}
    ) {}

    createCommand(): AddObject3D {
        return new AddObject3D(this.object);
    }

    getPreview(): THREE.Object3D {
        return this.object;
    }
} 