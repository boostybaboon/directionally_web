<script lang="ts">
  import LeftSidebar from './LeftSidebar.svelte';
  import MainContent from './MainContent.svelte';
  import RightSidebar from './RightSidebar.svelte';
</script>

<div class="app-layout">
  <LeftSidebar />
  <MainContent />
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