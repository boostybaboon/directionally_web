import { Catalog } from '../Catalog';
import { CubeMeshItem, SphereMeshItem, PlaneMeshItem } from './StandardMeshItems';
import { DirectionalLightItem, PointLightItem, AmbientLightItem } from './StandardLightItems';

export class StandardCatalogBuilder {
    private nextId: number = 0;

    private generateId(prefix: string): string {
        return `${prefix}_${this.nextId++}`;
    }

    public build(): Catalog {
        const catalog = new Catalog();

        // Add standard meshes
        catalog.addItem(new CubeMeshItem(this.generateId('cube')));
        catalog.addItem(new SphereMeshItem(this.generateId('sphere')));
        catalog.addItem(new PlaneMeshItem(this.generateId('plane')));

        // Add standard lights
        catalog.addItem(new DirectionalLightItem(this.generateId('directional_light')));
        catalog.addItem(new PointLightItem(this.generateId('point_light')));
        catalog.addItem(new AmbientLightItem(this.generateId('ambient_light')));

        return catalog;
    }
} 