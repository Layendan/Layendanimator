<main>
  <slot />
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    color: white;

    transition: all 0.2s ease-in-out;
  }

  @media (min-width: 480px) {
  }
</style>
