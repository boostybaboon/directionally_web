<script lang="ts">
  import { CatalogManager } from '$lib/core/CatalogManager';
  import type { CatalogItem } from '$lib/core/interfaces/Catalog';
  import { documentStore } from '$lib/stores/DocumentStore';

  // Get the standard catalog
  const catalogManager = CatalogManager.getInstance();
  const catalog = catalogManager.getStandardCatalog();

  // Search state
  let searchTerm = '';

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
    const scene = $documentStore.activeDocument?.scene;
    
    if (scene) {
      // Create the command and execute it
      const command = item.createCommand();
      scene.execute(command);
      documentStore.markAsModified();
      
      // Provide feedback
      console.log(`Added ${item.name} to scene`);
    } else {
      // No active document
      alert('Please create a new document first');
    }
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
        <h3>
          <span class="category-icon">{items[0].metadata.icon}</span>
          {category}
        </h3>
        <div class="catalog-items">
          {#each items as item}
            <div 
              class="catalog-item" 
              on:click={() => handleItemClick(item)}
              on:keydown={(e) => e.key === 'Enter' && handleItemClick(item)}
              role="button"
              tabindex="0"
            >
              <div class="item-preview">
                <!-- TODO: Add preview rendering -->
              </div>
              <div class="item-name">{item.name}</div>
              <div class="item-description">{item.metadata.description}</div>
            </div>
          {/each}
        </div>
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
    padding: 1rem;
  }

  .catalog-section {
    margin-bottom: 1.5rem;
  }

  .catalog-section h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #888;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1.2rem;
  }

  .catalog-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }

  .catalog-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #333;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .catalog-item:hover {
    background-color: #333;
  }

  .item-preview {
    width: 64px;
    height: 64px;
    background-color: #222;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }

  .item-name {
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 0.25rem;
  }

  .item-description {
    font-size: 0.7rem;
    color: #888;
    text-align: center;
  }
</style>