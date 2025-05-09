<script lang="ts">
  // Placeholder for properties panel
  let visible = true;
  
  function toggleVisibility() {
    visible = !visible;
  }
  
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleVisibility();
    }
  }
</script>

<div class="right-sidebar" class:collapsed={!visible}>
  <button 
    class="sidebar-toggle" 
    onclick={toggleVisibility}
    onkeydown={handleKeyDown}
    aria-label={visible ? "Collapse panel" : "Expand panel"}
    type="button"
  >
    {visible ? '▶' : '◀'}
  </button>
  
  {#if visible}
    <div class="sidebar-content">
      <div class="panel-header">Properties</div>
      <div class="properties-placeholder">
        <p>Properties Panel</p>
        <p>Object properties will appear here</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .right-sidebar {
    width: 300px;
    background-color: #252526;
    color: #cccccc;
    position: relative;
    transition: width 0.2s ease-in-out;
  }
  
  .collapsed {
    width: 24px;
  }
  
  .sidebar-toggle {
    position: absolute;
    left: 0;
    top: 10px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333333;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    z-index: 10;
    border: none;
    color: #cccccc;
    padding: 0;
  }
  
  .sidebar-toggle:hover {
    background-color: #444444;
  }
  
  .sidebar-toggle:focus {
    outline: 1px solid #007acc;
  }
  
  .sidebar-content {
    height: 100%;
    overflow-y: auto;
  }
  
  .panel-header {
    font-size: 1rem;
    font-weight: bold;
    padding: 8px 16px;
    background-color: #2d2d2d;
    border-bottom: 1px solid #1e1e1e;
  }
  
  .properties-placeholder {
    padding: 16px;
    text-align: center;
    color: #888888;
  }
</style>