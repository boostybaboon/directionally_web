<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { viewService } from '$lib/stores/ViewStore.svelte';
  import { documentService } from '$lib/stores/DocumentStore.svelte';
  import type { View } from '$lib/stores/ViewStore.svelte';
  import type { Scene } from '$lib/core/Scene';
  import WelcomeView from '../views/WelcomeView.svelte';
  import View3D from '../views/View3D.svelte';
  
  // Subscribe to view store
  let views: View[] = [];
  let activeViewId: string | null = null;
  
  const unsubscribe = viewService.subscribe(state => {
    views = state.views;
    activeViewId = state.activeViewId;
  });
  
  // Handle document creation
  function handleDocumentCreated(event: CustomEvent<{scene: Scene}>) {
    const { scene } = event.detail;
    documentService.createEmptyScene(scene);
    
    // Create a new 3D view
    viewService.addView({
      title: 'Scene View',
      type: 'view3d',
      data: { scene }
    });
  }
  
  // Handle tab click
  function handleTabClick(viewId: string) {
    viewService.setActiveView(viewId);
  }
  
  // Handle tab close
  function handleTabClose(viewId: string, event: MouseEvent) {
    event.stopPropagation();
    viewService.removeView(viewId);
  }
  
  // Clean up
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="main-content">
  <div class="view-tabs" role="tablist">
    {#each views as view}
      <div 
        class="tab" 
        class:active={view.id === activeViewId}
        on:click={() => handleTabClick(view.id)}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTabClick(view.id);
          }
        }}
        role="tab"
        aria-selected={view.id === activeViewId}
        tabindex={view.id === activeViewId ? 0 : -1}
      >
        <span class="tab-title">{view.title}</span>
        {#if view.id !== 'welcome'}
          <button 
            class="close-button"
            on:click={(e) => handleTabClose(view.id, e)}
            title="Close"
            type="button"
          >
            ×
          </button>
        {/if}
      </div>
    {/each}
  </div>
  
  <div class="view-container">
    {#each views as view}
      <div 
        class="view" 
        class:active={view.id === activeViewId}
      >
        {#if view.type === 'welcome'}
          <WelcomeView />
        {:else if view.type === 'view3d'}
          <View3D 
            scene={view.data.scene} 
          />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    color: #cccccc;
    overflow: hidden;
  }
  
  .view-tabs {
    display: flex;
    background-color: #252526;
    border-bottom: 1px solid #333333;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  .view-tabs::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  .tab {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #2d2d2d;
    border-right: 1px solid #333333;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  
  .tab.active {
    background-color: #1e1e1e;
    border-bottom: 2px solid #007acc;
  }
  
  .tab-title {
    margin-right: 8px;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #888888;
    font-size: 1.2rem;
    padding: 0 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }
  
  .close-button:hover {
    background-color: #333333;
    color: #ffffff;
  }
  
  .view-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
  }
  
  .view.active {
    display: block;
  }
</style>