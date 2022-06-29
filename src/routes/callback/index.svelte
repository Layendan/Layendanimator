<script>
  import { page } from "$app/stores";
  import { settings } from "$lib/model/settings";

  const parsedHash = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  );
  console.log(parsedHash.toString());
  let access_token = parsedHash.get("access_token");
  console.log($page.url.host);
  settings.set({
    ...$settings,
    connections: {
      [$page.url.host]: {
        name: $page.url.host,
        id: access_token,
      },
    },
  });
  //   console.log(access_token);
</script>

<main>
  {#if access_token}
    Successfully Linked
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
</style>
