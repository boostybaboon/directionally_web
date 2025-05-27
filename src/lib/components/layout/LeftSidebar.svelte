<script lang="ts">
  import { getContext } from 'svelte';
  import DocumentPanel from '../panels/DocumentPanel.svelte';
  import CatalogPanel from '../panels/CatalogPanel.svelte';
  import SceneGraphPanel from '../panels/SceneGraphPanel.svelte';
  import type { DocumentContext } from '$lib/types/document';
  import { onMount } from 'svelte';

  // Get document context
  const documentContext = getContext<DocumentContext>('document');

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
    <div class="panel-container">
      <div class="panel" class:active={activeTab === 'document'}>
        <div class="panel-header">Document</div>
        <div class="panel-body">
          <DocumentPanel />
        </div>
      </div>

      <div class="panel" class:active={activeTab === 'catalog'}>
        <div class="panel-header">Catalog</div>
        <div class="panel-body">
          <CatalogPanel />
        </div>
      </div>

      <div class="panel" class:active={activeTab === 'sceneGraph'}>
        <div class="panel-header">Scene Graph</div>
        <div class="panel-body">
          <SceneGraphPanel />
        </div>
      </div>
    </div>
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

  .tab-button:hover {
    color: #ffffff;
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
    overflow: hidden;
  }

  .panel-container {
    height: 100%;
    position: relative;
  }

  .panel {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    flex-direction: column;
  }

  .panel.active {
    display: flex;
  }

  .panel-header {
    font-size: 1rem;
    font-weight: bold;
    padding: 8px 16px;
    background-color: #2d2d2d;
    border-bottom: 1px solid #1e1e1e;
  }

  .panel-body {
    flex: 1;
    overflow-y: auto;
  }
</style>