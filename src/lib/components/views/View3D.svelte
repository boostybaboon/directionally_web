<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import type { Scene as DirectionallyScene } from '$lib/core/Scene';
  import type { CameraView } from '$lib/core/interfaces/CameraView';
  import { CameraType } from '$lib/core/types/CameraType';
  
  // Props
  export let scene: DirectionallyScene;
  
  // View state
  let container: HTMLElement;
  let renderer: THREE.WebGLRenderer;
  let threeScene: THREE.Scene;
  let activeCamera: THREE.PerspectiveCamera | null = null;
  let cameraViews: readonly CameraView[] = [];
  let animationFrameId: number | null = null;
  let controls: OrbitControls | null = null;
  let activeCameraType: CameraType | null = null;
  
  // Initialize WebGL renderer
  onMount(() => {
    if (!container) return;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x1a1a1a);
    
    // Add to DOM
    container.appendChild(renderer.domElement);
    
    // Handle resize
    const handleResize = () => {
      if (container && renderer && activeCamera) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        
        if (activeCamera) {
          activeCamera.aspect = width / height;
          activeCamera.updateProjectionMatrix();
        }
      }
    };
    
    // Initial size
    handleResize();
    
    // Listen for resizes
    window.addEventListener('resize', handleResize);
    
    // Initialize scene
    threeScene = scene.getScene();
    cameraViews = scene.getCameraViews();
    updateActiveCameraView();
    
    // Start rendering if we have all required components
    if (renderer && threeScene && activeCamera) {
      startRendering();
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  // Start the render loop
  function startRendering() {
    if (!renderer || !threeScene || !activeCamera) return;
    
    // Set up orbit controls for design cameras
    if (activeCameraType === CameraType.Design && !controls) {
      controls = new OrbitControls(activeCamera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.7;
      controls.panSpeed = 0.7;
      controls.zoomSpeed = 1.2;
      controls.minDistance = 1;
      controls.maxDistance = 100;
      controls.target.set(0, 0, 0);
    }
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(threeScene!, activeCamera!);
    };
    
    animate();
  }
  
  // Stop the render loop
  function stopRendering() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
  
  // Update the active camera view
  function updateActiveCameraView() {
    if (cameraViews.length > 0) {
      const view = cameraViews[0];
      activeCamera = view.getCamera();
      activeCameraType = view.getCameraType();
      
      if (renderer && threeScene) {
        startRendering();
      }
    }
  }
  
  // Clean up on component destruction
  onDestroy(() => {
    stopRendering();
    
    if (controls) {
      controls.dispose();
      controls = null;
    }
    
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  });
</script>

<div class="view-3d" bind:this={container}>
  {#if !activeCamera}
    <div class="placeholder-view">
      <p>No active camera</p>
    </div>
  {/if}
</div>

<style>
  .view-3d {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .placeholder-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888888;
  }
</style> 