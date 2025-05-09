<script lang="ts">
  import { documentService } from '$lib/stores/DocumentService';
  
  function handleUndo() {
    documentService.commandExecutor?.undo();
  }
  
  function handleRedo() {
    documentService.commandExecutor?.redo();
  }
</script>

<div class="toolbar">
  <button on:click={handleUndo} title="Undo">↩</button>
  <button on:click={handleRedo} title="Redo">↪</button>
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
  
  button:hover {
    background: #3d3d3d;
  }
</style> 