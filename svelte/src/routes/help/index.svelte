<script lang="ts">
	import { slide } from 'svelte/transition';
	import Tab from '$lib/components/tab.svelte';

	import Start from './tab/start.svelte';
	import Command from './tab/command.svelte';
	import Note from './tab/note.svelte';
	import Renderer from './tab/renderer.svelte';

	const tabs: {
		label: string;
		page: any;
	}[] = [
		{ label: 'Get Started', page: Start },
		{ label: 'Command', page: Command },
		{ label: 'Notes', page: Note },
		{ label: 'Renderer', page: Renderer }
	];
</script>

<svelte:head>
	<title>Help</title>
</svelte:head>

<div class="content" transition:slide>
	<h1>MEMENTO SvelteKit Electron TypeScript</h1>

	<p style="text-align: center;">
		<i>Template to create desktop application with SvelteKit, Electron and TypeScript</i>
	</p>

	<Tab {tabs} />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
