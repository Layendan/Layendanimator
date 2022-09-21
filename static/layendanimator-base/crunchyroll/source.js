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

async function getSeasonal() {
  const data = await fetch("https://gogoanime.tel/new-season.html");
  const text = await data.text();
  const html = new DOMParser().parseFromString(text, "text/html");
  const items = Array.from(html.querySelectorAll("ul.items li"));
  return items.map((item) => {
    return {
      id: item.querySelector("a").href.replace("/category/", ""),
      title: {
        english: item.querySelector("p.name a").title,
      },
      coverImage: {
        large: item.querySelector(".img img").src,
      },
      siteUrl: item.querySelector("a").href,
      isAdult: false,
    };
  });
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
        isM3U8: item.isM3U8,
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
  const pageData = await fetch(`https://gogoanime.tel/${id}`);
  const text = await pageData.text();
  const html = new DOMParser().parseFromString(text, "text/html");
  const downloadLink = html.querySelector("li.dowloads a").href;
  return data.sources.map((item) => {
    return {
      url: item.url,
      downloadLink: downloadLink || item.url,
    };
  });
}
