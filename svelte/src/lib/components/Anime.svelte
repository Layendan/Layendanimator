<script>
	import { fade } from 'svelte/transition';
	import loadingFailure from '$lib/components/loading_failure.jpeg';

	export let name = undefined;
	export let link = null;
	export let thumbnail = loadingFailure;
	export let banner = loadingFailure;
	export let description = 'unavailable';
</script>

<main transition:fade>
	<body>
		<a
			href="/player?link={link}&name={name}&thumbnail={thumbnail}&banner={banner}&description={description}"
			class:unselectable={link == null}
		>
			<span class="holder">
				<!-- svelte-ignore a11y-missing-attribute -->
				<img
					on:error={() => (thumbnail = loadingFailure)}
					src={thumbnail}
					class:unselectable={!link}
					in:fade
					loading="lazy"
				/>
				<div class="info">
					<div class="text" in:fade={{ delay: 200 }}>
						<h1>{name}</h1>
						<div class="module">
							<p class="line-clamp">
								{@html description}
							</p>
						</div>
					</div>
				</div>
			</span>
		</a>
	</body>
</main>

<style>
	main {
		display: inline-block;
		vertical-align: top;
		margin-left: 15px;
		margin-right: 15px;
	}

	.unselectable {
		pointer-events: none;
	}

	main a {
		text-decoration: none;
	}

	main img {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		max-width: 160px;
		min-width: 160px;
		border-radius: 10px 0 0 10px;
		aspect-ratio: 46/65;

		transition: filter 0.2s ease-in-out;
	}

	main a:hover img {
		filter: brightness(115%);
	}
	main a:hover .text {
		transform: translateY(-1px);
	}
	main a:hover .info {
		background-color: rgb(40, 40, 40);
	}

	a {
		text-decoration: none;
		color: white;
	}

	h1 {
		display: inline-flex;
		font-size: 1em;
		margin: 0;
		margin-left: 1em;
		margin-right: 1em;
		padding-bottom: 0;
		max-width: 160px;
		height: auto;
		word-wrap: break-word;
		white-space: normal;
		hyphens: auto;
	}

	p {
		font-size: 1em;
		margin: 0;
		margin-left: 1em;
		margin-top: 1em;
		max-width: fit-content;
		height: auto;
		word-wrap: break-word;
		white-space: normal;
		hyphens: auto;
		font-weight: 100;
		text-align: justify;
		padding-right: 1em;
	}

	.holder {
		max-width: 400px;
		width: 400px;
		min-width: 160px;
		display: flex;
		border-radius: 10px;
		border-color: gray;
		border-style: solid;
		border-width: 2px;
		z-index: 2;
	}

	.info {
		width: 100%;
		height: 100%;
		background-color: rgb(30, 30, 30);
		border-radius: 0 10px 10px 0;
		padding-top: 10px;
		height: 226px;

		transition: background-color 0.2s ease-in-out;
	}

	.text {
		transition: transform 0.2s ease-in-out;
		color: white;
	}

	.module {
		overflow-y: hidden;
	}

	.line-clamp {
		display: -webkit-box;
		/* number of lines to clamp */
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
	}
</style>
