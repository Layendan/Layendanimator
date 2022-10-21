async function getRecentEpisodes() {
  let recentEpisodes = (
    await (
      await fetch(
        "https://api.consumet.org/meta/anilist/recent-episodes?perPage=20"
      )
    ).json()
  ).results;
  recentEpisodes = recentEpisodes.map((item) => {
    return {
      media: {
        id: item.id,
        title: {
          native: item.title.native,
          romaji: item.title.romaji,
          english: item.title.english,
        },
        coverImage: {
          large: item.image,
        },
        siteUrl: item.url,
        isAdult: false,
      },
      episode: item.episodeNumber,
    };
  });

  return recentEpisodes;
}

async function getTopAiring() {
  let topAiring = (
    await (
      await fetch("https://api.consumet.org/meta/anilist/trending?perPage=20")
    ).json()
  ).results;
  topAiring = topAiring.map((item) => {
    return {
      id: item.id,
      title: {
        native: item.title.native,
        romaji: item.title.romaji,
        english: item.title.english,
      },
      coverImage: {
        large: item.image,
      },
      bannerImage: item.cover,
      siteUrl: item.url,
      genres: item.genres,
      isAdult: false,
    };
  });

  return topAiring;
}

async function getPopular() {
  let topAiring = (
    await (
      await fetch("https://api.consumet.org/meta/anilist/popular?perPage=20")
    ).json()
  ).results;
  topAiring = topAiring.map((item) => {
    return {
      id: item.id,
      title: {
        native: item.title.native,
        romaji: item.title.romaji,
        english: item.title.english,
      },
      coverImage: {
        large: item.image,
      },
      bannerImage: item.cover,
      siteUrl: item.url,
      genres: item.genres,
      isAdult: false,
    };
  });

  return topAiring;
}

async function searchAnime(query) {
  const response = await fetch(
    `https://api.consumet.org/meta/anilist/${query}?perPage=20`
  );
  const data = (await response.json()).results;
  return data.map((item) => {
    return {
      id: item.id,
      title: {
        native: item.title.native,
        romaji: item.title.romaji,
        english: item.title.english,
      },
      coverImage: {
        large: item.image,
      },
      isAdult: false,
    };
  });
}

async function getAnime(id) {
  const response = await fetch(
    `https://api.consumet.org/meta/anilist/info/${id}?provider=zoro`
  );
  const data = await response.json();
  return {
    id: data.id,
    title: {
      native: data.title.native,
      romaji: data.title.romaji,
      english: data.title.english,
    },
    coverImage: {
      large: data.image,
    },
    bannerImage: data.cover,
    description: data.description,
    genres: data.genres,
    streamingEpisodes: data.episodes.map((item) => {
      return {
        id: item.id,
        name: item.title,
        thumbnail: item.image,
        number: item.number,
        subOrDub: data.subOrDub,
        url: item.url,
        description: item.description,
      };
    }),
    genres: data.genres,
    isAdult: false,
  };
}

async function getStreamingLinks(id) {
  const response = await fetch(
    `https://api.consumet.org/meta/anilist/watch/${id}?provider=zoro`
  );
  const data = await response.json();
  const subtitles = data.subtitles.map((item) => {
    return {
      src: item.url,
      lang: item.lang,
    };
  });
  return {
    mirrors: data.sources.map((item) => {
      return {
        url: item.url,
        quality: item.quality,
        isM3U8: item.isM3U8,
        subtitles: subtitles,
      };
    }),
  };
}
