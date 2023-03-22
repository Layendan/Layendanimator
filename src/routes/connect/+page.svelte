<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { connections } from '$lib/model/connections';

  function redirect() {
    goto('/settings', { replaceState: true });
  }

  const authToken = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  ).get('access_token');
  const source = $page.url.searchParams.get('source');

  if (authToken && source) {
    switch (source) {
      default:
        connections.add(source, authToken);
        console.log('Added Connection', source, authToken);
        redirect();
        break;
    }
  } else {
    console.error('Invalid connection attempt');
    redirect();
  }
</script>
