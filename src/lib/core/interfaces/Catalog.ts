import * as THREE from 'three';
import type { Command } from '../Command';

export interface CatalogItem {
    id: string;
    name: string;
    type: string;
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
    getItemsByType(type: string): readonly CatalogItem[];
} 