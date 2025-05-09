<script lang="ts">
  import { documentStore } from '$lib/stores/DocumentStore';
  import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';
  
  function isCommandExecutor(obj: unknown): obj is CommandExecutor {
    return obj !== null && 
           typeof obj === 'object' && 
           'execute' in obj && 
           'undo' in obj && 
           'redo' in obj;
  }
  
  function handleUndo() {
    const scene = $documentStore.activeDocument?.scene;
    if (scene && isCommandExecutor(scene)) {
      scene.undo();
    }
  }
  
  function handleRedo() {
    const scene = $documentStore.activeDocument?.scene;
    if (scene && isCommandExecutor(scene)) {
      scene.redo();
    }
  }
</script>

<div class="toolbar">
  <button on:click={handleUndo} title="Undo" disabled={!$documentStore.activeDocument?.scene}>↩</button>
  <button on:click={handleRedo} title="Redo" disabled={!$documentStore.activeDocument?.scene}>↪</button>
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