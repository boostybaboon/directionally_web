<script lang="ts">
  import { DocumentManager } from '$lib/core/DocumentManager';
  import { 
    getDocument, 
    createDocument, 
    openDocument as openDocumentStore, 
    saveDocument 
  } from '$lib/stores/DocumentStore.svelte';
  
  // Document management functionality
  function handleCreateDefaultDocument() {
    const documentManager = DocumentManager.getInstance();
    const document = documentManager.createDefaultDocument();
    createDocument(document);
  }
  
  function handleOpenDocument() {
    // In a real implementation, this would open a file dialog
    alert('Opening document... (Not implemented)');
  }
  
  function handleSaveDocument() {
    const document = getDocument();
    if (document) {
      // In a real implementation, this would save the current scene
      alert('Saving document... (Not implemented)');
      saveDocument();
    }
  }
</script>

<div class="document-panel">
  <div class="action-section">
    <h3>Document Actions</h3>
    <button class="action-button" onclick={handleCreateDefaultDocument}>
      <span class="icon">📝</span> Default Document
    </button>
    
    <button class="action-button" onclick={handleOpenDocument}>
      <span class="icon">📂</span> Open Document
    </button>
    
    <button class="action-button" onclick={handleSaveDocument} disabled={!getDocument()}>
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