import * as THREE from 'three';
import type { CatalogItem } from '../../interfaces/Catalog';
import { CatalogItemType } from '../../types/CatalogItemType';
import { AddObject3D } from '../commands/AddObject3D';
import { PropertyProviderFactory } from '../providers/PropertyProviderFactory';

export interface CatalogItemMetadata {
    category: string;
    description: string;
    icon?: string;
}

export abstract class StandardCatalogItem implements CatalogItem {
    constructor(
        public id: string,
        public name: string,
        public type: CatalogItemType,
        protected object: THREE.Object3D,
        public metadata: CatalogItemMetadata
    ) {}

    createCommand(): AddObject3D {
        // Clone the object and all its children
        const clonedObject = this.object.clone();
        
        // Get the appropriate property provider
        const provider = PropertyProviderFactory.createProvider(clonedObject);
        if (provider) {
            // Get current properties and clone them
            const properties = provider.getProperties();
            // Apply the cloned properties to ensure everything is properly cloned
            provider.applyProperties(properties);
        }
        
        return new AddObject3D(clonedObject);
    }

    getPreview(): THREE.Object3D {
        return this.object;
    }
} 