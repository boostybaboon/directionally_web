import * as THREE from 'three';
import { StandardCatalogItem } from './StandardCatalogItem';
import { CatalogItemType } from '../types/CatalogItemType';

export class CubeMeshItem extends StandardCatalogItem {
    constructor(id: string, size: number = 1) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(id, 'Cube', CatalogItemType.Mesh, mesh);
    }
}

export class SphereMeshItem extends StandardCatalogItem {
    constructor(id: string, radius: number = 0.5) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(id, 'Sphere', CatalogItemType.Mesh, mesh);
    }
}

export class PlaneMeshItem extends StandardCatalogItem {
    constructor(id: string, width: number = 1, height: number = 1) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        super(id, 'Plane', CatalogItemType.Mesh, mesh);
    }
} 