<script lang="ts">
  import DocumentPanel from '../panels/DocumentPanel.svelte';
  import CatalogPanel from '../panels/CatalogPanel.svelte';
  import SceneGraphPanel from '../panels/SceneGraphPanel.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

  // Event dispatcher to communicate with parent components
  const dispatch = createEventDispatcher<{
    documentCreated: { document: DocumentInterfaces };
  }>();

  // Simple enum-like type for tab IDs
  type TabId = 'document' | 'catalog' | 'sceneGraph';
  
  // Tab definitions
  const tabs = [
    { id: 'document' as TabId, icon: '📄', title: 'Document' },
    { id: 'catalog' as TabId, icon: '📚', title: 'Catalog' },
    { id: 'sceneGraph' as TabId, icon: '🌲', title: 'Scene Graph' }
  ];
  
  // Active tab state
  let activeTab: TabId = 'document';
  
  // Simple function to switch tabs
  function switchTab(tabId: TabId) {
    console.log('Switching to tab:', tabId);
    activeTab = tabId;
  }
  
  // Handle document events from DocumentPanel
  function handleDocumentCreated(document: DocumentInterfaces) {
    console.log('LeftSidebar: handleDocumentCreated called with document:', document);
    
    // Forward the event to MainContent
    console.log('LeftSidebar: forwarding documentCreated event');
    dispatch('documentCreated', { document });
    
    // Switch to scene graph view after creating document
    switchTab('sceneGraph');
  }
</script>

<div class="sidebar">
  <div class="tab-buttons">
    {#each tabs as tab}
      <button 
        class="tab-button" 
        class:active={activeTab === tab.id}
        onclick={() => switchTab(tab.id)} 
        title={tab.title}
      >
        <span class="icon">{tab.icon}</span>
      </button>
    {/each}
  </div>
  
  <div class="tab-content">
    {#if activeTab === 'document'}
      <div class="panel-header">Document</div>
      <DocumentPanel onDocumentCreated={handleDocumentCreated} />
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