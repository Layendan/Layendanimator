<script lang="ts">
	export let episode: any;
</script>

<a href={episode.url}>
	<img src={episode.thumbnail} alt={episode.title} />
	<p>
		{episode.title} on <i>{episode.site}</i>
	</p>
</a>
