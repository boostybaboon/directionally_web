<script lang="ts">
  // No imports needed
</script>

<div class="welcome-view">
  <h1>Welcome to Directionally</h1>
  <p>Create a new scene to get started</p>
  <div class="welcome-features">
    <div class="feature">
      <h3>🎥 Camera Management</h3>
      <p>Create and manage multiple camera views for your scene</p>
    </div>
    <div class="feature">
      <h3>🌲 Scene Graph</h3>
      <p>Organize and manipulate your scene objects with ease</p>
    </div>
    <div class="feature">
      <h3>📚 Asset Catalog</h3>
      <p>Access and manage your scene assets in one place</p>
    </div>
  </div>
</div>

<style>
  .welcome-view {
    padding: 40px;
    color: #cccccc;
    text-align: center;
  }
  
  .welcome-view h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }
  
  .welcome-view p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #888888;
  }
  
  .welcome-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 900px;
    margin: 2rem auto 0;
  }
  
  .feature {
    background-color: #2d2d2d;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: left;
  }
  
  .feature h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }
  
  .feature p {
    font-size: 0.9rem;
    margin: 0;
    color: #888888;
  }
</style> 