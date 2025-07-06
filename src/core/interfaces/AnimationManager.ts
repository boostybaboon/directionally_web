import * as THREE from 'three';

export interface Animation {
    id: string;
    play(): void;
    pause(): void;
    unpause(): void;
    stopAndReset(): void;
    setTime(time: number): void;
    getStartTime(): number;
    getEndTime(): number;
    getDuration(): number;
}

export interface AnimationManager {
    getAnimations(): Animation[];
    getAnimation(id: string): Animation | undefined;
    
    play(): void;
    pause(): void;
    stop(): void;
    seek(time: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    
    onTimeUpdate(callback: (time: number) => void): () => void;
    onPlayStateChange(callback: (isPlaying: boolean) => void): () => void;
} 