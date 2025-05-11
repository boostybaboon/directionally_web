<script lang="ts">
  import { getContext } from 'svelte';
  import DocumentPanel from '../panels/DocumentPanel.svelte';
  import CatalogPanel from '../panels/CatalogPanel.svelte';
  import SceneGraphPanel from '../panels/SceneGraphPanel.svelte';
  import type { DocumentContext } from '$lib/types/document';
  import { onMount } from 'svelte';

  // Get document context
  const documentContext = getContext<DocumentContext>('document');
  const { openDocument, createDocument } = documentContext;

  // Simple enum-like type for tab IDs
  type TabId = 'document' | 'catalog' | 'sceneGraph';
  
  // Tab definitions
  const tabs = [
    { id: 'document' as TabId, icon: '📄', title: 'Document' },
    { id: 'catalog' as TabId, icon: '📚', title: 'Catalog' },
    { id: 'sceneGraph' as TabId, icon: '🌲', title: 'Scene Graph' }
  ];

  // Panel state
  let activeTab = $state<TabId>('document');

  // Handle tab click
  function handleTabClick(tab: TabId) {
    activeTab = tab;
  }

  // Handle document creation
  function handleDocumentCreated() {
    createDocument();
    activeTab = 'sceneGraph';
  }

  onMount(() => {
    const unregisterObserver = documentContext.registerObserver({
      onDocumentChanged: (document) => {
        if (document) {
          activeTab = 'sceneGraph';
        }
      }
    });

    return () => {
      unregisterObserver();
    };
  });
</script>

<div class="sidebar">
  <div class="tab-buttons">
    {#each tabs as tab}
      <button 
        class="tab-button" 
        class:active={activeTab === tab.id}
        onclick={() => handleTabClick(tab.id)} 
        title={tab.title}
      >
        <span class="icon">{tab.icon}</span>
      </button>
    {/each}
  </div>
  
  <div class="tab-content">
    {#if activeTab === 'document'}
      <div class="panel-header">Document</div>
      <DocumentPanel 
        onCreateDocument={handleDocumentCreated}
        onOpenDocument={openDocument}
      />
    {:else if activeTab === 'catalog'}
      <div class="panel-header">Catalog</div>
      <CatalogPanel />
    {:else if activeTab === 'sceneGraph'}
      <div class="panel-header">Scene Graph</div>
      <SceneGraphPanel />
    {/if}
  </div>
</div>

<style>
  .sidebar {
    display: flex;
    height: 100%;
    background-color: #252526;
    color: #cccccc;
  }
  
  .tab-buttons {
    display: flex;
    flex-direction: column;
    width: 48px;
    background-color: #333333;
    padding-top: 10px;
  }
  
  .tab-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
    background: none;
    border: none;
    color: #cccccc;
    cursor: pointer;
    font-size: 1.2rem;
    outline: none;
    position: relative;
    padding: 0;
  }
  
  .tab-button.active {
    color: #ffffff;
  }
  
  .tab-button.active::before {
    content: "";
    position: absolute;
    left: 0;
    height: 100%;
    width: 2px;
    background-color: #007acc;
  }
  
  .tab-content {
    width: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  
  .panel-header {
    font-size: 1rem;
    font-weight: bold;
    padding: 8px 16px;
    background-color: #2d2d2d;
    border-bottom: 1px solid #1e1e1e;
  }
</style>