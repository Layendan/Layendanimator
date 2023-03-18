import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';
import { source } from '$lib/model/source';
import { animeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import { redirect, error } from '@sveltejs/kit';
import { watched } from '$lib/model/watch';

async function fetchAnime(_fetch: typeof fetch, id: string): Promise<Anime> {
  const anime: Anime = await (
    await _fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/info/${id}?provider=${
        get(source).id
      }`,
      { signal: AbortSignal.timeout(15000) }
    )
  ).json();

  if (anime) {
    animeCache.set(id, anime);
  } else {
    throw error(404, 'Anime not found');
  }

  return anime;
}

export const load = (async ({ fetch, depends, params, url }) => {
  depends(params.id);

  const anime =
    animeCache.get(params.id) ?? (await fetchAnime(fetch, params.id));

  if (url.searchParams.get('autoplay') === 'true') {
    const data = get(watched)[params.id];
    throw redirect(
      302,
      `/${params.id}/${
        data?.[data.length - 1].episode.id ?? anime.episodes[0].id
      }`
    );
  }

  return {
    anime: anime
  };
}) satisfies PageLoad;
