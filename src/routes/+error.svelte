<script>
  import { page } from '$app/stores';
  import { notifications } from '$lib/model/notifications';

  console.error(`${$page.status}: ${$page.error?.message}`);
  notifications.addNotification({
    title: `${$page.status}: ${$page.error?.message}`,
    message: 'Check console for more information.',
    type: 'error'
  });
</script>

<h1
  class="absolute inset-1/2 w-max -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
>
  {$page.status}: {$page.error?.message}
</h1>
