<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { DocumentManager } from '$lib/core/DocumentManager';
  import { documentStore } from '$lib/stores/DocumentStore';
  import { documentService } from '$lib/stores/DocumentService';
  import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';
  import { Scene } from '$lib/core/Scene';
  
  // Event dispatcher to communicate with parent components
  const dispatch = createEventDispatcher<{
    documentCreated: { documentId: string };
    documentOpened: { document: DocumentInterfaces };
    documentSaved: { document: DocumentInterfaces };
  }>();
  
  // Document management functionality
  function createDefaultDocument() {
    const documentManager = DocumentManager.getInstance();
    const document = documentManager.createDefaultDocument();
    const documentId = documentStore.addDocument(document);
    
    // Set the scene in documentService
    documentService.createDefaultDocument(document.sceneViewer as unknown as Scene);
    
    // Dispatch event to notify parent components
    dispatch('documentCreated', { documentId });
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
    <button class="action-button" on:click={createDefaultDocument}>
      <span class="icon">📝</span> Default Document
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