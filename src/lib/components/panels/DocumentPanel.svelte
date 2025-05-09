<script lang="ts">
  import { DocumentManager } from '$lib/core/DocumentManager';
  import { getDocument, setDocument } from '$lib/stores/DocumentStore.svelte';
  import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';
  
  // Define bindable events using $props
  let { 
    onDocumentCreated = $bindable<(document: DocumentInterfaces) => void>(),
    onDocumentOpened = $bindable<(document: DocumentInterfaces) => void>(),
    onDocumentSaved = $bindable<(document: DocumentInterfaces) => void>()
  } = $props();
  
  // Document management functionality
  function createDefaultDocument() {
    const documentManager = DocumentManager.getInstance();
    const document = documentManager.createDefaultDocument();
    setDocument(document);
    
    // Call the bindable event handler
    onDocumentCreated(document);
  }
  
  function openDocument() {
    // In a real implementation, this would open a file dialog
    alert('Opening document... (Not implemented)');
  }
  
  function saveDocument() {
    const document = getDocument();
    if (document) {
      // In a real implementation, this would save the current scene
      alert('Saving document... (Not implemented)');
      onDocumentSaved(document);
    }
  }
</script>

<div class="document-panel">
  <div class="action-section">
    <h3>Document Actions</h3>
    <button class="action-button" onclick={createDefaultDocument}>
      <span class="icon">📝</span> Default Document
    </button>
    
    <button class="action-button" onclick={openDocument}>
      <span class="icon">📂</span> Open Document
    </button>
    
    <button class="action-button" onclick={saveDocument} disabled={!getDocument()}>
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
  
  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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