<script lang="ts">
  import TreeView from '$lib/ui/components/TreeView.svelte';
  import type { TreeNode } from '$lib/ui/components/TreeView.svelte';
  
  // Mock scene graph data - this would normally come from your actual scene
  // and would be updated as the scene changes
  const sceneGraphData: TreeNode[] = [
    {
      id: 'scene',
      label: 'Scene',
      icon: '🌍',
      children: [
        { 
          id: 'cube', 
          label: 'Cube', 
          icon: '📦',
          data: { type: 'mesh' } 
        },
        { 
          id: 'directional_light', 
          label: 'Directional Light', 
          icon: '💡',
          data: { type: 'light' } 
        },
        { 
          id: 'main_camera', 
          label: 'Main Camera', 
          icon: '📷',
          data: { type: 'camera' } 
        }
      ]
    }
  ];

  // TreeView options
  const treeOptions = {
    selectable: true,
    multiSelect: false,
    initialExpanded: ['scene'] // Expand scene node by default
  };

  // Expand/collapse all functionality
  function expandAll() {
    const allNodeIds = getAllNodeIds(sceneGraphData);
    treeOptions.initialExpanded = allNodeIds;
  }

  function collapseAll() {
    treeOptions.initialExpanded = [];
  }

  function refreshSceneGraph() {
    // In a real implementation, this would refresh the scene graph data
    // from the actual Scene object
    alert('Refreshing scene graph...');
  }

  // Recursive function to get all node IDs
  function getAllNodeIds(nodes: TreeNode[]): string[] {
    const ids: string[] = [];
    
    function collectIds(node: TreeNode) {
      ids.push(node.id);
      if (node.children) {
        node.children.forEach(child => collectIds(child));
      }
    }
    
    nodes.forEach(node => collectIds(node));
    return ids;
  }
  
  // Handle selection
  function handleSelect(event: CustomEvent) {
    const { currentNode } = event.detail;
    if (currentNode) {
      alert(`Selected ${currentNode.label}`);
    }
  }
</script>

<div class="scene-graph-panel">
  <div class="panel-toolbar">
    <button class="tool-button" title="Refresh Scene Graph" on:click={refreshSceneGraph}>🔄</button>
    <button class="tool-button" title="Expand All" on:click={expandAll}>📂</button>
    <button class="tool-button" title="Collapse All" on:click={collapseAll}>📁</button>
  </div>
  
  <div class="tree-container">
    <TreeView 
      nodes={sceneGraphData} 
      options={treeOptions}
      on:select={handleSelect}
    />
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
  
  .tool-button:hover {
    background-color: #4c4c4c;
  }
  
  .tree-container {
    padding: 16px;
    overflow-y: auto;
    flex: 1;
  }
</style>