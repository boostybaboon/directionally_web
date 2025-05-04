import * as THREE from 'three';
import type { Command } from '../Command';
import { CatalogItemType } from '../types/CatalogItemType';

export interface CatalogItem {
    id: string;
    name: string;
    type: CatalogItemType;
    createCommand(): Command;
    getPreview(): THREE.Object3D;
}

export interface Catalog {
    getItems(): readonly CatalogItem[];
    getItemById(id: string): CatalogItem | undefined;
    getItemsByType(type: CatalogItemType): readonly CatalogItem[];
    addItem(item: CatalogItem): void;
    removeItem(id: string): void;
} 