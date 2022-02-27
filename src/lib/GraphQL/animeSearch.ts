export default `query ($id: Int, $page: Int, $perPage: Int, $search: String, $isAdult: Boolean) {
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
      isAdult: $isAdult
      format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL]
      sort: [TRENDING_DESC, POPULARITY_DESC, START_DATE_DESC]
    ) {
      id
      title {
        romaji
        english
      }
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
    }
  }
}
`;
