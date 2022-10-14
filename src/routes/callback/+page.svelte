<script lang="ts">
  import { goto } from "$app/navigation";

  import { page } from "$app/stores";
  import { connections } from "$lib/model/connections";
  // import { getUserId } from "$lib/prefetch";
  import { onDestroy } from "svelte";

  const parsedHash = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  );

  const accessToken = parsedHash.get("access_token");
  const source = $page.url.searchParams.get("source");
  if (accessToken && source) $connections[source] = accessToken;

  let time: number = 5;
  let interval: NodeJS.Timer;

  onDestroy(() => clearInterval(interval));

  async function setConnection() {
    if (accessToken && source) {
      $connections[`${source}-userId`] = // await getUserId(accessToken)
        // TODO: get user id
        "123456789".toString();
      console.log($connections[`${source}-userId`]);
    }

    if ($page.routeId === "callback") {
      interval = setInterval(() => {
        time -= 1;
        if (time <= 0) {
          goto("/", { replaceState: true });
        }
      }, 1000);
    }

    // TODO: Change this to only remove recommended anime, need to change how animes are stored
    window?.sessionStorage.removeItem("frontPage");
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
    min-height: 80vh;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
