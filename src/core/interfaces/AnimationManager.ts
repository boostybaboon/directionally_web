import * as THREE from 'three';

export interface Animation {
    id: string;
    play(): void;
    pause(): void;
    unpause(): void;
    stopAndReset(): void;
    setTime(time: number): void;
}

export interface AnimationManager {
    getAnimations(): Animation[];
    getAnimation(id: string): Animation | undefined;
} 