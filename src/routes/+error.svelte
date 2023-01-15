<script>
  import { page } from '$app/stores';

  console.error(`${$page.status}: ${$page.error?.message}`);
</script>

<h1
  class="flex items-center justify-center h-screen w-screen mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
>
  {$page.status}: {$page.error?.message}
</h1>
