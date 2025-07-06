import * as THREE from 'three';
import type { Command } from '../Command';
import type { CommandExecutor } from '../../interfaces/CommandExecutor';
import type { Scene } from '../Scene';
import { AnimationManagerImpl } from '../AnimationManagerImpl';

export class AddAnimationCommand implements Command {
    constructor(
        private readonly id: string,
        private readonly object: THREE.Object3D,
        private readonly property: string,
        private readonly startValue: number | THREE.Vector3,
        private readonly endValue: number | THREE.Vector3,
        private readonly startTime: number,  // Now represents global timeline time
        private readonly duration: number    // Animation duration
    ) {}

    execute(executor: CommandExecutor): void {
        const scene = executor as Scene;
        
        // Create keyframe track
        const times = [0, this.duration]; // Local animation timeline (0 to duration)
        const values = this.createKeyframeValues();
        const track = new THREE.KeyframeTrack(this.property, times, values);
        
        // Create clip
        const clip = new THREE.AnimationClip(this.id, -1, [track]);
        
        // Create mixer and action
        const mixer = new THREE.AnimationMixer(this.object);
        const action = mixer.clipAction(clip);
        
        // Store in scene (for mixer management)
        scene.addAnimationMixer(mixer);
        scene.addAnimationAction(this.id, action);
        
        // Register with timeline manager (NEW)
        const animationManager = scene.getAnimationManager();
        if (animationManager instanceof AnimationManagerImpl) {
            animationManager.addTimelineAnimation(this.id, action, this.startTime, this.duration);
        }
    }

    undo(executor: CommandExecutor): void {
        const scene = executor as Scene;
        const action = scene.getAnimationAction(this.id);
        if (action) {
            scene.removeAnimationMixer(action.getMixer());
            scene.removeAnimationAction(this.id);
            
            // Remove from timeline manager
            const animationManager = scene.getAnimationManager();
            if (animationManager instanceof AnimationManagerImpl) {
                animationManager.removeTimelineAnimation(this.id);
            }
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