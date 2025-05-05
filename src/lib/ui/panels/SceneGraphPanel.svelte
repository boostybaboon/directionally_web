<script lang="ts">
  import TreeView from '$lib/ui/components/TreeView.svelte';
  import type { TreeNode } from '$lib/ui/components/TreeView.svelte';
  import { DocumentService } from '../stores/DocumentStore';
  import * as THREE from 'three';
  
  // Subscribe to the scene viewer
  let sceneViewer: any = null;
  let sceneGraph: TreeNode[] = [];
  let treeOptions = {
    selectable: true,
    multiSelect: false,
    initialExpanded: ['scene'] // Expand scene node by default
  };

  // Subscribe to the sceneViewer
  DocumentService.sceneViewer.subscribe(viewer => {
    sceneViewer = viewer;
    updateSceneGraph();
  });
  
  // Convert the scene hierarchy to a TreeNode structure
  function updateSceneGraph() {
    if (!sceneViewer) {
      sceneGraph = []; // No scene, empty graph
      return;
    }
    
    // Get the Three.js scene
    const scene = sceneViewer.getScene?.() as THREE.Scene;
    
    if (!scene) {
      sceneGraph = [];
      return;
    }
    
    // Create the root node
    sceneGraph = [{
      id: 'scene',
      label: 'Scene',
      icon: '🌍',
      children: scene.children.map(buildNodeFromObject3D)
    }];
  }
  
  function buildNodeFromObject3D(object: THREE.Object3D, index = 0): TreeNode {
    // Generate a unique ID for the node
    const id = `${object.type.toLowerCase()}_${object.id || index}`;
    
    // Determine icon based on object type
    let icon = '📦'; // Default icon
    if (object instanceof THREE.Light) {
      icon = '💡';
    } else if (object instanceof THREE.Camera) {
      icon = '📷';
    } else if (object instanceof THREE.Mesh) {
      icon = '📦';
    }
    
    // Create the node
    const node: TreeNode = {
      id,
      label: object.name || object.type,
      icon,
      data: { object }
    };
    
    // Add children if any
    if (object.children && object.children.length > 0) {
      node.children = object.children.map((child, idx) => 
        buildNodeFromObject3D(child, idx)
      );
    }
    
    return node;
  }
  
  // Expand/collapse functionality
  function expandAll() {
    if (!sceneGraph || sceneGraph.length === 0) return;
    
    const allNodeIds = getAllNodeIds(sceneGraph);
    treeOptions = {
      ...treeOptions,
      initialExpanded: allNodeIds
    };
  }

  function collapseAll() {
    treeOptions = {
      ...treeOptions,
      initialExpanded: []
    };
  }

  function refreshSceneGraph() {
    updateSceneGraph();
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
    if (currentNode && currentNode.data && currentNode.data.object) {
      const object = currentNode.data.object as THREE.Object3D;
      console.log('Selected object:', object);
      // Here you could dispatch an event or call a service to show properties
      // in the RightSidebar
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
    {#if sceneGraph.length === 0}
      <div class="empty-state">No scene available. Create a new document first.</div>
    {:else}
      <TreeView 
        nodes={sceneGraph} 
        options={treeOptions}
        on:select={handleSelect}
      />
    {/if}
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
  
  .empty-state {
    padding: 16px;
    color: #888888;
    font-style: italic;
    text-align: center;
  }
</style>