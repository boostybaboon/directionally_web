import * as THREE from 'three';
import type { Command } from '../Command';
import type { CommandExecutor } from '../../interfaces/CommandExecutor';
import type { Scene } from '../Scene';

export class AddAnimationCommand implements Command {
    constructor(
        private readonly id: string,
        private readonly object: THREE.Object3D,
        private readonly property: string,
        private readonly startValue: number | THREE.Vector3,
        private readonly endValue: number | THREE.Vector3,
        private readonly startTime: number,
        private readonly endTime: number
    ) {}

    execute(executor: CommandExecutor): void {
        const scene = executor as Scene;
        
        // Create keyframe track
        const times = [this.startTime, this.endTime];
        const values = this.createKeyframeValues();
        const track = new THREE.KeyframeTrack(this.property, times, values);
        
        // Create clip
        const clip = new THREE.AnimationClip(this.id, -1, [track]);
        
        // Create mixer and action
        const mixer = new THREE.AnimationMixer(this.object);
        const action = mixer.clipAction(clip);
        
        // Store in scene
        scene.addAnimationMixer(mixer);
        scene.addAnimationAction(this.id, action);
    }

    undo(executor: CommandExecutor): void {
        const scene = executor as Scene;
        const action = scene.getAnimationAction(this.id);
        if (action) {
            scene.removeAnimationMixer(action.getMixer());
            scene.removeAnimationAction(this.id);
        }
    }

    private createKeyframeValues(): number[] {
        if (this.startValue instanceof THREE.Vector3 && this.endValue instanceof THREE.Vector3) {
            return [
                this.startValue.x, this.startValue.y, this.startValue.z,
                this.endValue.x, this.endValue.y, this.endValue.z
            ];
        } else if (typeof this.startValue === 'number' && typeof this.endValue === 'number') {
            return [this.startValue, this.endValue];
        }
        throw new Error('Invalid value types for animation');
    }
} 