<script lang="ts">
  export let title: string;
  export let description: string | undefined = undefined;
</script>

<div class="container" id={$$props.id ?? ""}>
  <div class="title">
    <h2>{title}</h2>
    {#if description}
      <p>{description}</p>
    {/if}
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .container {
    width: 100%;
    border: 1px var(--tertiary-color) solid;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  .title {
    background-color: var(--primary-color);
    padding: 1.5rem 2rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    background-color: var(--secondary-color);
    border-top: 1px var(--tertiary-color) solid;
    padding: 2rem;
  }

  h2 {
    margin: 0 0 0.5rem;
    font-weight: bold;
  }

  p {
    color: var(--tertiary-color);
  }
</style>
