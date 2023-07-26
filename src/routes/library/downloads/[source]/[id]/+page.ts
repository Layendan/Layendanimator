import { convertAnime, downloads } from '$lib/model/downloads';
import { providers } from '$lib/model/source';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ depends, params }) => {
  depends(`/downloads/${params.source}/${params.id}`);

  const source = get(providers)[params.source];

  if (!source) throw error(404, 'Source not found');

  const download = get(downloads)[`${source.id}/${params.id}`];

  if (!download) {
    throw redirect(302, '/library');
  }

  const anime = await convertAnime(download.anime);

  return anime;
}) satisfies PageLoad;
