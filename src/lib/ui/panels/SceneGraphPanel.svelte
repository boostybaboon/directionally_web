<script lang="ts">
  // Temporarily commenting out TreeView import to test tab switching
  // import TreeView from '$lib/ui/components/TreeView.svelte';
  // import type { TreeNode } from '$lib/ui/components/TreeView.svelte';
  
  console.log('SceneGraphPanel mounted');
</script>

<div class="scene-graph-panel">
  <div class="panel-toolbar">
    <button class="tool-button" title="Refresh Scene Graph">🔄</button>
    <button class="tool-button" title="Expand All">📂</button>
    <button class="tool-button" title="Collapse All">📁</button>
  </div>
  
  <!-- Simple placeholder content instead of TreeView to test tab switching -->
  <div class="tree-container">
    <div class="scene-node">
      <div class="node-title">Scene</div>
      <div class="scene-children">
        <div class="scene-node">Cube</div>
        <div class="scene-node">Directional Light</div>
        <div class="scene-node">Main Camera</div>
      </div>
    </div>
  </div>
</div>

<style>
  .scene-graph-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .panel-toolbar {
    display: flex;
    padding: 8px;
    border-bottom: 1px solid #1e1e1e;
  }
  
  .tool-button {
    width: 28px;
    height: 28px;
    margin-right: 4px;
    background-color: #3c3c3c;
    border: none;
    border-radius: 2px;
    color: #cccccc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .tree-container {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }
  
  .scene-node {
    margin-bottom: 8px;
  }
  
  .node-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .scene-children {
    padding-left: 16px;
  }
</style>