<script lang="ts">
  import { onMount } from 'svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import MainContent from './MainContent.svelte';
  import RightSidebar from './RightSidebar.svelte';
  import Toolbar from './Toolbar.svelte';
  import { setupKeyboardShortcuts } from '$lib/ui/keyboard/KeyboardShortcuts';

  onMount(() => {
    setupKeyboardShortcuts();
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