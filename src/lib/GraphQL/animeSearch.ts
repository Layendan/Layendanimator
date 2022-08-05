export default `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(
      id: $id
      search: $search
      type: ANIME
      format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL]
      sort: [SEARCH_MATCH, TRENDING_DESC, POPULARITY_DESC, SCORE_DESC, START_DATE_DESC]
    ) {
      id
      title {
        romaji
        english
				native
      }
			episodes
      coverImage {
        large
      }
      bannerImage
      siteUrl
      description(asHtml: false)
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
			averageScore
			meanScore
			tags {
				name
			}
      genres
      isAdult
    }
  }
}
`;

export function customSearch(searchName: string, idName?: string): string {
  return `${searchName}: Page(page: $page, perPage: $perPage) {
    media(
      id: $${idName ?? "id"}
      search: $${searchName}
      type: ANIME
      format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL]
      sort: [SEARCH_MATCH, TRENDING_DESC, POPULARITY_DESC, SCORE_DESC, START_DATE_DESC]
    ) {
      id
      title {
        romaji
        english
				native
      }
			episodes
      coverImage {
        large
      }
      bannerImage
      siteUrl
      description(asHtml: false)
      streamingEpisodes {
        title
        thumbnail
        url
        site
      }
			averageScore
			meanScore
			tags {
				name
			}
      genres
      isAdult
    }
  }
`;
}

export function multipleSearch(queries: string[]): string {
  return `query ($page: Int, $perPage: Int, $id: Int, ${queries.map((query) => {
    return `$${query}: String`;
  })}) {
    ${queries.map((query) => {
      return customSearch(query);
    })}
  }`;
}
