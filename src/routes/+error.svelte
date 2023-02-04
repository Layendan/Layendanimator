<script>
  import { page } from '$app/stores';

  console.error(`${$page.status}: ${$page.error?.message}`);
</script>

<h1
  class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-max text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
>
  {$page.status}: {$page.error?.message}
</h1>
