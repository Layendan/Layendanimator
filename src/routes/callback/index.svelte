<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { connections } from "$lib/model/connections";

  const parsedHash = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  );

  const access_token = parsedHash.get("access_token");
  const source = $page.url.searchParams.get("source");

  if (!$connections[source]) {
    connections.set({ ...$connections, [source]: access_token });
  }

  setTimeout(() => {
    goto("/", { replaceState: true });
  }, 5000);
</script>

<main>
  {#if access_token}
    <div>
      <p>Successfully Linked!</p>
      <p>You will be redirected to the home page in 5 seconds.</p>
      <p>
        If it does not redirect you automatically, please press <a href="/"
          >this link</a
        >
      </p>
    </div>
  {:else}
    Failed to Link
  {/if}
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
