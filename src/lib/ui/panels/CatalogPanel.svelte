<script lang="ts">
  import { CatalogItemType } from '$lib/core/types/CatalogItemType';
  // Temporarily commenting out TreeView import to test tab switching
  // import TreeView from '$lib/ui/components/TreeView.svelte';
  // import type { TreeNode } from '$lib/ui/components/TreeView.svelte';
  
  console.log('CatalogPanel mounted');
</script>

<div class="catalog-panel">
  <div class="catalog-search">
    <input type="text" placeholder="Search catalog..." />
  </div>
  
  <!-- Simple placeholder content instead of TreeView to test tab switching -->
  <div class="catalog-content">
    <h3>Meshes</h3>
    <ul>
      <li>Cube</li>
      <li>Sphere</li>
      <li>Plane</li>
    </ul>
    
    <h3>Lights</h3>
    <ul>
      <li>Directional Light</li>
      <li>Point Light</li>
      <li>Ambient Light</li>
    </ul>
    
    <h3>Cameras</h3>
    <ul>
      <li>Perspective Camera</li>
    </ul>
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
  }
  
  h3 {
    font-size: 0.9rem;
    margin: 16px 0 8px 0;
  }
  
  ul {
    list-style-type: none;
    padding-left: 16px;
    margin: 0;
  }
  
  li {
    padding: 4px 0;
    font-size: 0.9rem;
  }
</style>