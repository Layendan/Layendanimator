<script lang="ts">
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	export let tabs: {
		label: string;
		page: any;
	}[] = [{ label: 'label', page: null }];

	let label: string = tabs[0].label;
	let newLabel: string = tabs[0].label;
	let page: any = tabs[0].page;

	function setPage(tab: { label: string; page: any }) {
		label = tab.label;
		page = tab.page;
	}

	function updatePage() {
		newLabel = label;
	}

	onDestroy(() => {
		// newLabel = Math.random().toString();
	});
</script>

<div>
	<div class="tab">
		{#each tabs as tab}
			<button class="tablinks" class:active={tab.label === label} on:click={() => setPage(tab)}
				>{tab.label}</button
			>
		{/each}
	</div>

	{#if label === newLabel}
		<div class="tabcontent" on:outroend={updatePage} transition:slide>
			<svelte:component this={page} />
		</div>
	{/if}
</div>

<style>
	/* Style the tab */
	.tab {
		overflow: hidden;
		border: 1px solid #ccc;
		background-color: var(--pure-white);
		color: var(--text-color);
	}

	/* Style the buttons that are used to open the tab content */
	.tab button {
		background-color: inherit;
		float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 14px 16px;
		transition: 0.3s;
		text-transform: uppercase;
	}

	/* Change background color of buttons on hover */
	.tab button:hover {
		color: var(--accent-color);
	}

	/* Create an active/current tablink class */
	.tab button.active {
		background-color: var(--secondary-color);
	}

	/* Style the tab content */
	.tabcontent {
		color: var(--text-color);
		padding: 6px 12px;
		border: 1px solid #ccc;
		border-top: none;
	}
</style>
