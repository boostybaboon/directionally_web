import type { Catalog as ICatalog, CatalogItem } from './interfaces/Catalog';
import { CatalogItemType } from './types/CatalogItemType';

export class Catalog implements ICatalog {
    public readonly items: Map<string, CatalogItem> = new Map();

    public getItems(): readonly CatalogItem[] {
        return Array.from(this.items.values());
    }

    public getItem(id: string): CatalogItem | undefined {
        return this.items.get(id);
    }

    public getAllItems(): CatalogItem[] {
        return Array.from(this.items.values());
    }

    public getItemsByType(type: CatalogItemType): readonly CatalogItem[] {
        return this.getItems().filter(item => item.type === type);
    }

    public addItem(item: CatalogItem): void {
        this.items.set(item.id, item);
    }

    public removeItem(id: string): void {
        this.items.delete(id);
    }
} 