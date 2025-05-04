<script lang="ts">
  // Placeholder for document management functionality
  function createNewDocument() {
    alert('Creating new document...');
  }
  
  function openDocument() {
    alert('Opening document...');
  }
  
  function saveDocument() {
    alert('Saving document...');
  }
</script>

<div class="document-panel">
  <div class="action-section">
    <h3>Document Actions</h3>
    <button class="action-button" on:click={createNewDocument}>
      <span class="icon">📝</span> New Document
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