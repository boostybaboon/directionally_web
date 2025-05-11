<script lang="ts">
  import { onMount } from 'svelte';
  import { setContext } from 'svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import MainContent from './MainContent.svelte';
  import RightSidebar from './RightSidebar.svelte';
  import Toolbar from './Toolbar.svelte';
  import { setupKeyboardShortcuts } from '$lib/ui/keyboard/KeyboardShortcuts';
  import { DocumentManager } from '$lib/core/DocumentManager';
  import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';
  import type { DocumentContext, DocumentObserver } from '$lib/types/document';

  // Document state
  let currentDocument = $state<DocumentInterfaces | null>(null);
  let observers: DocumentObserver[] = [];

  // Update all observers with current document state
  function updateObservers() {
    observers.forEach((observer, index) => {
      observer.onDocumentChanged(currentDocument);
    });
  }

  // Document actions
  function createDocument() {
    const documentManager = DocumentManager.getInstance();
    currentDocument = documentManager.createDefaultDocument();
    updateObservers();
  }

  function openDocument() {
    // TODO: Implement file dialog and document opening
    alert('Opening document... (Not implemented)');
  }

  function registerObserver(observer: DocumentObserver) {
    observers = [...observers, observer];
    // Immediately notify the new observer of current state
    observer.onDocumentChanged(currentDocument);
    // Return unregister function
    return () => {
      observers = observers.filter(o => o !== observer);
    };
  }

  // Create document context object
  const documentContext = {
    get currentDocument() { return currentDocument; },
    createDocument,
    openDocument,
    registerObserver
  };

  setContext<DocumentContext>('document', documentContext);

  onMount(() => {
    setupKeyboardShortcuts(documentContext);
  });
</script>

<div class="app-layout">
  <div class="main-area">
    <Toolbar />
    <div class="content-area">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
  </div>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  
  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .content-area {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
</style>