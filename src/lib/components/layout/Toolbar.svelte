<script lang="ts">
  import { getDocument } from '$lib/stores/DocumentStore.svelte';
  
  function handleUndo() {
    const document = getDocument();
    if (document) {
      document.commandExecutor.undo();
    }
  }
  
  function handleRedo() {
    const document = getDocument();
    if (document) {
      document.commandExecutor.redo();
    }
  }
</script>

<div class="toolbar">
  <button onclick={handleUndo} title="Undo" disabled={!getDocument()}>↩</button>
  <button onclick={handleRedo} title="Redo" disabled={!getDocument()}>↪</button>
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