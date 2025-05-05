<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { documentService } from '$lib/stores/DocumentStore.svelte';
  import type { DocumentState } from '$lib/stores/DocumentStore.svelte';
  import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
  import type { CameraView } from '$lib/core/interfaces/CameraView';
  import { CameraType } from '$lib/core/types/CameraType';
  import type { Scene as DirectionallyScene } from '$lib/core/Scene';
  
  // View state
  let container: HTMLElement;
  let renderer: THREE.WebGLRenderer;
  let activeScene: DirectionallyScene | null = null;
  let threeScene: THREE.Scene | null = null;
  let activeCamera: THREE.PerspectiveCamera | null = null;
  let cameraViews: readonly CameraView[] = [];
  let animationFrameId: number | null = null;
  let viewName = 'No Active View';
  let controls: OrbitControls | null = null;
  let activeCameraType: CameraType | null = null;
  
  // Subscribe to document store to get the actual scene
  const documentUnsubscribe = documentService.subscribe((state: DocumentState) => {
    activeScene = state.scene;
    
    // If we have a scene, get the THREE.Scene from it
    if (activeScene) {
      threeScene = activeScene.getScene();
      cameraViews = activeScene.getCameraViews();
      
      // Check if we already have camera views
      updateActiveCameraView();
      
      console.log('Scene updated, camera views:', cameraViews.length);
      
      // Initialize 3D view if we have both scene and camera
      if (renderer && threeScene && activeCamera) {
        startRendering();
      }
    } else {
      activeScene = null;
      threeScene = null;
      activeCamera = null;
      activeCameraType = null;
      cameraViews = [];
      if (controls) {
        controls.dispose();
        controls = null;
      }
      stopRendering();
      viewName = 'No Active View';
    }
  });
  
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
      controls.enableDamping = true; // Add smooth damping effect
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.7;
      controls.panSpeed = 0.7;
      controls.zoomSpeed = 1.2;
      controls.minDistance = 1;
      controls.maxDistance = 100;
      
      // Set initial target (looking at the origin)
      controls.target.set(0, 0, 0);
    }
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update orbit controls if active
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
      // Use the first camera view for now
      const view = cameraViews[0];
      activeCamera = view.getCamera();
      activeCameraType = view.getCameraType();
      viewName = `Camera (${activeCameraType === CameraType.Design ? 'Design' : 'Playback'})`;
      
      // Start rendering if we have all required components
      if (renderer && threeScene) {
        startRendering();
      }
    }
  }
  
  // Clean up on component destruction
  onDestroy(() => {
    if (documentUnsubscribe) documentUnsubscribe();
    stopRendering();
    
    if (controls) {
      controls.dispose();
      controls = null;
    }
    
    if (renderer) {
      renderer.dispose();
      
      // Remove from DOM if still attached
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
  });
</script>

<div class="main-content">
  <div class="view-tabs">
    <div class="tab active">{viewName}</div>
  </div>
  
  <div class="view-container" bind:this={container}>
    {#if !activeScene || !activeCamera}
      <div class="placeholder-view">
        <p>No active scene</p>
        <p>Create a new scene from the Document panel</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    color: #cccccc;
    overflow: hidden;
  }
  
  .view-tabs {
    display: flex;
    background-color: #252526;
    border-bottom: 1px solid #333333;
  }
  
  .tab {
    padding: 8px 16px;
    background-color: #2d2d2d;
    border-right: 1px solid #333333;
    cursor: pointer;
  }
  
  .tab.active {
    background-color: #1e1e1e;
    border-bottom: 2px solid #007acc;
  }
  
  .view-container {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  .placeholder-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 2px dashed #555555;
    border-radius: 8px;
    margin: 20px;
    font-size: 1.2rem;
  }
</style>