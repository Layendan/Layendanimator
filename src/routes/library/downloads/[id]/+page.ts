import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { watched } from '$lib/model/watch';
import { convertAnime, downloads } from '$lib/model/downloads';

export const load = (async ({ depends, params, url }) => {
  depends(`/downloads/${params.id}`);

  const download = get(downloads)[params.id];

  if (!download) {
    throw redirect(300, '/library');
  }

  const anime = await convertAnime(download.anime);

  if (url.searchParams.get('autoplay') === 'true') {
    const data = get(watched)[params.id];
    throw redirect(
      302,
      `downloads/${params.id}/${
        data?.[data.length - 1].episode.id ?? anime.episodes[0].id
      }`
    );
  }

  return anime;
}) satisfies PageLoad;
