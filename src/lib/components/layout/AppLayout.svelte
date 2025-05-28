<script lang="ts">
  import { onMount } from 'svelte';
  import { setContext } from 'svelte';
  import MainContent from './MainContent.svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import RightSidebar from './RightSidebar.svelte';
  import Toolbar from './Toolbar.svelte';
  import { createDocumentManager } from '$core';
  import type { DocumentInterfaces, DocumentContext, DocumentObserver } from '$core/interfaces/DocumentInterfaces';
  import { setupKeyboardShortcuts } from '$lib/ui/keyboard/KeyboardShortcuts';

  // Get document context
  const documentManager = createDocumentManager();

  // Document state
  let currentDocument: DocumentInterfaces | null = null;
  const observers: DocumentObserver[] = [];

  // Document actions
  function createDocument() {
    currentDocument = documentManager.createDefaultDocument();
    updateObservers();
  }

  function openDocument() {
    // TODO: Implement document opening
  }

  function updateObservers() {
    observers.forEach(observer => observer.onDocumentChanged(currentDocument));
  }

  function registerObserver(observer: DocumentObserver) {
    observers.push(observer);
    return () => {
      const index = observers.indexOf(observer);
      if (index !== -1) {
        observers.splice(index, 1);
      }
    };
  }

  // Create document context object
  const documentContextObject = {
    get currentDocument() { return currentDocument; },
    createDocument,
    openDocument,
    registerObserver
  };

  setContext<DocumentContext>('document', documentContextObject);

  onMount(() => {
    setupKeyboardShortcuts(documentContextObject);
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