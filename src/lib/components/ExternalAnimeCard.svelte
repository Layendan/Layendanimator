<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';

  export let anime: Anime;

  let imageLoaded = true;
</script>

<a
  href="https://anilist.co/anime/{anime.id}"
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group"
>
  <img
    src={imageLoaded ? anime.image : '/assets/loading_failure.jpeg'}
    alt={anime.title.english ?? anime.title.romaji}
    on:error={() => (imageLoaded = false)}
    style:--anime-color={anime.color}
    class="w-full rounded-lg bg-base-200 object-cover shadow-xl ring ring-transparent transition-shadow duration-200
              {anime.color
      ? 'hover:ring-[--anime-color] group-focus-visible:ring-[--anime-color]'
      : 'hover:ring-accent group-focus-visible:ring-accent'}"
  />
</a>
