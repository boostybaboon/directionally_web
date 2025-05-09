<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
  import type { CameraView } from '$lib/core/interfaces/CameraView';
  import { CameraType } from '$lib/core/types/CameraType';
  
  // Props
  export let scene: SceneViewer;
  export let cameraViews: CameraView[];
  
  // View state
  let container: HTMLElement;
  let renderer: THREE.WebGLRenderer;
  let activeCamera: CameraView;
  let animationFrameId: number | null = null;
  let controls: OrbitControls | null = null;
  let activeCameraType: CameraType | null = null;
  
  // Initialize
  onMount(() => {
    if (!container) return;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Set initial camera
    console.log('View3D: cameraViews:', cameraViews);
    activeCamera = cameraViews[0];
    console.log('View3D: activeCamera:', activeCamera);
    
    // Set up camera controls if it's a design camera
    setupCameraControls();
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    
    // Start animation loop
    animate();
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (controls) {
        controls.dispose();
      }
    };
  });
  
  // Set up camera controls
  function setupCameraControls() {
    if (!container || !activeCamera) return;
    
    // Only add controls for design cameras
    if (activeCamera.getCameraType() === CameraType.Design) {
      console.log('View3D: Setting up OrbitControls for design camera');
      controls = new OrbitControls(activeCamera.getCamera(), container);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    } else {
      console.log('View3D: No controls for non-design camera');
      if (controls) {
        controls.dispose();
        controls = null;
      }
    }
  }
  
  // Animation loop
  function animate() {
    if (!renderer || !activeCamera) return;
    
    requestAnimationFrame(animate);
    
    // Update controls if they exist
    if (controls) {
      controls.update();
    }
    
    renderer.render(scene.getScene(), activeCamera.getCamera());
  }
  
  // Handle resize
  function handleResize() {
    if (!container || !renderer || !activeCamera) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const aspect = width / height;
    
    renderer.setSize(width, height);
    activeCamera.updateAspectRatio(aspect);
  }
  
  // Cleanup
  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
    }
    if (controls) {
      controls.dispose();
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