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

async function getSeasonal() {
  const data = await fetch("https://gogoanime.tel/new-season.html");
  const text = await data.text();
  const html = new DOMParser().parseFromString(text, "text/html");
  const items = Array.from(html.querySelectorAll("ul.items li"));
  return items.map((item) => {
    // TODO: Change back to get href, but it doesn't work on windows for some reason
    // id: item.querySelector("a").href.replace("/category/", ""),
    const id = item
      .querySelector("a")
      .title.toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[!*:(),\.;?]*/g, "");
    return {
      id: id,
      title: {
        english: item.querySelector("p.name a").title,
      },
      coverImage: {
        large: item.querySelector(".img img").src,
      },
      siteUrl: "https://gogoanime.tel/category/" + id,
      isAdult: false,
    };
  });
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
    `https://api.consumet.org/meta/anilist/info/${id}`
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
    `https://api.consumet.org/meta/anilist/watch/${id}`
  );
  const data = await response.json();
  const pageData = await fetch(`https://gogoanime.tel/${id}`);
  const text = await pageData.text();
  const html = new DOMParser().parseFromString(text, "text/html");
  const downloadLink = html.querySelector("li.dowloads a").href;
  return data.sources.map((item) => {
    return {
      url: item.url,
      quality: item.quality,
      isM3U8: item.isM3U8,
      downloadLink: downloadLink || item.url,
    };
  });
}
