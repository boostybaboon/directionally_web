import * as THREE from 'three';
import type { Animation, AnimationManager } from '../interfaces/AnimationManager';
import type { ToneProvider } from '../interfaces/ToneProvider';
import { ToneProviderImpl } from './ToneProviderImpl';
import type { Scene } from './Scene';

class AnimationImpl implements Animation {
    constructor(
        public readonly id: string,
        private readonly action: THREE.AnimationAction,
        private readonly startTime: number,
        private readonly duration: number
    ) {
        this.setupAction();
    }
    
    private setupAction(): void {
        this.action.setLoop(THREE.LoopOnce, 1);
        this.action.clampWhenFinished = true;
        this.action.play();
        this.action.paused = true;
    }
    
    // Existing methods
    play(): void { this.action.play(); }
    pause(): void { this.action.paused = true; }
    unpause(): void { this.action.paused = false; }
    stopAndReset(): void { this.action.stop(); }
    setTime(time: number): void { this.action.time = time; }
    
    // New timeline methods
    getStartTime(): number { return this.startTime; }
    getEndTime(): number { return this.startTime + this.duration; }
    getDuration(): number { return this.duration; }
}

export class AnimationManagerImpl implements AnimationManager {
    private animations: Map<string, AnimationImpl> = new Map();
    private timeUpdateCallbacks: ((time: number) => void)[] = [];
    private playStateCallbacks: ((isPlaying: boolean) => void)[] = [];
    private isPlaying = false;
    private currentTime = 0;
    private maxDuration = 0;
    private isToneSetup = false;
    private tone: ToneProvider;
    
    constructor(
        private readonly scene: Scene,
        toneProvider: ToneProvider
    ) {
        this.tone = toneProvider;
        this.setupTone();
    }
    
    private async setupTone(): Promise<void> {
        if (!this.isToneSetup) {
            try {
                await this.tone.start();
                this.tone.setContext(new this.tone.Context({ lookAhead: 0 }));
                this.tone.getDraw().anticipation = 0.5;
                this.isToneSetup = true;
            } catch (error) {
                console.warn('Tone.js setup failed:', error);
                this.isToneSetup = true;
            }
        }
    }
    
    // Existing methods
    getAnimations(): Animation[] {
        return Array.from(this.animations.values());
    }
    
    getAnimation(id: string): Animation | undefined {
        return this.animations.get(id);
    }
    
    // New method to add animation with timeline scheduling
    addTimelineAnimation(
        id: string, 
        action: THREE.AnimationAction, 
        startTime: number, 
        duration: number
    ): void {
        const animation = new AnimationImpl(id, action, startTime, duration);
        this.animations.set(id, animation);
        
        // Schedule with Tone.js (identical to Presenter.svelte)
        if (this.isToneSetup) {
            this.tone.getTransport().schedule((time) => {
                this.tone.getDraw().schedule(() => {
                    animation.unpause();
                    animation.setTime(0);
                }, time);
            }, startTime);
        }
        
        // Update max duration
        this.maxDuration = Math.max(this.maxDuration, startTime + duration);
    }
    
    // Method to remove animation from timeline
    removeTimelineAnimation(id: string): void {
        const animation = this.animations.get(id);
        if (animation) {
            animation.stopAndReset();
            this.animations.delete(id);
            
            // Recalculate max duration
            this.maxDuration = 0;
            this.animations.forEach(anim => {
                this.maxDuration = Math.max(this.maxDuration, anim.getEndTime());
            });
        }
    }
    
    // Timeline control methods (identical to Presenter.svelte)
    play(): void {
        if (!this.isToneSetup) return;
        
        let currentTime = this.tone.getTransport().seconds;
        this.animations.forEach(animation => {
            if (animation.getStartTime() < currentTime && currentTime < animation.getEndTime()) {
                animation.unpause();
            }
        });
        this.tone.getTransport().start();
        this.isPlaying = true;
        this.notifyPlayStateChange();
    }
    
    pause(): void {
        if (!this.isToneSetup) return;
        
        this.tone.getTransport().pause();
        this.updatePosition();
        this.isPlaying = false;
        this.notifyPlayStateChange();
        
        let currentTime = this.tone.getTransport().seconds;
        this.animations.forEach(animation => {
            if (animation.getStartTime() < currentTime && currentTime < animation.getEndTime()) {
                animation.pause();
            }
        });
    }
    
    stop(): void {
        if (!this.isToneSetup) return;
        
        this.tone.getTransport().stop();
        this.currentTime = 0;
        this.pauseAndDisableAll();
        this.notifyPlayStateChange();
        this.notifyTimeUpdate();
    }
    
    seek(time: number): void {
        if (!this.isToneSetup) return;
        
        this.tone.getTransport().seconds = time;
        this.updatePosition();
        this.setSequenceTo(time);
    }
    
    getCurrentTime(): number {
        return this.currentTime;
    }
    
    getDuration(): number {
        return this.maxDuration;
    }
    
    // Event handling
    onTimeUpdate(callback: (time: number) => void): () => void {
        this.timeUpdateCallbacks.push(callback);
        return () => {
            const index = this.timeUpdateCallbacks.indexOf(callback);
            if (index !== -1) {
                this.timeUpdateCallbacks.splice(index, 1);
            }
        };
    }
    
    onPlayStateChange(callback: (isPlaying: boolean) => void): () => void {
        this.playStateCallbacks.push(callback);
        return () => {
            const index = this.playStateCallbacks.indexOf(callback);
            if (index !== -1) {
                this.playStateCallbacks.splice(index, 1);
            }
        };
    }
    
    // Private helper methods (identical to Presenter.svelte)
    private updatePosition(): void {
        if (this.isToneSetup) {
            this.currentTime = this.tone.getTransport().seconds;
        }
        this.notifyTimeUpdate();
    }
    
    private pauseAndDisableAll(): void {
        this.animations.forEach(animation => {
            animation.stopAndReset();
            animation.pause();
        });
    }
    
    private setSequenceTo(time: number): void {
        this.pauseAndDisableAll();
        
        this.animations.forEach(animation => {
            if (time < animation.getStartTime()) {
                // Animation hasn't started yet
                animation.stopAndReset();
            } else if (time >= animation.getStartTime() && time < animation.getEndTime()) {
                // Animation is currently running
                animation.setTime(time - animation.getStartTime());
            } else {
                // Animation has finished
                animation.setTime(animation.getDuration());
            }
        });
    }
    
    private notifyTimeUpdate(): void {
        this.timeUpdateCallbacks.forEach(callback => callback(this.currentTime));
    }
    
    private notifyPlayStateChange(): void {
        this.playStateCallbacks.forEach(callback => callback(this.isPlaying));
    }
} 