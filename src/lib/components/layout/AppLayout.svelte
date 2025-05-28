<script lang="ts">
  import { onMount } from 'svelte';
  import { setContext } from 'svelte';
  import MainContent from './MainContent.svelte';
  import LeftSidebar from './LeftSidebar.svelte';
  import RightSidebar from './RightSidebar.svelte';
  import Toolbar from './Toolbar.svelte';
  import { getProductionManager } from '$core';
  import type { Production } from '$core/interfaces/Production';
  import type { ProductionContext, ProductionObserver } from '$lib/types/ProductionContext'
  import { setupKeyboardShortcuts } from '$lib/ui/keyboard/KeyboardShortcuts';

  // Get production context
  const productionManager = getProductionManager();

  // Production state
  let currentProduction: Production | null = null;
  const observers: ProductionObserver[] = [];

  // Production actions
  function createProduction() {
    currentProduction = productionManager.createProduction();
    updateObservers();
  }

  function openProduction() {
    // TODO: Implement production deserialisation
  }

  function updateObservers() {
    observers.forEach(observer => observer.onProductionChanged(currentProduction));
  }

  function registerObserver(observer: ProductionObserver) {
    observers.push(observer);
    return () => {
      const index = observers.indexOf(observer);
      if (index !== -1) {
        observers.splice(index, 1);
      }
    };
  }

  // Create production context object
  const productionContextObject = {
    get currentProduction() { return currentProduction; },
    createProduction,
    openProduction,
    registerObserver
  };

  setContext<ProductionContext>('production', productionContextObject);

  onMount(() => {
    setupKeyboardShortcuts(productionContextObject);
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