async function getRecentEpisodes() {
  let recentEpisodes = (
    await (
      await fetch(
        "https://consumet-api.herokuapp.com/anime/gogoanime/recent-episodes"
      )
    ).json()
  ).results;
  recentEpisodes = recentEpisodes.map((item) => {
    return {
      media: {
        id: item.id,
        title: {
          english: item.title,
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
      await fetch(
        "https://consumet-api.herokuapp.com/anime/gogoanime/top-airing"
      )
    ).json()
  ).results;
  topAiring = topAiring.map((item) => {
    return {
      id: item.id,
      title: {
        english: item.title,
      },
      coverImage: {
        large: item.image,
      },
      siteUrl: item.url,
      genres: item.genres,
      isAdult: false,
    };
  });

  return topAiring;
}

async function searchAnime(query) {
  const response = await fetch(
    `https://consumet-api.herokuapp.com/anime/gogoanime/${query}`
  );
  const data = (await response.json()).results;
  return data.map((item) => {
    return {
      id: item.id,
      title: {
        english: item.title,
      },
      coverImage: {
        large: item.image,
      },
      siteUrl: item.url,
      isAdult: false,
    };
  });
}

async function getAnime(id) {
  const response = await fetch(
    `https://consumet-api.herokuapp.com/anime/gogoanime/info/${id}`
  );
  const data = await response.json();
  return {
    id: data.id,
    title: {
      english: data.title,
    },
    coverImage: {
      large: data.image,
    },
    siteUrl: data.url,
    description: data.description,
    streamingEpisodes: data.episodes.map((item) => {
      return {
        id: item.id,
        number: item.number,
        subOrDub: data.subOrDub,
        url: item.url,
      };
    }),
    genres: data.genres,
    isAdult: false,
  };
}

async function getStreamingLinks(id) {
  const response = await fetch(
    `https://consumet-api.herokuapp.com/anime/gogoanime/watch/${id}`
  );
  const data = await response.json();
  return data.sources.map((item) => {
    return {
      url: item.url,
    };
  });
}
