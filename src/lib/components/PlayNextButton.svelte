<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { watching } from '$lib/model/watch';
  import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  export let anime: Anime;
  export let preHref = '';
  export let watchPercentage = 0.8;

  $: href = `${preHref}/${anime.source.id}/${anime.id}/${
    hasLastEpisode && lastEpisodeFinished
      ? anime.episodes[0].id
      : nextEpisode.id
  }`;

  $: lastWatched = $watching[`${anime.source.id}/${anime.id}`];
  $: nextEpisode =
    lastWatched?.watchEpisode?.number &&
    (lastWatched.watchedEpisodes[lastWatched.watchEpisode.id]?.percentage ??
      0) >= watchPercentage
      ? anime.episodes.find(
          episode => episode.number === lastWatched?.watchEpisode?.number + 1
        ) ??
        lastWatched.watchEpisode ??
        anime.episodes[0]
      : lastWatched?.watchEpisode ?? anime.episodes[0];
  $: lastEpisode = anime.episodes.at(-1);
  $: hasLastEpisode = lastWatched?.watchEpisode?.id === lastEpisode?.id;
  $: lastEpisodeFinished =
    lastEpisode &&
    (lastWatched?.watchedEpisodes[lastEpisode.id]?.percentage ?? 0) >=
      watchPercentage;
</script>

<a class="btn btn-secondary flex w-fit space-x-2" {href}>
  <Fa icon={faPlayCircle} size="lg" />
  <!-- Check if not user has watched anime yet -->
  <span>
    {lastWatched?.watchEpisode
      ? hasLastEpisode && lastEpisodeFinished
        ? 'Watch Again'
        : 'Continue Watching'
      : 'Start Watching'}
  </span>
</a>
