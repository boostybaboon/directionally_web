import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Scene } from '$lib/core/Scene';
import { CameraType } from '$lib/core/types/CameraType';

describe('Scene with Camera Views', () => {
    it('should add design camera with associated CameraView', () => {
        // Arrange
        const scene = new Scene();
        const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
        
        // Act
        const cameraId = scene.addDesignCamera(camera);
        
        // Assert
        expect(cameraId).toContain('design_camera');
        expect(scene.getCameraViews().length).toBe(1);
        
        const cameraView = scene.getCameraViews()[0];
        expect(cameraView.getCamera()).toBe(camera);
        expect(cameraView.getCameraType()).toBe(CameraType.Design);
    });
    
    it('should add playback camera with associated CameraView', () => {
        // Arrange
        const scene = new Scene();
        const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
        
        // Act
        const cameraId = scene.addPlaybackCamera(camera);
        
        // Assert
        expect(cameraId).toContain('playback_camera');
        expect(scene.getCameraViews().length).toBe(1);
        
        const cameraView = scene.getCameraViews()[0];
        expect(cameraView.getCamera()).toBe(camera);
        expect(cameraView.getCameraType()).toBe(CameraType.Playback);
    });
    
    it('should remove CameraView when removing a camera', () => {
        // Arrange
        const scene = new Scene();
        const designCamera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
        const playbackCamera = new THREE.PerspectiveCamera(60, 4/3, 0.1, 1000);
        
        const designCameraId = scene.addDesignCamera(designCamera);
        const playbackCameraId = scene.addPlaybackCamera(playbackCamera);
        expect(scene.getCameraViews().length).toBe(2);
        
        // Act - Remove design camera
        scene.removeDesignCamera(designCameraId);
        
        // Assert
        expect(scene.getCameraViews().length).toBe(1);
        expect(scene.getCameraViews()[0].getCamera()).toBe(playbackCamera);
        expect(scene.getCameraViews()[0].getCameraType()).toBe(CameraType.Playback);
        
        // Act - Remove playback camera
        scene.removePlaybackCamera(playbackCameraId);
        
        // Assert
        expect(scene.getCameraViews().length).toBe(0);
    });
});