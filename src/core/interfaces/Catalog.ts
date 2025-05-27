import * as THREE from 'three';
import type { Command } from '../internal/Command';
import { CatalogItemType } from '../types/CatalogItemType';

export interface CatalogItem {
    id: string;
    name: string;
    type: CatalogItemType;
    metadata: Record<string, any>;
    createCommand(): Command;
    getPreview(): THREE.Object3D;
}

export interface Catalog {
    readonly items: Map<string, CatalogItem>;
    
    addItem(item: CatalogItem): void;
    removeItem(id: string): void;
    getItem(id: string): CatalogItem | undefined;
    getAllItems(): CatalogItem[];
    getItemsByType(type: CatalogItemType): readonly CatalogItem[];
} 