<script lang="ts">
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import { connections } from "$lib/model/connections";
  import { getUserId } from "$lib/prefetch";
  import { onDestroy } from "svelte";

  const parsedHash = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  );

  const accessToken = parsedHash.get("access_token");
  const source = $page.url.searchParams.get("source");
  $connections[source] = accessToken;

  let time: number = 5;
  let interval: NodeJS.Timer;

  onDestroy(() => clearInterval(interval));

  async function setConnection() {
    $connections[`${source}-userId`] = (
      await getUserId(accessToken)
    ).toString();
    console.log($connections[`${source}-userId`]);

    if ($page.url.pathname === "/callback") {
      interval = setInterval(() => {
        time -= 1;
        if (time <= 0) {
          goto("/", { replaceState: true });
        }
      }, 1000);
    }
  }
</script>

<main>
  {#await setConnection() then}
    <div>
      <p>Successfully Linked!</p>
      <p>You will be redirected to the home page in {time} seconds.</p>
      <p>
        If it does not redirect you automatically, please press <a href="/"
          >this link</a
        >
      </p>
    </div>
  {:catch e}
    {e} <a href="/">Go Back</a>
  {/await}
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
