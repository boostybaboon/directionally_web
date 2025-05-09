<script lang="ts">
  import { onMount } from 'svelte';
  import { viewService } from '$lib/stores/ViewStore.svelte';
  import WelcomeView from '../views/WelcomeView.svelte';
  import View3D from '../views/View3D.svelte';
  import type { View, ViewState } from '$lib/stores/ViewStore.svelte';
  import { onDocumentCreated } from '$lib/stores/DocumentStore.svelte';
  import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

  // View state
  let views = $state<View[]>([]);
  let activeViewId = $state<string | null>(null);

  // Initialize views
  onMount(() => {
    const unsubscribe = viewService.subscribe((state: ViewState) => {
      views = state.views;
      activeViewId = state.activeViewId;
    });
    return unsubscribe;
  });

  // Handle tab click
  function handleTabClick(viewId: string) {
    viewService.setActiveView(viewId);
  }

  // Handle tab close
  function handleTabClose(viewId: string, event: MouseEvent) {
    event.stopPropagation();
    viewService.removeView(viewId);
  }

  // Subscribe to document creation
  onDocumentCreated((document: DocumentInterfaces) => {
    console.log('MainContent: document created:', $inspect(document));

    const cameraViews = document.sceneViewer.getCameraViews();
    console.log('MainContent: cameraViews:', $inspect(cameraViews));

    // Create a new 3D view for the document
    const viewId = viewService.addView({
      type: 'view3d',
      title: '3D View',
      closable: true,
      data: {
        scene: document.sceneViewer,
        cameraViews: cameraViews
      }
    });
    console.log('MainContent: created view with id:', viewId);
    viewService.setActiveView(viewId);
  });
</script>

<div class="main-content">
  <div class="view-tabs" role="tablist">
    {#each views as view}
      <div 
        class="tab" 
        class:active={view.id === activeViewId}
        onclick={() => handleTabClick(view.id)}
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTabClick(view.id);
          }
        }}
        role="tab"
        aria-selected={view.id === activeViewId}
        tabindex={view.id === activeViewId ? 0 : -1}
      >
        <div class="tab-content">
          <span class="tab-title">{view.title}</span>
          {#if view.closable}
            <button 
              class="close-button"
              onclick={(e) => handleTabClose(view.id, e)}
              title="Close"
              type="button"
            >
              ×
            </button>
          {/if}
        </div>
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
            cameraViews={view.data.cameraViews}
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
  }
  
  .view-tabs {
    display: flex;
    background-color: #2d2d2d;
    border-bottom: 1px solid #1e1e1e;
    overflow-x: auto;
    scrollbar-width: none;
  }
  
  .view-tabs::-webkit-scrollbar {
    display: none;
  }
  
  .tab {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #2d2d2d;
    color: #cccccc;
    cursor: pointer;
    user-select: none;
    border-right: 1px solid #1e1e1e;
    min-width: 120px;
    max-width: 200px;
  }
  
  .tab.active {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  
  .tab-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
  }
  
  .tab-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 8px;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #cccccc;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-button:hover {
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
    width: 100%;
    height: 100%;
    display: none;
  }
  
  .view.active {
    display: block;
  }
</style>