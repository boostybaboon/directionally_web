<script lang="ts">
  import { Scene } from '$lib/core/Scene';
  import { AddDesignCamera } from '$lib/core/commands/AddDesignCamera';
  import { createEventDispatcher } from 'svelte';
  import * as THREE from 'three';
  
  // Event dispatcher to communicate with parent components
  const dispatch = createEventDispatcher<{
    documentCreated: { scene: Scene };
    documentOpened: { scene: Scene };
    documentSaved: { scene: Scene };
  }>();
  
  // Document management functionality
  function createNewDocument() {
    // Create a new empty scene
    const scene = new Scene();
    
    // Add a default camera
    const cameraCommand = new AddDesignCamera(
      75, // FOV
      0.1, // Near
      1000, // Far
      new THREE.Vector3(0, 5, 10), // Position
      new THREE.Vector3(0, 0, 0)  // Look at
    );
    
    // Execute the command to add the camera
    scene.execute(cameraCommand);
    
    // Dispatch event to notify parent components
    dispatch('documentCreated', { scene });
  }
  
  function openDocument() {
    // In a real implementation, this would open a file dialog
    alert('Opening document... (Not implemented)');
  }
  
  function saveDocument() {
    // In a real implementation, this would save the current scene
    alert('Saving document... (Not implemented)');
  }
</script>

<div class="document-panel">
  <div class="action-section">
    <h3>Document Actions</h3>
    <button class="action-button" on:click={createNewDocument}>
      <span class="icon">📝</span> Empty Scene
    </button>
    
    <button class="action-button" on:click={openDocument}>
      <span class="icon">📂</span> Open Document
    </button>
    
    <button class="action-button" on:click={saveDocument}>
      <span class="icon">💾</span> Save Document
    </button>
  </div>
  
  <div class="recent-documents">
    <h3>Recent Documents</h3>
    <div class="empty-state">No recent documents</div>
  </div>
</div>

<style>
  .document-panel {
    padding: 16px;
  }
  
  h3 {
    font-size: 0.9rem;
    margin: 0 0 12px 0;
    color: #cccccc;
  }
  
  .action-section {
    margin-bottom: 24px;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #3c3c3c;
    color: #cccccc;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    text-align: left;
    font-size: 0.9rem;
  }
  
  .action-button:hover {
    background-color: #4c4c4c;
  }
  
  .icon {
    margin-right: 8px;
    font-size: 1rem;
  }
  
  .recent-documents {
    color: #cccccc;
  }
  
  .empty-state {
    color: #888888;
    font-style: italic;
    padding: 12px 0;
  }
</style>