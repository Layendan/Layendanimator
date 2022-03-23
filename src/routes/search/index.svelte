<script lang="ts">
  import { page } from "$app/stores";

  let query: string = $page.url.searchParams.get("search")
    ? $page.url.searchParams.get("search")
    : "";

  // Have to listen to changes since the page does not reload
  page.subscribe(() => {
    query = $page.url.searchParams.get("search")
      ? $page.url.searchParams.get("search")
      : "";
  });
</script>

<main>
  {query}
</main>

<style>
  main {
    /* center div horizontally */
    margin: 0 auto;
    transform: translateY(3em);
    color: white;
  }
</style>
