<script lang="ts">
  import { documentStore } from '$lib/stores/DocumentStore';
  
  function handleUndo() {
    const document = $documentStore;
    if (document) {
      document.commandExecutor.undo();
    }
  }
  
  function handleRedo() {
    const document = $documentStore;
    if (document) {
      document.commandExecutor.redo();
    }
  }
</script>

<div class="toolbar">
  <button on:click={handleUndo} title="Undo" disabled={!$documentStore?.sceneViewer}>↩</button>
  <button on:click={handleRedo} title="Redo" disabled={!$documentStore?.sceneViewer}>↪</button>
</div>

<style>
  .toolbar {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.25rem 0.5rem;
    background: #2d2d2d;
    border: 1px solid #444;
    color: #ccc;
    cursor: pointer;
  }
  
  button:hover:not(:disabled) {
    background: #3d3d3d;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 