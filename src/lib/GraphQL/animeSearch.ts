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
