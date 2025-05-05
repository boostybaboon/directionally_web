<script context="module" lang="ts">
  export interface TreeNode {
    id: string;
    label: string;
    icon?: string; 
    children?: TreeNode[];
    data?: any; // Optional data payload for the node
  }
  
  export interface TreeViewOptions {
    selectable?: boolean;
    multiSelect?: boolean;
    initialExpanded?: string[];
  }
</script>

<script lang="ts">
  // Props
  export let nodes: TreeNode[] = [];
  export let options: TreeViewOptions = {
    selectable: true,
    multiSelect: false,
    initialExpanded: []
  };
  export let onselect: ((event: CustomEvent) => void) | undefined = undefined;
  
  import { onDestroy } from 'svelte';
  
  // State
  let expandedNodes = new Set(options.initialExpanded || []);
  let selectedNodes = new Set<string>();
  
  // Reset internal state when nodes change completely
  // This helps prevent memory leaks and stale state when switching tabs
  $: {
    if (nodes) {
      // Only reset if this is a top-level tree (not a recursive child)
      if (nodes.length > 1) {
        // Keep the expanded state from options
        expandedNodes = new Set(options.initialExpanded || []);
      }
    }
  }
  
  // Clean up any listeners or state when component is destroyed
  onDestroy(() => {
    expandedNodes.clear();
    selectedNodes.clear();
  });
  
  // Methods
  function toggleExpanded(nodeId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    if (expandedNodes.has(nodeId)) {
      expandedNodes.delete(nodeId);
    } else {
      expandedNodes.add(nodeId);
    }
    expandedNodes = new Set([...expandedNodes]); // Force Svelte reactivity
  }
  
  function toggleSelected(nodeId: string, node: TreeNode) {
    if (!options.selectable) return;
    
    if (options.multiSelect) {
      if (selectedNodes.has(nodeId)) {
        selectedNodes.delete(nodeId);
      } else {
        selectedNodes.add(nodeId);
      }
      selectedNodes = new Set([...selectedNodes]); // Force Svelte reactivity
    } else {
      selectedNodes = new Set([nodeId]);
    }
    
    const event = new CustomEvent('select', {
      detail: { 
        nodeIds: [...selectedNodes], 
        nodes: nodes.filter(n => selectedNodes.has(n.id)),
        currentNode: node
      }
    });
    if (onselect) {
      onselect(event);
    }
    document.dispatchEvent(event);
  }
  
  function handleNodeKeyDown(event: KeyboardEvent, nodeId: string, node: TreeNode): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSelected(nodeId, node);
    }
  }
  
  function handleExpandKeyDown(event: KeyboardEvent, nodeId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded(nodeId, event);
    }
  }
</script>

<div class="tree-view">
  {#if nodes.length === 0}
    <div class="empty-state">
      <slot name="empty">
        No items available
      </slot>
    </div>
  {:else if nodes.length > 1}
    {#each nodes as node (node.id)}
      <div 
        class="tree-node"
        class:selected={selectedNodes.has(node.id)}
      >
        <div 
          class="node-content" 
          role="button"
          tabindex="0"
          onclick={() => toggleSelected(node.id, node)}
          onkeydown={(e) => handleNodeKeyDown(e, node.id, node)}
        >
          {#if node.children && node.children.length > 0}
            <button 
              class="expand-button" 
              onclick={(e) => toggleExpanded(node.id, e)}
              onkeydown={(e) => handleExpandKeyDown(e, node.id)}
              aria-label={expandedNodes.has(node.id) ? "Collapse" : "Expand"}
              aria-expanded={expandedNodes.has(node.id)}
            >
              {expandedNodes.has(node.id) ? '▼' : '►'}
            </button>
          {:else}
            <span class="spacer"></span>
          {/if}
          
          {#if node.icon}
            <span class="node-icon">{node.icon}</span>
          {/if}
          
          <span class="node-label">{node.label}</span>
        </div>
        
        {#if node.children && node.children.length > 0 && expandedNodes.has(node.id)}
          <div class="node-children">
            <svelte:self 
              nodes={node.children} 
              options={options}
              onselect={onselect}
            />
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    {@const node = nodes[0]}
    <div 
      class="tree-node"
      class:selected={selectedNodes.has(node.id)}
    >
      <div 
        class="node-content" 
        role="button"
        tabindex="0"
        onclick={() => toggleSelected(node.id, node)}
        onkeydown={(e) => handleNodeKeyDown(e, node.id, node)}
      >
        {#if node.children && node.children.length > 0}
          <button 
            class="expand-button" 
            onclick={(e) => toggleExpanded(node.id, e)}
            onkeydown={(e) => handleExpandKeyDown(e, node.id)}
            aria-label={expandedNodes.has(node.id) ? "Collapse" : "Expand"}
            aria-expanded={expandedNodes.has(node.id)}
          >
            {expandedNodes.has(node.id) ? '▼' : '►'}
          </button>
        {:else}
          <span class="spacer"></span>
        {/if}
        
        {#if node.icon}
          <span class="node-icon">{node.icon}</span>
        {/if}
        
        <span class="node-label">{node.label}</span>
      </div>
      
      {#if node.children && node.children.length > 0 && expandedNodes.has(node.id)}
        <div class="node-children">
          <svelte:self 
            nodes={node.children} 
            options={options}
            onselect={onselect}
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tree-view {
    user-select: none;
  }
  
  .tree-node {
    margin: 2px 0;
  }
  
  .node-content {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 2px;
    cursor: pointer;
  }
  
  .node-content:hover {
    background-color: #2a2a2a;
  }
  
  .node-content:focus {
    outline: 1px solid #007acc;
    background-color: #2a2a2a;
  }
  
  .selected > .node-content {
    background-color: #094771;
  }
  
  .node-children {
    margin-left: 16px;
  }
  
  .expand-button {
    width: 14px;
    height: 14px;
    font-size: 0.7rem;
    margin-right: 4px;
    color: #888888;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .expand-button:focus {
    outline: 1px solid #007acc;
  }
  
  .spacer {
    width: 14px;
    margin-right: 4px;
  }
  
  .node-icon {
    margin-right: 6px;
  }
  
  .node-label {
    font-size: 0.9rem;
  }
  
  .empty-state {
    padding: 16px;
    color: #888888;
    font-style: italic;
    text-align: center;
  }
</style>