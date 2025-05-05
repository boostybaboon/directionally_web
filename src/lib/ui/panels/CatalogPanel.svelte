<script lang="ts">
  import { CatalogItemType } from '$lib/core/types/CatalogItemType';
  // Import TreeView and its types
  import TreeView from '$lib/ui/components/TreeView.svelte';
  import type { TreeNode } from '$lib/ui/components/TreeView.svelte';
  
  // Create catalog tree structure
  const catalogData: TreeNode[] = [
    {
      id: 'meshes',
      label: 'Meshes',
      icon: '📦',
      children: [
        { id: 'cube', label: 'Cube', data: { type: CatalogItemType.Mesh } },
        { id: 'sphere', label: 'Sphere', data: { type: CatalogItemType.Mesh } },
        { id: 'plane', label: 'Plane', data: { type: CatalogItemType.Mesh } }
      ]
    },
    {
      id: 'lights',
      label: 'Lights',
      icon: '💡',
      children: [
        { id: 'directional_light', label: 'Directional Light', data: { type: CatalogItemType.Light } },
        { id: 'point_light', label: 'Point Light', data: { type: CatalogItemType.Light } },
        { id: 'ambient_light', label: 'Ambient Light', data: { type: CatalogItemType.Light } }
      ]
    },
    {
      id: 'cameras',
      label: 'Cameras',
      icon: '📷',
      children: [
        { id: 'perspective_camera', label: 'Perspective Camera', data: { type: CatalogItemType.Camera } }
      ]
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
    if (currentNode && !currentNode.children) {
      // Only trigger alert for leaf nodes (actual catalog items, not categories)
      alert(`Inserting ${currentNode.label}`);
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
      on:select={handleSelect}
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