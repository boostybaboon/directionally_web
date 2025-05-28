<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { DocumentContext } from '$lib/types/DocumentContext';
  import type { DocumentInterfaces } from '$core/interfaces/DocumentInterfaces';

  // Get document context
  const documentContext = getContext<DocumentContext>('document');
  
  // State to track if a document is active
  let hasDocument = false;
  
  // Register an observer to update hasDocument when the document changes
  const observer = {
    onDocumentChanged(document: DocumentInterfaces | null) {
      hasDocument = !!document;
    }
  };
  const unsubscribe = documentContext.registerObserver(observer);
  
  onDestroy(() => {
    unsubscribe();
  });
  
  function handleUndo() {
    if (documentContext.currentDocument) {
      documentContext.currentDocument.commandExecutor.undo();
    }
  }
  
  function handleRedo() {
    if (documentContext.currentDocument) {
      documentContext.currentDocument.commandExecutor.redo();
    }
  }
</script>

<div class="toolbar">
  <button onclick={handleUndo} title="Undo" disabled={!hasDocument}>↩</button>
  <button onclick={handleRedo} title="Redo" disabled={!hasDocument}>↪</button>
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