import * as THREE from 'three';
import { StandardCatalogItem, type CatalogItemMetadata } from './StandardCatalogItem';
import { CatalogItemType } from '../types/CatalogItemType';

export class DirectionalLightItem extends StandardCatalogItem {
    constructor(id: string, metadata: CatalogItemMetadata, intensity: number = 1) {
        const light = new THREE.DirectionalLight(0xffffff, intensity);
        light.position.set(5, 5, 5);
        super(id, 'Directional Light', CatalogItemType.Light, light, metadata);
    }
}

export class PointLightItem extends StandardCatalogItem {
    constructor(id: string, metadata: CatalogItemMetadata, intensity: number = 1) {
        const light = new THREE.PointLight(0xffffff, intensity);
        light.position.set(0, 5, 0);
        super(id, 'Point Light', CatalogItemType.Light, light, metadata);
    }
}

export class AmbientLightItem extends StandardCatalogItem {
    constructor(id: string, metadata: CatalogItemMetadata, intensity: number = 0.5) {
        const light = new THREE.AmbientLight(0xffffff, intensity);
        super(id, 'Ambient Light', CatalogItemType.Light, light, metadata);
    }
} 