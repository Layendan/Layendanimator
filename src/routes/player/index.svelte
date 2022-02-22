<script lang="ts">
	// Import required packages
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import loadingFailure from '$lib/components/loading_failure.jpeg';
	import EpisodeHolder from '$lib/player/EpisodeHolder.svelte';

	// read queries from link
	let link: string = $page.url.searchParams.get('link');
	let name: string = $page.url.searchParams.get('name');
	let thumbnail: string =
		$page.url.searchParams.get('thumbnail') != 'null'
			? $page.url.searchParams.get('thumbnail')
			: loadingFailure;
	let banner: string = $page.url.searchParams.get('banner');
	let description: string =
		$page.url.searchParams.get('description') != 'null'
			? $page.url.searchParams.get('description')
			: 'Failed to load description';
	let episodes: Array<any> = JSON.parse(window.sessionStorage.getItem(name + '-episodes'));

	// Page scroll
	let y = 0;
</script>

<svelte:window bind:scrollY={y} />

<svelte:head>
	<title>{name}</title>
</svelte:head>

<section transition:fade>
	{#if banner != 'null'}
		<div class="banner" transition:fade>
			<img
				src={banner}
				alt={name}
				style="transform: scale({y < 345 ? 0.005 * y + 1 : 0.005 * 345 + 1}); filter: blur({y < 345
					? 0.05 * y
					: 0.05 * 345}px) brightness({y < 345 ? -y / 345 + 1 : 0});"
			/>
		</div>
	{/if}
	<div in:fade out:fade class="text">
		<div class="container">
			<div class="important-info">
				<div>
					<img
						src={thumbnail}
						transition:fade
						on:error={() => (thumbnail = loadingFailure)}
						class:overlap={banner != 'null'}
						class="thumbnail"
						alt={name}
					/>
				</div>
				<div>
					<a href={link} class="title">{name}</a>
					<p transition:fade class="description">
						{@html description}
					</p>
				</div>
			</div>
		</div>
	</div>
	<div class="episodes">
		<p transition:fade>
			<EpisodeHolder {episodes} />
		</p>
	</div>
</section>

<style>
	a {
		color: white;
	}

	a:hover {
		text-decoration: none;
	}
	.banner {
		width: 100%;
		/* height: 348px; */
		z-index: 0;
		display: block;
		overflow: hidden;
		position: relative;
	}

	.banner img {
		width: 100%;
		height: 348px;
		object-fit: cover;
		object-position: center;
		position: relative;
	}

	.banner::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: linear-gradient(to bottom, rgba(31, 31, 31, 0.2) 50%, rgba(31, 31, 31, 1) 100%);
	}

	.text {
		z-index: 1;
		overflow: visible;
		position: relative;
		display: block;
		margin-top: 0;
		background-color: rgb(31, 31, 31);
		padding: 1rem;
	}

	.overlap {
		margin-top: -125px;
	}

	.thumbnail {
		z-index: inherit;
		position: relative;
		border-radius: 5px;
		/* aspect-ratio: initial; */
		height: fit-content;
		max-height: 305px;
	}

	.important-info {
		display: grid;
		grid-column-gap: 30px;
		grid-template-columns: 215px auto;
		min-width: 320px;
	}

	.container {
		display: table;
		margin: 0 auto;
	}

	.title {
		font-size: x-large;
		font-weight: 300;
	}
	.description {
		max-width: 900px;
		font-size: small;
		font-weight: 300;
		line-height: 1.5;
		height: min-content;
	}
</style>
