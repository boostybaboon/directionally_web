<script lang="ts">
  import TreeView from '$lib/components/common/TreeView.svelte';
  import type { TreeNode } from '$lib/components/common/TreeView.svelte';
  import { documentStore } from '$lib/stores/DocumentStore';
  import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
  import * as THREE from 'three';
  
  // Convert the scene hierarchy to a TreeNode structure
  function updateSceneGraph(sceneViewer: SceneViewer | null): TreeNode[] {
    if (!sceneViewer) {
      return []; // No scene, empty graph
    }
    
    // Get the Three.js scene
    const scene = sceneViewer.getScene();
    
    if (!scene) {
      return [];
    }
    
    // Create the root node
    return [{
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
  function expandAll(nodes: TreeNode[]): string[] {
    if (!nodes || nodes.length === 0) return [];
    
    const allNodeIds: string[] = [];
    
    function collectIds(node: TreeNode) {
      allNodeIds.push(node.id);
      if (node.children) {
        node.children.forEach(child => collectIds(child));
      }
    }
    
    nodes.forEach(node => collectIds(node));
    return allNodeIds;
  }

  let treeOptions = {
    selectable: true,
    multiSelect: false,
    initialExpanded: ['scene'] // Expand scene node by default
  };
  
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

  // Reactive scene graph updates
  $: sceneGraph = updateSceneGraph($documentStore.activeDocument?.scene);
</script>

<div class="scene-graph-panel">
  <div class="panel-toolbar">
    <button 
      class="tool-button" 
      title="Expand All" 
      on:click={() => treeOptions = { ...treeOptions, initialExpanded: expandAll(sceneGraph) }}
    >
      📂
    </button>
    <button 
      class="tool-button" 
      title="Collapse All" 
      on:click={() => treeOptions = { ...treeOptions, initialExpanded: [] }}
    >
      📁
    </button>
  </div>
  
  <div class="tree-container">
    {#if sceneGraph.length === 0}
      <div class="empty-state">No scene available. Create a new document first.</div>
    {:else}
      <TreeView 
        nodes={sceneGraph} 
        options={treeOptions}
        onselect={handleSelect}
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