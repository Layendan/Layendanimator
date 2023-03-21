<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { connections } from '$lib/model/connections';

  const parsedHash = new URLSearchParams(
    $page.url.hash.substring(1) // skip the first char (#)
  );

  const accessToken = parsedHash.get('access_token');
  const source = $page.url.searchParams.get('source');

  if (accessToken && source) {
    connections.add(source, accessToken);
    console.log('Added connection', source);
  }

  goto('/settings', { replaceState: true });
</script>
