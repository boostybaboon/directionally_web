import { Catalog } from '../Catalog';
import { CubeMeshItem, SphereMeshItem, PlaneMeshItem } from './StandardMeshItems';
import { DirectionalLightItem, PointLightItem, AmbientLightItem } from './StandardLightItems';
import { CatalogItemType } from '../types/CatalogItemType';

export class StandardCatalogBuilder {
    private nextId: number = 0;

    private generateId(prefix: string): string {
        return `${prefix}_${this.nextId++}`;
    }

    public static build(): Catalog {
        const builder = new StandardCatalogBuilder();
        const catalog = new Catalog();

        // Add standard meshes
        catalog.addItem(new CubeMeshItem(builder.generateId('cube'), 1, {
            category: 'Meshes',
            icon: '📦',
            description: 'A standard cube mesh'
        }));
        catalog.addItem(new SphereMeshItem(builder.generateId('sphere'), 0.5, {
            category: 'Meshes',
            icon: '⚪',
            description: 'A standard sphere mesh'
        }));
        catalog.addItem(new PlaneMeshItem(builder.generateId('plane'), 10, 10, {
            category: 'Meshes',
            icon: '⬜',
            description: 'A standard plane mesh'
        }));

        // Add standard lights
        catalog.addItem(new DirectionalLightItem(builder.generateId('directional_light'), {
            category: 'Lights',
            icon: '💡',
            description: 'A directional light source'
        }));
        catalog.addItem(new PointLightItem(builder.generateId('point_light'), {
            category: 'Lights',
            icon: '🔆',
            description: 'A point light source'
        }));
        catalog.addItem(new AmbientLightItem(builder.generateId('ambient_light'), {
            category: 'Lights',
            icon: '☀️',
            description: 'An ambient light source'
        }));

        return catalog;
    }
} 