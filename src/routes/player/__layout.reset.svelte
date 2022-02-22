<script>
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import '$lib/components/nprogress.css';

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<main>
	<slot />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;

		color: white;

		transition: all 0.2s ease-in-out;
	}

	@media (min-width: 480px) {
	}
</style>
