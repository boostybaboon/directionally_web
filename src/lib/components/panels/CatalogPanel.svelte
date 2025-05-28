<script lang="ts">
  import { getContext } from 'svelte';
  import { getCatalogManager } from '$core';
  import type { CatalogItem } from '$core/interfaces/Catalog';
  import type { DocumentContext } from '$lib/types/DocumentContext';

  // Get document context
  const documentContext = getContext<DocumentContext>('document');

  // Get the standard catalog
  const catalogManager = getCatalogManager();
  const catalog = catalogManager.getStandardCatalog();

  // Search state
  let searchTerm = '';
  
  // Track expanded state of categories
  let expandedCategories: Record<string, boolean> = {};
  
  // Toggle category expansion
  function toggleCategory(category: string) {
    expandedCategories[category] = !expandedCategories[category];
    expandedCategories = expandedCategories; // trigger reactivity
  }

  // Group items by category
  $: itemsByCategory = catalog.getItems().reduce((acc, item) => {
    const category = item.metadata.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  // Filter items based on search
  $: filteredItems = searchTerm 
    ? catalog.getItems().filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : catalog.getItems();

  // Group filtered items by category
  $: filteredItemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.metadata.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  // Handle item click
  function handleItemClick(item: CatalogItem) {
    if (documentContext.currentDocument) {
      const command = item.createCommand();
      documentContext.currentDocument.commandExecutor.execute(command);
    } else {
      // No active document
    }
  }

  // Prevent click propagation for insert button
  function handleInsertClick(event: MouseEvent, item: CatalogItem) {
    event.stopPropagation();
    handleItemClick(item);
  }
</script>

<div class="catalog-panel">
  <div class="catalog-search">
    <input 
      type="text" 
      placeholder="Search catalog..." 
      bind:value={searchTerm}
    />
  </div>

  <div class="catalog-content">
    {#each Object.entries(filteredItemsByCategory) as [category, items]}
      <div class="catalog-section">
        <div 
          class="category-header" 
          onclick={() => toggleCategory(category)}
          onkeydown={(e) => e.key === 'Enter' && toggleCategory(category)}
          role="button"
          tabindex="0"
        >
          <span class="category-name">{category}</span>
          <span class="expand-icon">{expandedCategories[category] ? '▼' : '▶'}</span>
        </div>
        {#if expandedCategories[category]}
          <div class="catalog-items">
            {#each (items as CatalogItem[]) as item}
              {@const typedItem = item as CatalogItem}
              <div 
                class="catalog-item" 
                role="button"
                tabindex="0"
              >
                <div class="item-content">
                  <span class="item-name">{typedItem.name}</span>
                  <span class="item-description">{typedItem.metadata.description}</span>
                </div>
                <button 
                  class="insert-button"
                  onclick={(e) => handleInsertClick(e, typedItem)}
                  title="Insert item"
                >
                  +
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .catalog-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .catalog-search {
    padding: 1rem;
    border-bottom: 1px solid #333;
  }

  .catalog-search input {
    width: 100%;
    padding: 0.5rem;
    background-color: #222;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
  }

  .catalog-content {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .catalog-section {
    margin-bottom: 1rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #2a2a2a;
    border-radius: 4px;
    margin-bottom: 0.25rem;
    cursor: pointer;
    user-select: none;
  }

  .category-header:hover {
    background-color: #333;
  }

  .category-name {
    font-size: 0.9rem;
    color: #ccc;
    font-weight: 500;
  }

  .expand-icon {
    margin-left: auto;
    font-size: 0.8rem;
    color: #888;
  }

  .catalog-items {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 1rem;
  }

  .catalog-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .catalog-item:hover {
    background-color: #333;
  }

  .item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-size: 0.85rem;
    color: #fff;
  }

  .item-description {
    font-size: 0.75rem;
    color: #888;
    margin-top: 0.25rem;
  }

  .insert-button {
    background: none;
    border: none;
    color: #888;
    font-size: 1.2rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    border-radius: 4px;
    opacity: 0;
    transition: all 0.2s;
  }

  .catalog-item:hover .insert-button {
    opacity: 1;
  }

  .insert-button:hover {
    background-color: #444;
    color: #fff;
  }
</style>