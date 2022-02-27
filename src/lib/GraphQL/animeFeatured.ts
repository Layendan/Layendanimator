export default `query ($id: Int, $search: String) {
  Media(
    id: $id
    search: $search
    type: ANIME
    isAdult: false
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
    siteUrl
    description
    trailer {
      id
      site
    }
  }
}
`;
