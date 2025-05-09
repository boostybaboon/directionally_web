import * as THREE from 'three';
import { StandardCatalogItem, type CatalogItemMetadata } from './StandardCatalogItem';
import { CatalogItemType } from '../types/CatalogItemType';

export class CubeMeshItem extends StandardCatalogItem {
    constructor(id: string, size: number = 1, metadata: CatalogItemMetadata) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(id, 'Cube', CatalogItemType.Mesh, mesh, metadata);
    }
}

export class SphereMeshItem extends StandardCatalogItem {
    constructor(id: string, radius: number = 0.5, metadata: CatalogItemMetadata) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(id, 'Sphere', CatalogItemType.Mesh, mesh, metadata);
    }
}

export class PlaneMeshItem extends StandardCatalogItem {
    constructor(id: string, width: number = 10, height: number = 10, metadata: CatalogItemMetadata) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // Rotate -90 degrees around X axis
        super(id, 'Plane', CatalogItemType.Mesh, mesh, metadata);
    }
} 