<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import type { Scene } from '$lib/core/Scene';
  import type { CameraView } from '$lib/core/interfaces/CameraView';
  import { CameraType } from '$lib/core/types/CameraType';
  
  // Props
  export let scene: Scene;
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
    activeCamera = cameraViews[0];
    
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
    };
  });
  
  // Animation loop
  function animate() {
    if (!renderer || !activeCamera) return;
    
    requestAnimationFrame(animate);
    renderer.render(scene.getScene(), activeCamera.getCamera());
  }
  
  // Handle resize
  function handleResize() {
    if (!container || !renderer || !activeCamera) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    activeCamera.updateAspectRatio(width / height);
  }
  
  // Cleanup
  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
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