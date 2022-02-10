<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="js">
	import { fade } from 'svelte/transition';
	import Anime from '$lib/components/Anime.svelte';

	export let isAdult = false;

	async function getAnime(search_term) {
		console.log();

		// Here we define our query as a multi-line string
		// Storing it in a separate .graphql/.gql file is also possible
		var query = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {
	Page (page: $page, perPage: $perPage) {
	  pageInfo {
		total
		currentPage
		lastPage
		hasNextPage
		perPage
	  }
	  media (id: $id, search: $search, type: ANIME, isAdult: ${isAdult}, format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL], sort: [TRENDING_DESC, POPULARITY_DESC, START_DATE_DESC]) {
		id
		title {
		  romaji,
		  english
		}
		coverImage {
		  large
		}
		bannerImage
		siteUrl
		description (asHtml: false)
		streamingEpisodes {
			title,
			thumbnail,
			url,
			site
		}
	  }
	}
  }
  `;

		// Define our query variables and values that will be used in the query request
		var variables = {
			search: search_term,
			page: 1,
			perPage: 15
		};

		// Define the config we'll need for our Api request
		var url = 'https://graphql.anilist.co',
			options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					query: query,
					variables: variables
				})
			};

		let response = await fetch(url, options);
		let animes = await response.json();
		console.log(response);
		console.log(animes);
		return animes.data.Page.media;
	}

	// Create array of tabs that list anime
	const list = [
		{ title: 'Fate', data: getAnime('Fate') },
		{ title: 'My Hero Academia', data: getAnime('My Hero Academia') },
		{ title: 'Darling', data: getAnime('Darling') },
		{ title: 'Your Name', data: getAnime('Your Name') },
		{ title: 'Hunter X Hunter', data: getAnime('Hunter X Hunter') }
	];
	//   const promise = getAnime();
	console.log(list);

	async function getFeatured() {
		var query = `
	  query ($id: Int, $search: String) {
	Media (id: $id, search: $search, type: ANIME, isAdult: false, format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL], sort: [TRENDING_DESC, POPULARITY_DESC, START_DATE_DESC]) {
		id
		title {
		  romaji
		  english
		}
		coverImage {
		  large
		}
		siteUrl
		description
	  trailer {
		id
		site
	  }
	  }
	}
  `;

		// Define our query variables and values that will be used in the query request
		var variables = {};

		// Define the config we'll need for our Api request
		var url = 'https://graphql.anilist.co',
			options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({
					query: query,
					variables: variables
				})
			};

		let response = await fetch(url, options);
		let animes = await response.json();
		console.log(response);
		console.log(animes);
		return animes.data.Media;
	}
	// chech to see if running in windows
	// console.log(process.platform);
</script>

<svelte:head>
	<title>Layendanimator</title>
</svelte:head>

<section transition:fade>
	<div class="container">
		{#each list as section}
			<div
				id="animelist-{section.title.replaceAll(' ', '-').toLowerCase()}"
				class="anime-container"
				transition:fade
			>
				<hr class="solid" />
				<p class="title">{section.title}</p>
				<!-- change windows-scrollbar to check if running on windows -->
				<div class="items" class:windows-scrollbar={true} transition:fade>
					{#await section.data}
						<Anime />
						<Anime />
						<Anime />
						<Anime />
						<Anime />
						<Anime />
						<Anime />
					{:then animes}
						{#each animes as anime}
							<Anime
								name={anime.title.english ? anime.title.english : anime.title.romaji}
								thumbnail={anime.coverImage.large}
								banner={anime.bannerImage}
								link={anime.siteUrl}
								description={anime.description}
								episodes={anime.streamingEpisodes}
							/>
						{/each}
					{:catch error}
						<p>{error.message}</p>
					{/await}
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		padding: 1rem;
		margin-top: 3rem;
	}

	p {
		color: white;
	}

	.anime-container {
		margin-left: 10px;
		margin-right: 10px;
	}

	.items {
		overflow-x: scroll;
		overflow-y: visible;
		width: auto;
		white-space: nowrap;
		padding-bottom: 15px;
		/* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75); */
	}

	.items::before {
		content: '';
		position: absolute;
		z-index: 1;
		top: 0;
		left: 2rem;
		right: 0;
		bottom: 0;
		pointer-events: none;
		background: linear-gradient(to right, rgba(51, 51, 51, 1) 0%, rgba(51, 51, 51, 0) 2%);
	}

	.items::after {
		content: '';
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		right: 2rem;
		bottom: 0;
		pointer-events: none;
		background: linear-gradient(to right, rgba(51, 51, 51, 0) 98%, rgba(51, 51, 51, 1) 100%);
	}

	.windows-scrollbar::-webkit-scrollbar {
		height: 0.5em;
	}

	.windows-scrollbar::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	.windows-scrollbar::-webkit-scrollbar-thumb {
		background-color: rgba(169, 169, 169, 0.7);
		border-radius: 5px;
	}

	.windows-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(85, 85, 85, 0.7);
	}

	.title {
		font-size: 1.5em;
		font-weight: bold;
		margin-bottom: 12px;
		z-index: 3;
		position: relative;
	}

	hr.solid {
		margin-top: 20px;
		border-top: 1px solid rgba(66, 66, 66, 0.5);
		border-color: #555;
		box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
	}

	.container {
		padding: 1em;

		transition: all 0.2s ease-in-out;
	}
</style>
