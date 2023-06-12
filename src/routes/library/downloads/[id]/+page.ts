import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { convertAnime, downloads } from '$lib/model/downloads';

export const load = (async ({ depends, params }) => {
  depends(`/downloads/${params.id}`);

  const download = get(downloads)[params.id];

  if (!download) {
    throw redirect(300, '/library');
  }

  const anime = await convertAnime(download.anime);

  return anime;
}) satisfies PageLoad;
