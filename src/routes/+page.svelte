<script>
  let count = $state(0);
  
  function increment() {
    count = count + 1;
  }
  
  function decrement() {
    count = count - 1;
  }
</script>

<main class="container">
  <h1>Welcome to Svelte 5</h1>
  
  <div class="counter">
    <h2>Counter Example</h2>
    <p>Current count: {count}</p>
    <div class="buttons">
      <button onclick={decrement}>-</button>
      <button onclick={increment}>+</button>
    </div>
  </div>
</main>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    color: #ff3e00;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .counter {
    background: #f4f4f4;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.2s;
  }

  button:hover {
    background: #ff6a3d;
  }
</style>
