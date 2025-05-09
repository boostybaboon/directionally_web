<script lang="ts">
  import { CatalogItemType } from '$lib/core/types/CatalogItemType';
  import { StandardCatalogBuilder } from '$lib/core/catalog/StandardCatalogBuilder';
  import { documentService } from '$lib/stores/DocumentService';
  import TreeView from '$lib/components/common/TreeView.svelte';
  import type { TreeNode } from '$lib/components/common/TreeView.svelte';
  
  // Create a standard catalog
  const catalogBuilder = new StandardCatalogBuilder();
  const catalog = catalogBuilder.build();
  
  // Create catalog tree structure from actual catalog items
  const meshes = catalog.getItemsByType(CatalogItemType.Mesh);
  const lights = catalog.getItemsByType(CatalogItemType.Light);
  const cameras = catalog.getItemsByType(CatalogItemType.Camera);
  
  const catalogData: TreeNode[] = [
    {
      id: 'meshes',
      label: 'Meshes',
      icon: '📦',
      children: meshes.map(item => ({
        id: item.id,
        label: item.name,
        data: { catalogItem: item }
      }))
    },
    {
      id: 'lights',
      label: 'Lights',
      icon: '💡',
      children: lights.map(item => ({
        id: item.id,
        label: item.name,
        data: { catalogItem: item }
      }))
    },
    {
      id: 'cameras',
      label: 'Cameras',
      icon: '📷',
      children: cameras.map(item => ({
        id: item.id,
        label: item.name,
        data: { catalogItem: item }
      }))
    }
  ];

  // Set TreeView options
  const treeOptions = {
    selectable: true,
    multiSelect: false,
    initialExpanded: ['meshes', 'lights', 'cameras'] // Expand all categories by default
  };
  
  // Handle item selection
  function handleSelect(event: CustomEvent) {
    const { currentNode } = event.detail;
    if (currentNode && !currentNode.children && currentNode.data?.catalogItem) {
      const item = currentNode.data.catalogItem;
      const commandExecutor = documentService.commandExecutor;
      
      // Check if we have an active document
      if (commandExecutor) {
        // Create the command and execute it
        const command = item.createCommand();
        commandExecutor.execute(command);
        documentService.markAsModified();
        
        // Provide feedback
        console.log(`Added ${item.name} to scene`);
      } else {
        // No active document
        alert('Please create a new document first');
      }
    }
  }
  
  let searchTerm = '';
  
  // Filter catalog items based on search term
  function filterCatalog(nodes: TreeNode[], term: string): TreeNode[] {
    if (!term) return nodes;
    
    return nodes
      .map(node => {
        if (node.label.toLowerCase().includes(term.toLowerCase())) {
          return node;
        }
        
        if (node.children) {
          const filteredChildren = filterCatalog(node.children, term);
          if (filteredChildren.length > 0) {
            return {
              ...node,
              children: filteredChildren
            };
          }
        }
        
        return null;
      })
      .filter((node): node is TreeNode => node !== null);
  }
  
  $: filteredCatalog = filterCatalog(catalogData, searchTerm);
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
    <TreeView 
      nodes={filteredCatalog} 
      options={treeOptions}
      onselect={handleSelect}
    />
  </div>
</div>

<style>
  .catalog-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .catalog-search {
    padding: 16px;
    border-bottom: 1px solid #1e1e1e;
  }
  
  .catalog-search input {
    width: 100%;
    padding: 6px;
    background-color: #3c3c3c;
    border: none;
    border-radius: 2px;
    color: #cccccc;
    font-size: 0.9rem;
  }
  
  .catalog-content {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }
</style>