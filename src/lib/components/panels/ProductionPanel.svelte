<script lang="ts">
  import { getContext } from 'svelte';
  import type { ProductionContext } from '$lib/types/ProductionContext';

  // Get production context
  const productionContext = getContext<ProductionContext>('production');
  const { createProduction: createProduction, openProduction: openProduction } = productionContext;
</script>

<div class="production-panel">
  <div class="action-section">
    <h3>Production Actions</h3>
    <button class="action-button" onclick={createProduction}>
      <span class="icon">📝</span> Default Production
    </button>
    
    <button class="action-button" onclick={openProduction}>
      <span class="icon">📂</span> Open Production
    </button>
  </div>
  
  <div class="recent-productions">
    <h3>Recent Productions</h3>
    <div class="empty-state">No recent productions</div>
  </div>
</div>

<style>
  .production-panel {
    padding: 16px;
  }
  
  h3 {
    font-size: 0.9rem;
    margin: 0 0 12px 0;
    color: #cccccc;
  }
  
  .action-section {
    margin-bottom: 24px;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #3c3c3c;
    color: #cccccc;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    text-align: left;
    font-size: 0.9rem;
  }
  
  .action-button:hover {
    background-color: #4c4c4c;
  }
  
  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .icon {
    margin-right: 8px;
    font-size: 1rem;
  }
  
  .recent-productions {
    color: #cccccc;
  }
  
  .empty-state {
    color: #888888;
    font-style: italic;
    padding: 12px 0;
  }
</style>