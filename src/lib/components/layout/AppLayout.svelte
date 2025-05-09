<script lang="ts">
  import LeftSidebar from './LeftSidebar.svelte';
  import MainContent from './MainContent.svelte';
  import RightSidebar from './RightSidebar.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    documentCreated: { documentId: string };
  }>();

  let mainContent: MainContent;

  function handleDocumentCreated(event: CustomEvent<{ documentId: string }>) {
    console.log('AppLayout: handleDocumentCreated called with id:', event.detail.documentId);
    // Call MainContent's handler directly
    mainContent.handleDocumentCreated(event);
  }
</script>

<div class="app-layout">
  <LeftSidebar on:documentCreated={handleDocumentCreated} />
  <MainContent bind:this={mainContent} />
  <RightSidebar />
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>