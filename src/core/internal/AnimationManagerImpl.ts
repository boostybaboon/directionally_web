import * as THREE from 'three';
import type { Animation, AnimationManager } from '../interfaces/AnimationManager';
import type { Scene } from './Scene';

class AnimationImpl implements Animation {
    constructor(
        public readonly id: string,
        private readonly action: THREE.AnimationAction
    ) {}

    play(): void {
        //in single page example, the action is constructed as played and paused,
        //so the play method just sets the paused flag to false
        this.action.play();
    }

    pause(): void {
        this.action.paused = true;
    }

    unpause(): void {
        this.action.paused = false;
    }

    stopAndReset(): void {
        //https://threejs.org/docs/index.html#api/en/animation/AnimationAction.stop
        //AnimationAction.stop() stops and resets the animation
        this.action.stop();
    }

    setTime(time: number): void {
        this.action.time = time;
    }
}

export class AnimationManagerImpl implements AnimationManager {
    constructor(private readonly scene: Scene) {}

    getAnimations(): Animation[] {
        return Object.entries(this.scene.getAnimationActions()).map(
            ([id, action]) => new AnimationImpl(id, action)
        );
    }

    getAnimation(id: string): Animation | undefined {
        const action = this.scene.getAnimationAction(id);
        return action ? new AnimationImpl(id, action) : undefined;
    }
} 